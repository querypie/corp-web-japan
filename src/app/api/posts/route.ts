import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts
 * - Query params: status, sns_account_id, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // 'draft' | 'scheduled' | 'published' | 'failed'
    const accountId = searchParams.get("sns_account_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (accountId) {
      query = query.eq("sns_account_id", accountId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts: data || [],
      count: count || data?.length || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * - Body: { content, media_urls, media_type, sns_account_id, scheduled_at?, auto_repost?, source_type?, source_id? }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      content,
      media_urls = [],
      media_type = "image",
      sns_account_id,
      scheduled_at,
      auto_repost = false,
      auto_repost_hours,
      source_type,
      source_id,
    } = body;

    if (!sns_account_id) {
      return NextResponse.json(
        { error: "sns_account_id is required" },
        { status: 400 }
      );
    }

    // Verify the SNS account belongs to the user
    const { data: account, error: accountError } = await supabase
      .from("sns_accounts")
      .select("id, platform, is_active")
      .eq("id", sns_account_id)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "SNS account not found or access denied" },
        { status: 404 }
      );
    }

    if (!account.is_active) {
      return NextResponse.json(
        { error: "SNS account is not active" },
        { status: 400 }
      );
    }

    // Determine status: scheduled or draft
    const status = scheduled_at ? "scheduled" : "draft";

    // Insert post
    const { data: post, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        sns_account_id,
        content,
        media_urls,
        media_type,
        status,
        scheduled_at: scheduled_at || null,
        auto_repost,
        auto_repost_hours,
        source_type,
        source_id,
      })
      .select(
        `
        id,
        content,
        media_urls,
        media_type,
        status,
        scheduled_at,
        created_at,
        sns_accounts:sns_account_id (
          id,
          platform,
          username,
          display_name
        )
      `
      )
      .single();

    if (insertError) {
      console.error("Error creating post:", insertError);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
