export type SupportedLocale = "en" | "ko" | "ja"

export function getSupportedLocale(locale: string): SupportedLocale {
  if (locale === "ko" || locale === "ja") return locale
  return "en"
}

export function getLocaleCopy<T>(
  locale: string,
  copy: Record<SupportedLocale, T>
): T {
  return copy[getSupportedLocale(locale)]
}
