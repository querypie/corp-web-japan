export const INSTAGRAM_CONFIG = {
  authorizationUrl: "https://api.instagram.com/oauth/authorize",
  tokenUrl: "https://api.instagram.com/oauth/access_token",
  longLivedTokenUrl: "https://graph.instagram.com/access_token",
  refreshTokenUrl: "https://graph.instagram.com/refresh_access_token",
  graphApiBase: "https://graph.instagram.com/v21.0",
  scopes: [
    "instagram_basic",
    "instagram_content_publish",
    "pages_show_list",
  ],
  tokenRefreshBufferDays: 7,
} as const;

export function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/api/instagram/callback`;
}

export function isInstagramConfigured(): boolean {
  return !!(process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET);
}
