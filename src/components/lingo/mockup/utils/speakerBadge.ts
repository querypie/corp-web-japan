const GUEST_PATTERN = /^Guest-(\d+)$/

export function guestSpeakerNumber(
  speaker: string | null | undefined
): number | null {
  if (!speaker) return null
  const match = speaker.trim().match(GUEST_PATTERN)
  return match ? Number.parseInt(match[1], 10) : null
}

export function deriveBadgeLabel(
  speaker: string | null | undefined
): string | null {
  if (!speaker) return null
  const trimmed = speaker.trim()
  if (!trimmed) return null

  const match = trimmed.match(GUEST_PATTERN)
  if (match) return match[1]

  const first = Array.from(trimmed)[0]
  return first ? first.toUpperCase() : null
}

export function deriveBadgeColorIndex(
  speaker: string | null | undefined,
  paletteLength: number
): number {
  if (!speaker || paletteLength <= 0) return 0

  const match = speaker.match(GUEST_PATTERN)
  if (match) {
    const n = Number.parseInt(match[1], 10)
    return (((n - 1) % paletteLength) + paletteLength) % paletteLength
  }

  let hash = 0
  for (const ch of speaker) {
    hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0
  }
  return hash % paletteLength
}
