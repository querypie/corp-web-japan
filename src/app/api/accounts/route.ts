import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/accounts
 * - Returns all SNS accounts for the authenticated user
 * - Query params: platform?, is_active?
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
    const platform = searchParams.get("platform");
    const isActive = searchParams.get("is_active");

    let query = supabase
      .from("sns_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (platform) {
      query = query.eq("platform", platform);
    }

    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching accounts:", error);
      return NextResponse.json(
        { error: "Failed to fetch accounts" },
        { status: 500 }
      );
    }

    // Don't expose access tokens to the client
    const sanitizedAccounts = (data || []).map(
      ({ access_token: _at, refresh_token: _rt, ...account }: { access_token: string; refresh_token: string | null; [key: string]: unknown }) => account
    );

    return NextResponse.json({ accounts: sanitizedAccounts });
  } catch (error) {
    console.error("GET /api/accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/accounts
 * - Create a new SNS account connection
 * - Body: { platform, platform_user_id, username, display_name?, avatar_url?, access_token, refresh_token?, token_expires_at?, ai_style_settings? }
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
      platform,
      platform_user_id,
      username,
      display_name,
      avatar_url,
      access_token,
      refresh_token,
      token_expires_at,
      ai_style_settings = {},
    } = body;

    if (!platform || !platform_user_id || !username || !access_token) {
      return NextResponse.json(
        { error: "Missing required fields: platform, platform_user_id, username, access_token" },
        { status: 400 }
      );
    }

    // Get user's default project
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace found. Please create a workspace first." },
        { status: 404 }
      );
    }

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("workspace_id", workspace.id)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: "No project found. Please create a project first." },
        { status: 404 }
      );
    }

    // Check if account already exists (prevent duplicates)
    const { data: existing } = await supabase
      .from("sns_accounts")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("platform_user_id", platform_user_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "This SNS account is already connected" },
        { status: 409 }
      );
    }

    // Insert new account
    const { data: account, error: insertError } = await supabase
      .from("sns_accounts")
      .insert({
        user_id: user.id,
        project_id: project.id,
        platform,
        platform_user_id,
        username,
        display_name,
        avatar_url,
        access_token,
        refresh_token,
        token_expires_at,
        ai_style_settings,
        is_active: true,
      })
      .select("id, platform, username, display_name, avatar_url, is_active, created_at")
      .single();

    if (insertError) {
      console.error("Error creating account:", insertError);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("POST /api/accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
