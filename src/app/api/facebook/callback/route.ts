import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FACEBOOK_CONFIG, getFacebookRedirectUri } from "@/lib/facebook/config";
import type {
  FacebookTokenResponse,
  FacebookPagesResponse,
} from "@/lib/facebook/types";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${origin}/accounts/add?error=facebook_denied`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${origin}/accounts/add?error=invalid_callback`
    );
  }

  // Verify CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("facebook_oauth_state")?.value;
  cookieStore.delete("facebook_oauth_state");

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
    // Step 1: Exchange code for short-lived user access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      redirect_uri: getFacebookRedirectUri(),
      code,
    });

    const tokenRes = await fetch(
      `${FACEBOOK_CONFIG.tokenUrl}?${tokenParams.toString()}`
    );

    if (!tokenRes.ok) {
      console.error("Facebook token error:", await tokenRes.text());
      return NextResponse.redirect(
        `${origin}/accounts/add?error=token_exchange_failed`
      );
    }

    const shortToken: FacebookTokenResponse = await tokenRes.json();

    // Step 2: Exchange for long-lived user access token (60-day)
    const longTokenParams = new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: process.env.FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      fb_exchange_token: shortToken.access_token,
    });

    const longTokenRes = await fetch(
      `${FACEBOOK_CONFIG.tokenUrl}?${longTokenParams.toString()}`
    );

    if (!longTokenRes.ok) {
      console.error("Facebook long-lived token error:", await longTokenRes.text());
      return NextResponse.redirect(
        `${origin}/accounts/add?error=long_token_failed`
      );
    }

    const longToken: FacebookTokenResponse = await longTokenRes.json();

    const userTokenExpiresAt = new Date(
      Date.now() + longToken.expires_in * 1000
    ).toISOString();

    // Step 3: Get user's managed pages
    const pagesRes = await fetch(
      `${FACEBOOK_CONFIG.graphApiBase}/me/accounts?fields=id,name,access_token,picture,category&access_token=${longToken.access_token}`
    );

    if (!pagesRes.ok) {
      console.error("Facebook pages error:", await pagesRes.text());
      return NextResponse.redirect(
        `${origin}/accounts/add?error=pages_fetch_failed`
      );
    }

    const pagesData: FacebookPagesResponse = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(
        `${origin}/accounts/add?error=no_facebook_pages`
      );
    }

    // Step 4: Get user's default project
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

    // Step 5: Save each page as a separate account
    // Page access tokens derived from long-lived user tokens don't expire
    let connectedCount = 0;

    for (const page of pagesData.data) {
      const { data: existing } = await supabase
        .from("sns_accounts")
        .select("id")
        .eq("user_id", user.id)
        .eq("platform", "facebook")
        .eq("platform_user_id", page.id)
        .single();

      const avatarUrl = page.picture?.data?.is_silhouette
        ? null
        : page.picture?.data?.url || null;

      if (existing) {
        // Update existing account's token
        await supabase
          .from("sns_accounts")
          .update({
            access_token: page.access_token,
            token_expires_at: null, // page tokens don't expire
            display_name: page.name,
            avatar_url: avatarUrl,
            is_active: true,
          })
          .eq("id", existing.id);
      } else {
        // Insert new account
        await supabase.from("sns_accounts").insert({
          user_id: user.id,
          project_id: project.id,
          platform: "facebook",
          platform_user_id: page.id,
          username: page.name,
          display_name: page.name,
          avatar_url: avatarUrl,
          access_token: page.access_token,
          refresh_token: longToken.access_token, // store user token for potential refresh
          token_expires_at: userTokenExpiresAt,
          is_active: true,
        });
      }
      connectedCount++;
    }

    return NextResponse.redirect(
      `${origin}/accounts?success=facebook_connected&count=${connectedCount}`
    );
  } catch (err) {
    console.error("Facebook callback error:", err);
    return NextResponse.redirect(
      `${origin}/accounts/add?error=unexpected`
    );
  }
}
