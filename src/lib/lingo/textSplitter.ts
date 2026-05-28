export function splitIntoUnits(text: string, locale: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' })
    return Array.from(segmenter.segment(text))
      .map((segment) => segment.segment)
      .filter((segment) => segment.trim().length > 0)
  }
  return text.split(/\s+/).filter(Boolean)
}

export function splitIntoChunks(text: string, size: number) {
  const chars = Array.from(text)
  const chunks: string[] = []
  for (let i = 0; i < chars.length; i += size) {
    chunks.push(chars.slice(i, i + size).join(''))
  }
  return chunks
}

export function splitIntoSentences(text: string) {
  return text.split('\n').filter(Boolean)
}

export function joinUnits(units: string[], locale: string) {
  if (locale === 'ja') {
    return units.join('')
  }
  return units.join(' ')
}
