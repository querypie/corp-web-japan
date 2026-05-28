/**
 * 목업 전용 orgApiPath
 * — 오리지널과 동일한 시그니처를 유지합니다.
 */
export function orgApiPath(
  orgSlug: string | undefined,
  path: `/${string}`
): string {
  if (!orgSlug) return `/api${path}`
  return `/api/org/${encodeURIComponent(orgSlug)}${path}`
}
