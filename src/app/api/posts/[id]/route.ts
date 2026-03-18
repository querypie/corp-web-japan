import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts/[id]
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
      .from("posts")
      .select(
        `
        id,
        content,
        media_urls,
        media_type,
        status,
        scheduled_at,
        published_at,
        platform_post_id,
        auto_repost,
        auto_repost_hours,
        error_message,
        source_type,
        source_id,
        created_at,
        updated_at,
        sns_account_id,
        sns_accounts:sns_account_id (
          id,
          platform,
          username,
          display_name,
          avatar_url,
          is_active
        )
      `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/posts/[id]
 * - Update post content, schedule, status, etc.
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

    // Only allow updating certain fields
    const allowedFields = [
      "content",
      "media_urls",
      "media_type",
      "scheduled_at",
      "auto_repost",
      "auto_repost_hours",
      "status",
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
      .from("posts")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(
        `
        id,
        content,
        media_urls,
        media_type,
        status,
        scheduled_at,
        published_at,
        created_at,
        updated_at,
        sns_accounts:sns_account_id (
          id,
          platform,
          username,
          display_name
        )
      `
      )
      .single();

    if (error) {
      console.error("Error updating post:", error);
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
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
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting post:", error);
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
