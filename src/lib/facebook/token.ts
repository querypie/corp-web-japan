import { FACEBOOK_CONFIG } from "./config";
import type { FacebookTokenResponse } from "./types";
import { createClient } from "@/lib/supabase/server";

/**
 * Refresh a long-lived user access token.
 * Facebook long-lived user tokens can be refreshed for another 60 days
 * before they expire.
 */
export async function refreshFacebookUserToken(
  currentAccessToken: string
): Promise<FacebookTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    fb_exchange_token: currentAccessToken,
  });

  const res = await fetch(
    `${FACEBOOK_CONFIG.tokenUrl}?${params.toString()}`
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Facebook token refresh failed: ${errText}`);
  }

  return res.json();
}

/**
 * Re-fetch the page access token using the user's long-lived token.
 * Page access tokens derived from long-lived user tokens don't expire,
 * so this is only needed if the user token was refreshed.
 */
export async function refreshPageToken(
  userAccessToken: string,
  pageId: string
): Promise<string> {
  const res = await fetch(
    `${FACEBOOK_CONFIG.graphApiBase}/${pageId}?fields=access_token&access_token=${userAccessToken}`
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Page token refresh failed: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

export function needsRefresh(tokenExpiresAt: string | null): boolean {
  if (!tokenExpiresAt) return false;
  const expiresAt = new Date(tokenExpiresAt).getTime();
  const bufferMs =
    FACEBOOK_CONFIG.tokenRefreshBufferDays * 24 * 60 * 60 * 1000;
  return Date.now() > expiresAt - bufferMs;
}

/**
 * Ensure the page access token is valid.
 * If the user token (stored as refresh_token) needs refresh,
 * refresh it and re-fetch the page token.
 */
export async function ensureValidToken(
  accountId: string,
  pageAccessToken: string,
  userAccessToken: string | null,
  tokenExpiresAt: string | null
): Promise<string> {
  // If we don't have a user token or it doesn't need refresh,
  // the page token is still valid (page tokens don't expire)
  if (!userAccessToken || !needsRefresh(tokenExpiresAt)) {
    return pageAccessToken;
  }

  // Refresh the user token
  const refreshed = await refreshFacebookUserToken(userAccessToken);
  const newExpiresAt = new Date(
    Date.now() + refreshed.expires_in * 1000
  ).toISOString();

  const supabase = await createClient();

  // Get the page ID to re-fetch page token
  const { data: account } = await supabase
    .from("sns_accounts")
    .select("platform_user_id")
    .eq("id", accountId)
    .single();

  if (!account) {
    throw new Error("Account not found");
  }

  // Get new page token from refreshed user token
  const newPageToken = await refreshPageToken(
    refreshed.access_token,
    account.platform_user_id
  );

  // Update both tokens in DB
  await supabase
    .from("sns_accounts")
    .update({
      access_token: newPageToken,
      refresh_token: refreshed.access_token,
      token_expires_at: newExpiresAt,
    })
    .eq("id", accountId);

  return newPageToken;
}
