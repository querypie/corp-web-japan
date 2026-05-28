/**
 * 목업 전용 calendarUtils
 * — i18n 의존 없이 영문 레이블을 반환합니다.
 */

export function detectPlatform(
  url: string | null
): "googleMeet" | "zoom" | "teams" | null {
  if (!url) return null
  if (url.includes("meet.google.com")) return "googleMeet"
  if (url.includes("zoom.us")) return "zoom"
  if (url.includes("teams.microsoft.com") || url.includes("teams.live.com"))
    return "teams"
  return null
}

export function formatTime(iso: string, locale: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
}

export function getDateKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function formatDateLabel(iso: string, locale: string): string {
  const d = new Date(iso)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const dateStr = d.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
  })

  if (isSameDay(d, now)) return `Today, ${dateStr}`
  if (isSameDay(d, tomorrow)) return `Tomorrow, ${dateStr}`

  return d.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}
