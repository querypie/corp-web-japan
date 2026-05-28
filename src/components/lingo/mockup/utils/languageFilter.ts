export function getVisibleFilterLanguages(languages: string[]): string[] {
  return Array.from(new Set(languages.filter(Boolean)))
}

export function shouldShowLanguageFilter(languages: string[]): boolean {
  return getVisibleFilterLanguages(languages).length > 1
}
