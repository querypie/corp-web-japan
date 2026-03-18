import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/me
 * - Returns current user profile with stats
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get account count
    const { count: accountCount } = await supabase
      .from("sns_accounts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", authUser.id)
      .eq("is_active", true);

    // Get post counts by status
    const { count: scheduledCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", authUser.id)
      .eq("status", "scheduled");

    const { count: publishedCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", authUser.id)
      .eq("status", "published");

    return NextResponse.json({
      user,
      stats: {
        account_count: accountCount || 0,
        scheduled_count: scheduledCount || 0,
        published_count: publishedCount || 0,
      },
    });
  } catch (error) {
    console.error("GET /api/user/me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/me
 * - Update user profile (display_name, avatar_url, etc.)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    // Allowed fields to update
    const allowedFields = ["display_name", "avatar_url"];

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

    const { data: user, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", authUser.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PATCH /api/user/me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
