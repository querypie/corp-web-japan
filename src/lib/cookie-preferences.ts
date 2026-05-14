export type CookiePreferenceKey = "necessary" | "performance" | "functional" | "analysis" | "marketing";
export type MutableCookiePreferenceKey = Exclude<CookiePreferenceKey, "necessary">;

export const COOKIE_PREFERENCE_COOKIE_KEYS = {
  set: "cookie-preference-set",
  performance: "cookie-preference-performance",
  functional: "cookie-preference-functional",
  analysis: "cookie-preference-event",
  marketing: "cookie-preference-marketing",
} as const;

export const COOKIE_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

export type CookiePreferenceState = Record<MutableCookiePreferenceKey, boolean>;

export function isCookiePreferenceEnabled(value?: string | null) {
  return value === "1";
}
