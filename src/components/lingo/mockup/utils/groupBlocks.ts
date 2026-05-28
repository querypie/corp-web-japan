import type { SpeechBlock } from "../types"

interface SpeakerGroup {
  speaker: string | null
  blocks: SpeechBlock[]
}

const MAX_BLOCKS_PER_GROUP = 5

export type { SpeakerGroup }

interface GroupBlocksOptions {
  /**
   * When true, blocks with empty/whitespace-only text are kept so the debug
   * panel can inspect them (verify stage can wipe text to "" when Gemini
   * audio-verify returns nothing usable; those blocks are invisible to
   * regular viewers but staff with `?debug=1` need to see them).
   */
  includeEmpty?: boolean
}

export function groupBlocks(
  blocks: SpeechBlock[],
  options: GroupBlocksOptions = {}
): SpeakerGroup[] {
  const groups: SpeakerGroup[] = []

  for (const block of blocks) {
    if (!options.includeEmpty && !block.text.trim()) continue
    const key = block.speaker || "__default__"
    const lastGroup = groups[groups.length - 1]
    if (
      lastGroup &&
      (lastGroup.speaker ?? "__default__") === key &&
      lastGroup.blocks.length < MAX_BLOCKS_PER_GROUP
    ) {
      lastGroup.blocks.push(block)
      continue
    }

    groups.push({
      speaker: block.speaker || null,
      blocks: [block],
    })
  }

  return groups
}
