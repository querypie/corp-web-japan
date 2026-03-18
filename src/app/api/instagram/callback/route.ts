import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INSTAGRAM_CONFIG, getRedirectUri } from "@/lib/instagram/config";
import type {
  InstagramShortLivedTokenResponse,
  InstagramLongLivedTokenResponse,
  InstagramUserProfile,
} from "@/lib/instagram/types";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${origin}/accounts/add?error=instagram_denied`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${origin}/accounts/add?error=invalid_callback`
    );
  }

  // Verify CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("instagram_oauth_state")?.value;
  cookieStore.delete("instagram_oauth_state");

  if (state !== storedState) {
    return NextResponse.redirect(
      `${origin}/accounts/add?error=csrf_mismatch`
    );
  }

  // Verify authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    // Step 1: Exchange code for short-lived token
    const tokenForm = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(),
      code,
    });

    const shortTokenRes = await fetch(INSTAGRAM_CONFIG.tokenUrl, {
      method: "POST",
      body: tokenForm,
    });

    if (!shortTokenRes.ok) {
      console.error(
        "Short-lived token error:",
        await shortTokenRes.text()
      );
      return NextResponse.redirect(
        `${origin}/accounts/add?error=token_exchange_failed`
      );
    }

    const shortToken: InstagramShortLivedTokenResponse =
      await shortTokenRes.json();

    // Step 2: Exchange for long-lived token (60-day)
    const longTokenParams = new URLSearchParams({
      grant_type: "ig_exchange_token",
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      access_token: shortToken.access_token,
    });

    const longTokenRes = await fetch(
      `${INSTAGRAM_CONFIG.longLivedTokenUrl}?${longTokenParams.toString()}`
    );

    if (!longTokenRes.ok) {
      console.error("Long-lived token error:", await longTokenRes.text());
      return NextResponse.redirect(
        `${origin}/accounts/add?error=long_token_failed`
      );
    }

    const longToken: InstagramLongLivedTokenResponse =
      await longTokenRes.json();

    // Step 3: Fetch user profile
    const profileRes = await fetch(
      `${INSTAGRAM_CONFIG.graphApiBase}/me?fields=id,username,name,profile_picture_url,account_type&access_token=${longToken.access_token}`
    );

    if (!profileRes.ok) {
      return NextResponse.redirect(
        `${origin}/accounts/add?error=profile_fetch_failed`
      );
    }

    const profile: InstagramUserProfile = await profileRes.json();

    // Step 4: Calculate token expiry
    const tokenExpiresAt = new Date(
      Date.now() + longToken.expires_in * 1000
    ).toISOString();

    // Step 5: Get user's default project
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!project) {
      return NextResponse.redirect(
        `${origin}/accounts/add?error=no_project`
      );
    }

    // Step 6: Check if this Instagram account already exists
    const { data: existing } = await supabase
      .from("sns_accounts")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform_user_id", profile.id)
      .single();

    if (existing) {
      // Update existing account's token
      const { error: updateError } = await supabase
        .from("sns_accounts")
        .update({
          access_token: longToken.access_token,
          token_expires_at: tokenExpiresAt,
          username: profile.username,
          display_name: profile.name || profile.username,
          avatar_url: profile.profile_picture_url || null,
          is_active: true,
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Update error:", updateError);
        return NextResponse.redirect(
          `${origin}/accounts/add?error=save_failed`
        );
      }
    } else {
      // Insert new account
      const { error: insertError } = await supabase
        .from("sns_accounts")
        .insert({
          user_id: user.id,
          project_id: project.id,
          platform: "instagram",
          platform_user_id: profile.id,
          username: profile.username,
          display_name: profile.name || profile.username,
          avatar_url: profile.profile_picture_url || null,
          access_token: longToken.access_token,
          refresh_token: null,
          token_expires_at: tokenExpiresAt,
          is_active: true,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.redirect(
          `${origin}/accounts/add?error=save_failed`
        );
      }
    }

    return NextResponse.redirect(
      `${origin}/accounts?success=instagram_connected`
    );
  } catch (err) {
    console.error("Instagram callback error:", err);
    return NextResponse.redirect(
      `${origin}/accounts/add?error=unexpected`
    );
  }
}
