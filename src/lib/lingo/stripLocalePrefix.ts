const LOCALES = ['en', 'ko', 'ja'] as const

export function stripLocalePrefix(pathname: string): string {
  for (const loc of LOCALES) {
    if (pathname === `/${loc}`) return '/'
    if (pathname.startsWith(`/${loc}/`)) {
      return pathname.slice(`/${loc}`.length) || '/'
    }
  }
  return pathname || '/'
}
