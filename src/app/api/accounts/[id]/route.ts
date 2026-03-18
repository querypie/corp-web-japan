import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/accounts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("sns_accounts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Don't expose tokens to client
    const { access_token, refresh_token, ...account } = data;

    return NextResponse.json({ account });
  } catch (error) {
    console.error("GET /api/accounts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/accounts/[id]
 * - Update account settings (is_active, ai_style_settings, etc.)
 * - Can also update tokens if needed
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    // Allowed fields to update
    const allowedFields = [
      "is_active",
      "ai_style_settings",
      "username",
      "display_name",
      "avatar_url",
      "access_token",
      "refresh_token",
      "token_expires_at",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sns_accounts")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, platform, username, display_name, avatar_url, is_active, ai_style_settings, created_at, updated_at")
      .single();

    if (error) {
      console.error("Error updating account:", error);
      return NextResponse.json(
        { error: "Failed to update account" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account: data });
  } catch (error) {
    console.error("PATCH /api/accounts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/accounts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("sns_accounts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting account:", error);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/accounts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
