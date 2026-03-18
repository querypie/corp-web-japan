import { INSTAGRAM_CONFIG } from "./config";
import type { InstagramLongLivedTokenResponse } from "./types";
import { createClient } from "@/lib/supabase/server";

export async function refreshInstagramToken(
  currentAccessToken: string
): Promise<InstagramLongLivedTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: currentAccessToken,
  });

  const res = await fetch(
    `${INSTAGRAM_CONFIG.refreshTokenUrl}?${params.toString()}`
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Token refresh failed: ${errText}`);
  }

  return res.json();
}

export function needsRefresh(tokenExpiresAt: string | null): boolean {
  if (!tokenExpiresAt) return false;
  const expiresAt = new Date(tokenExpiresAt).getTime();
  const bufferMs =
    INSTAGRAM_CONFIG.tokenRefreshBufferDays * 24 * 60 * 60 * 1000;
  return Date.now() > expiresAt - bufferMs;
}

export async function ensureValidToken(
  accountId: string,
  accessToken: string,
  tokenExpiresAt: string | null
): Promise<string> {
  if (!needsRefresh(tokenExpiresAt)) {
    return accessToken;
  }

  const refreshed = await refreshInstagramToken(accessToken);
  const newExpiresAt = new Date(
    Date.now() + refreshed.expires_in * 1000
  ).toISOString();

  const supabase = await createClient();
  await supabase
    .from("sns_accounts")
    .update({
      access_token: refreshed.access_token,
      token_expires_at: newExpiresAt,
    })
    .eq("id", accountId);

  return refreshed.access_token;
}
