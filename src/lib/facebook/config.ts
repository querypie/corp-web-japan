export const FACEBOOK_CONFIG = {
  authorizationUrl: "https://www.facebook.com/v21.0/dialog/oauth",
  tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
  graphApiBase: "https://graph.facebook.com/v21.0",
  scopes: [
    "public_profile",
    "email",
  ],
  tokenRefreshBufferDays: 7,
} as const;

export function getFacebookRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/api/facebook/callback`;
}

export function isFacebookConfigured(): boolean {
  return !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET);
}
