export type SupportedLocale = "en" | "ko" | "ja";

export function getSupportedLocale(): SupportedLocale {
  return "ja";
}

export function getLocaleCopy<T>(
  _locale: string,
  copy: Record<SupportedLocale, T>,
): T {
  return copy.ja;
}
