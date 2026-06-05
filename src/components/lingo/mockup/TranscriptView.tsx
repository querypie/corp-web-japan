"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslations } from "@/lib/lingo/intl"
import { Check, Copy, Bug } from "@phosphor-icons/react"
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso"
import type { PartialBlock, SpeechBlock } from "@/components/lingo/mockup/types"
import { BlockDebugPanel } from "@/components/lingo/mockup/BlockDebugPanel"
import {
  deriveBadgeLabel,
  deriveBadgeColorIndex,
  guestSpeakerNumber,
} from "@/components/lingo/mockup/utils/speakerBadge"
import { groupBlocks } from "@/components/lingo/mockup/utils/groupBlocks"
import type { SpeakerGroup } from "@/components/lingo/mockup/utils/groupBlocks"

const TRANSCRIPT_ONLY_SPEAKER = "Guest-1"

const SPEAKER_BADGE_COLORS = [
  "bg-orange-400",
  "bg-blue-400",
  "bg-emerald-400",
  "bg-purple-400",
  "bg-slate-400",
  "bg-pink-400",
]

interface TranscriptViewProps {
  blocks: SpeechBlock[]
  partialBlocks?: PartialBlock[]
  filterLanguage?: string
  targetLanguages?: string[]
  isActive?: boolean
  transcriptOnly?: boolean
  jumpToLatestVariant?: "center" | "floating" | "none"
  hasMoreAbove?: boolean
  loadingAbove?: boolean
  onReachTop?: () => void
  debugEnabled?: boolean
}

interface SpeakerGroupCardProps {
  group: SpeakerGroup
  filterLanguage?: string
  targetLanguages?: string[]
  copiedBlockId: string | null
  onCopy: (blockId: string, text: string) => void
  newBlockIds: Set<string>
  debugEnabled?: boolean
}

interface TranscriptVirtuosoContext {
  hasTopStatus: boolean
  loadingAbove: boolean
  loadingText: string
}

interface UtteranceRowProps {
  block: SpeechBlock
  filterLanguage?: string
  targetLanguages?: string[]
  isNew: boolean
  showDivider: boolean
  isIntermediate?: boolean
  debugEnabled?: boolean
}

const transcriptVirtuosoComponents: Components<
  SpeakerGroup,
  TranscriptVirtuosoContext
> = {
  Header: TranscriptVirtuosoHeader,
  List: forwardRef<
    HTMLDivElement,
    React.ComponentProps<
      NonNullable<Components<SpeakerGroup, TranscriptVirtuosoContext>["List"]>
    >
  >(function TranscriptVirtuosoList(
    // context is required by react-virtuoso's List signature but unused here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { children, context, style, ...props },
    ref
  ) {
    return (
      <div
        {...props}
        ref={ref}
        className="flex min-h-full flex-col p-4"
        style={style}
      >
        {children}
      </div>
    )
  }),
}

function TranscriptVirtuosoHeader({
  context,
}: {
  context?: TranscriptVirtuosoContext
}) {
  if (!context?.loadingAbove) return null

  return (
    <div className="pb-3 text-center text-xs text-muted-foreground">
      {context.loadingText}
    </div>
  )
}

export function TranscriptView({
  blocks,
  partialBlocks,
  filterLanguage,
  targetLanguages,
  isActive = false,
  transcriptOnly = false,
  jumpToLatestVariant = "center",
  hasMoreAbove = false,
  loadingAbove = false,
  onReachTop,
  debugEnabled = false,
}: TranscriptViewProps) {
  const t = useTranslations("mockup.session")
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const lastKnownScrollTopRef = useRef(0)
  const copyResetTimeoutRef = useRef<number | null>(null)
  const prevBlockIdsRef = useRef<Set<string>>(new Set())
  const fadeTimersRef = useRef<Map<string, number>>(new Map())
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null)
  const [newBlockIds, setNewBlockIds] = useState<Set<string>>(new Set())
  const [displayedPartials, setDisplayedPartials] = useState<PartialBlock[]>([])
  const [partialFading, setPartialFading] = useState(false)
  const [isScrollLocked, setIsScrollLocked] = useState(false)
  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null)
  const prependAnchorRef = useRef<{
    scrollHeight: number
    firstBlockId: string | null
  } | null>(null)
  const partialFadeTimerRef = useRef<number | null>(null)
  const scrollLockRef = useRef(false)
  const programmaticScrollRef = useRef(false)
  const programmaticScrollTimerRef = useRef<number | null>(null)
  const scrollFallbackTimerRef = useRef<number | null>(null)
  const userInteractingRef = useRef(false)
  const lastAnnouncedIdRef = useRef<string | null>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const hasPartials = (partialBlocks?.length ?? 0) > 0

  const groups = useMemo(() => {
    const source = transcriptOnly
      ? blocks
          .filter((b) => !b._intermediate)
          .map((b) =>
            b.speaker ? b : { ...b, speaker: TRANSCRIPT_ONLY_SPEAKER }
          )
      : blocks
    return groupBlocks(source, { includeEmpty: debugEnabled })
  }, [blocks, transcriptOnly, debugEnabled])

  useEffect(() => {
    if (!isActive || groups.length === 0 || !liveRegionRef.current) return
    const latestGroup = groups[groups.length - 1]
    const latest = latestGroup.blocks[latestGroup.blocks.length - 1]
    if (
      latest &&
      latest.id !== lastAnnouncedIdRef.current &&
      !latest._intermediate
    ) {
      lastAnnouncedIdRef.current = latest.id
      const speaker = latestGroup.speaker || t("transcript.unknownSpeaker")
      liveRegionRef.current.textContent = `${speaker}: ${latest.text.substring(0, 150)}`
    }
  }, [groups, isActive, t])

  const setScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node
    setScrollParent(node)
  }, [])

  const markProgrammaticScroll = useCallback((duration = 30) => {
    if (programmaticScrollTimerRef.current !== null) {
      window.clearTimeout(programmaticScrollTimerRef.current)
    }
    programmaticScrollRef.current = true
    programmaticScrollTimerRef.current = window.setTimeout(() => {
      programmaticScrollRef.current = false
      programmaticScrollTimerRef.current = null
    }, duration)
  }, [])

  const handleWheel = useCallback(() => {
    // wheel/trackpad 스크롤도 사용자 의도로 간주
    userInteractingRef.current = true
    // 짧은 시간 후 해제 (momentum scroll 포함)
    window.setTimeout(() => {
      userInteractingRef.current = false
    }, 150)
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    lastKnownScrollTopRef.current = el.scrollTop
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distanceFromBottom < 50

    if (programmaticScrollRef.current && !userInteractingRef.current) {
      // programmatic scroll (사용자 상호작용 없음) → lock 변경 무시
      return
    }

    if (atBottom && scrollLockRef.current) {
      scrollLockRef.current = false
      setIsScrollLocked(false)
    } else if (!atBottom && !scrollLockRef.current) {
      scrollLockRef.current = true
      setIsScrollLocked(true)
    }

    if (el.scrollTop < 120 && hasMoreAbove && !loadingAbove) {
      onReachTop?.()
    }
  }, [hasMoreAbove, loadingAbove, onReachTop])

  const unlockScrollToLatest = useCallback(
    (smooth = true) => {
      scrollLockRef.current = false
      setIsScrollLocked(false)

      const el = scrollRef.current
      if (!el) return

      const latestIndex = groups.length - 1
      if (latestIndex >= 0) {
        virtuosoRef.current?.scrollToIndex({
          index: latestIndex,
          align: "end",
          behavior: smooth ? "smooth" : "auto",
        })
      }

      if (smooth) {
        markProgrammaticScroll(250)
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
        window.setTimeout(() => {
          if (!scrollRef.current) return
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }, 220)
        return
      }

      markProgrammaticScroll(30)
      el.scrollTop = el.scrollHeight
    },
    [markProgrammaticScroll, groups.length]
  )

  // partial 등장/변경 시: fading 취소하고 최신 내용으로 업데이트
  useEffect(() => {
    if (hasPartials) {
      if (partialFadeTimerRef.current !== null) {
        window.clearTimeout(partialFadeTimerRef.current)
        partialFadeTimerRef.current = null
      }
      const rafId = window.requestAnimationFrame(() => {
        setPartialFading(false)
        setDisplayedPartials(partialBlocks!)
      })
      return () => window.cancelAnimationFrame(rafId)
    } else if (displayedPartials.length > 0) {
      // partial 사라짐 → fade out 후 제거
      const rafId = window.requestAnimationFrame(() => {
        setPartialFading(true)
      })
      partialFadeTimerRef.current = window.setTimeout(() => {
        setDisplayedPartials([])
        setPartialFading(false)
        partialFadeTimerRef.current = null
      }, 200)
      return () => window.cancelAnimationFrame(rafId)
    }
  }, [displayedPartials.length, hasPartials, partialBlocks])

  // 새 블록 도착 → partial 즉시 제거 (rAF 없이 동기 처리 → 흔들림 방지)
  /* eslint-disable react-hooks/set-state-in-effect -- Intentional: synchronous reset prevents visual flicker when new blocks arrive */
  useEffect(() => {
    if (partialFadeTimerRef.current !== null) {
      window.clearTimeout(partialFadeTimerRef.current)
      partialFadeTimerRef.current = null
    }
    setDisplayedPartials([])
    setPartialFading(false)
  }, [blocks.length])
  /* eslint-enable react-hooks/set-state-in-effect */

  // blocks/partial 변경 시 스크롤 추종 (위 방향만 — 콘텐츠 줄어들 때는 spacer로 높이 유지)
  // useLayoutEffect: DOM 커밋 직후·페인트 전에 동기 실행 → scrollHeight가 정확
  useLayoutEffect(() => {
    if (scrollLockRef.current || userInteractingRef.current) return
    const el = scrollRef.current
    if (!el) return

    const prevTop = lastKnownScrollTopRef.current

    const naturalMax = el.scrollHeight - el.clientHeight

    if (naturalMax >= prevTop) {
      // 콘텐츠 증가 → 바닥으로 스크롤
      markProgrammaticScroll(450)
      el.scrollTo({ top: naturalMax, behavior: "smooth" })
      // 이전 fallback 타이머가 남아 있으면 취소 (연속 업데이트 시 중복 보정 방지)
      if (scrollFallbackTimerRef.current !== null) {
        window.clearTimeout(scrollFallbackTimerRef.current)
      }
      // smooth scroll이 interrupt되거나 undershoot될 경우 보정
      scrollFallbackTimerRef.current = window.setTimeout(() => {
        scrollFallbackTimerRef.current = null
        if (!scrollRef.current) return
        if (userInteractingRef.current) return // 사용자가 스크롤 중이면 보정 스킵
        const currentNaturalMax =
          scrollRef.current.scrollHeight - scrollRef.current.clientHeight
        scrollRef.current.scrollTop = currentNaturalMax
        lastKnownScrollTopRef.current = currentNaturalMax
      }, 450)
    } else {
      // 콘텐츠 감소 (partial→final 축소). 자동 추종 모드이므로
      // 새로운 바닥으로 즉시 스냅 — 빈 공간이 남는 것을 방지.
      markProgrammaticScroll(30)
      el.scrollTop = naturalMax
      lastKnownScrollTopRef.current = naturalMax
    }
  }, [blocks, displayedPartials, markProgrammaticScroll])

  const followOutput = useCallback((atBottom: boolean) => {
    if (scrollLockRef.current || userInteractingRef.current) return false
    return atBottom ? "smooth" : false
  }, [])

  // 포인터가 스크롤 영역 밖에서 떼어졌을 때를 위한 전역 리스너
  useEffect(() => {
    const handlePointerUp = () => {
      userInteractingRef.current = false
    }
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointercancel", handlePointerUp)
    return () => {
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [])

  useEffect(() => {
    const fadeTimers = fadeTimersRef.current

    return () => {
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current)
      }
      if (programmaticScrollTimerRef.current !== null) {
        window.clearTimeout(programmaticScrollTimerRef.current)
      }
      if (partialFadeTimerRef.current !== null) {
        window.clearTimeout(partialFadeTimerRef.current)
      }
      if (scrollFallbackTimerRef.current !== null) {
        window.clearTimeout(scrollFallbackTimerRef.current)
      }
      for (const timer of fadeTimers.values()) {
        window.clearTimeout(timer)
      }
      fadeTimers.clear()
    }
  }, [])

  useEffect(() => {
    const currentIds = new Set(blocks.map((block) => block.id))
    const addedIds = blocks
      .filter((block) => !prevBlockIdsRef.current.has(block.id))
      .map((block) => block.id)

    prevBlockIdsRef.current = currentIds

    if (addedIds.length === 0) return

    // prepend guard: 이전 기록을 실제로 불러오는 중에만 새 블록 애니메이션 방지
    if (loadingAbove) return

    setNewBlockIds((prev) => {
      const next = new Set(prev)
      for (const id of addedIds) next.add(id)
      return next
    })

    for (const id of addedIds) {
      const existingTimer = fadeTimersRef.current.get(id)
      if (existingTimer !== undefined) {
        window.clearTimeout(existingTimer)
      }

      const timer = window.setTimeout(() => {
        fadeTimersRef.current.delete(id)
        setNewBlockIds((prev) => {
          if (!prev.has(id)) return prev
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, 300)

      fadeTimersRef.current.set(id, timer)
    }
  }, [blocks, loadingAbove])

  useEffect(() => {
    if (!loadingAbove || !scrollRef.current) return
    prependAnchorRef.current = {
      scrollHeight: scrollRef.current.scrollHeight,
      firstBlockId: blocks[0]?.id ?? null,
    }
  }, [blocks, loadingAbove])

  useEffect(() => {
    const anchor = prependAnchorRef.current
    const el = scrollRef.current
    if (!anchor || !el) return
    if (blocks[0]?.id === anchor.firstBlockId) return

    const heightDelta = el.scrollHeight - anchor.scrollHeight
    markProgrammaticScroll(30)
    el.scrollTop += heightDelta
    prependAnchorRef.current = null
  }, [blocks, markProgrammaticScroll])

  const handleCopy = useCallback((blockId: string, text: string) => {
    if (!navigator.clipboard?.writeText) return

    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedBlockId(blockId)

        if (copyResetTimeoutRef.current !== null) {
          window.clearTimeout(copyResetTimeoutRef.current)
        }

        copyResetTimeoutRef.current = window.setTimeout(() => {
          setCopiedBlockId((current) => (current === blockId ? null : current))
          copyResetTimeoutRef.current = null
        }, 2000)
      })
      .catch(() => {
        // Clipboard access can fail on insecure contexts.
      })
  }, [])

  if (blocks.length === 0 && !hasPartials) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-center">{t("transcript.empty")}</p>
      </div>
    )
  }

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col"
      style={{ overflowWrap: "anywhere" }}
    >
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-busy={loadingAbove}
        className="sr-only"
      />
      <div
        ref={setScrollContainerRef}
        className="relative min-h-0 flex-1 overflow-y-auto"
        style={{ overflowAnchor: "none", scrollbarGutter: "stable" }}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onPointerDown={() => {
          userInteractingRef.current = true
        }}
        onPointerUp={() => {
          userInteractingRef.current = false
        }}
        onPointerCancel={() => {
          userInteractingRef.current = false
        }}
      >
        {groups.length === 0 ? (
          <div className="flex min-h-full flex-col p-4">
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p className="text-center">{t("transcript.empty")}</p>
            </div>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ minHeight: "100%", height: "100%" }}
            customScrollParent={scrollParent ?? undefined}
            data={groups}
            computeItemKey={(_index, group) =>
              group.blocks[0]?.id ?? String(_index)
            }
            components={transcriptVirtuosoComponents}
            context={{
              hasTopStatus: loadingAbove || hasMoreAbove,
              loadingAbove,
              loadingText: t("transcript.loading"),
            }}
            followOutput={followOutput}
            alignToBottom
            atBottomThreshold={50}
            increaseViewportBy={{ top: 600, bottom: 900 }}
            minOverscanItemCount={{ top: 4, bottom: 8 }}
            itemContent={(_index, group) => (
              <SpeakerGroupCard
                group={group}
                filterLanguage={filterLanguage}
                targetLanguages={targetLanguages}
                copiedBlockId={copiedBlockId}
                onCopy={handleCopy}
                newBlockIds={newBlockIds}
                debugEnabled={debugEnabled}
              />
            )}
          />
        )}
      </div>

      {isActive && !transcriptOnly && (
        <div className="max-h-[30vh] min-h-[120px] flex-shrink-0 overflow-hidden border-t border-border p-4">
          <div
            className={`flex min-h-[calc(120px-2rem)] items-stretch gap-2 transition-opacity duration-200 ${
              displayedPartials.length > 0
                ? partialFading
                  ? "opacity-0"
                  : "opacity-100"
                : "opacity-0"
            }`}
          >
            {(displayedPartials.some((p) => p.speaker)
              ? displayedPartials.filter((p) => p.speaker)
              : displayedPartials
            ).map((partialBlock) => (
              <PartialTranscriptBlock
                key={partialBlock.speaker || "__default__"}
                block={partialBlock}
              />
            ))}
          </div>
        </div>
      )}

      {isScrollLocked && isActive && jumpToLatestVariant !== "none" && (
        <button
          type="button"
          onClick={() => unlockScrollToLatest(true)}
          aria-label={t("transcript.jumpToLatest")}
          className={
            jumpToLatestVariant === "floating"
              ? "absolute z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-card text-card-foreground shadow-lg ring-1 ring-border transition-colors hover:bg-accent"
              : "absolute bottom-4 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-card/90 text-card-foreground shadow-md backdrop-blur-sm hover:bg-accent"
          }
          style={
            jumpToLatestVariant === "floating"
              ? {
                  right: "24px",
                  bottom:
                    isActive && !transcriptOnly
                      ? "calc(max(30vh, 120px) + 16px)"
                      : "16px",
                }
              : undefined
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4.5 w-4.5"
          >
            <path
              fillRule="evenodd"
              d="M8 3.25a.75.75 0 0 1 .75.75v8.19l2.72-2.72a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72V4A.75.75 0 0 1 8 3.25Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

function SpeakerGroupCard({
  group,
  filterLanguage,
  targetLanguages,
  copiedBlockId,
  onCopy,
  newBlockIds,
  debugEnabled = false,
}: SpeakerGroupCardProps) {
  const t = useTranslations("mockup.session")
  const badgeLabel = deriveBadgeLabel(group.speaker)
  const badgeColor =
    SPEAKER_BADGE_COLORS[
      deriveBadgeColorIndex(group.speaker, SPEAKER_BADGE_COLORS.length)
    ]
  const guestN = guestSpeakerNumber(group.speaker)
  const speakerDisplayName =
    guestN !== null ? t("transcript.guestSpeaker", { number: guestN }) : group.speaker
  const firstBlock = group.blocks[0]
  const lastBlock = group.blocks[group.blocks.length - 1]
  const groupCopyId = `group:${firstBlock?.id ?? "unknown"}:${lastBlock?.id ?? "unknown"}`
  const isIntermediateGroup = group.blocks.every((block) => block._intermediate)
  const cardRef = useRef<HTMLDivElement>(null)
  const lockedHeightRef = useRef<number | undefined>(undefined)
  const [lockedHeight, setLockedHeight] = useState<number | undefined>(
    undefined
  )
  const handleGroupCopy = useCallback(() => {
    const groupCopyText = group.blocks
      .map((block) => buildCopyText(block, filterLanguage, targetLanguages))
      .filter(Boolean)
      .join("\n\n")

    onCopy(groupCopyId, groupCopyText)
  }, [filterLanguage, group.blocks, groupCopyId, onCopy, targetLanguages])

  useEffect(() => {
    if (isIntermediateGroup && cardRef.current) {
      lockedHeightRef.current = cardRef.current.offsetHeight
    } else if (!isIntermediateGroup && lockedHeightRef.current) {
      setLockedHeight(lockedHeightRef.current)
      const timer = window.setTimeout(() => {
        setLockedHeight(undefined)
        lockedHeightRef.current = undefined
      }, 300)
      return () => window.clearTimeout(timer)
    }
  }, [isIntermediateGroup])

  return (
    <div
      ref={cardRef}
      className={`group rounded-2xl px-2.5 py-2.5 transition-colors ${""}`}
      style={{ minHeight: lockedHeight }}
    >
      <div className="ml-[6px] flex min-h-6 items-center gap-1.5">
        {badgeLabel && (
          <span
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-inverse-foreground ${isIntermediateGroup ? "opacity-40" : ""} ${badgeColor}`}
          >
            {badgeLabel}
          </span>
        )}
        {group.speaker && (
          <span
            className={`text-sm font-semibold ${isIntermediateGroup ? "text-muted-foreground" : "text-foreground"}`}
          >
            {speakerDisplayName}
          </span>
        )}
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {formatTime(firstBlock.start_time)}
        </span>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleGroupCopy}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title={
                copiedBlockId === groupCopyId
                  ? t("transcript.copied")
                  : t("transcript.copy")
              }
              aria-label={
                copiedBlockId === groupCopyId
                  ? t("transcript.copied")
                  : t("transcript.copy")
              }
            >
              <span aria-hidden="true">
                {copiedBlockId === groupCopyId ? (
                  <Check
                    className="h-4.5 w-4.5 text-success"
                    weight="regular"
                  />
                ) : (
                  <Copy className="h-4.5 w-4.5" weight="regular" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {group.blocks.map((block, index) => (
        <UtteranceRow
          key={block.id}
          block={block}
          filterLanguage={filterLanguage}
          targetLanguages={targetLanguages}
          isNew={newBlockIds.has(block.id)}
          showDivider={index > 0}
          isIntermediate={block._intermediate}
          debugEnabled={debugEnabled}
        />
      ))}
    </div>
  )
}

function sourceTextClass({
  isEmptyText,
  isSourceHighlighted,
  hasVisibleTranslations,
}: {
  isEmptyText: boolean
  isSourceHighlighted: boolean
  hasVisibleTranslations: boolean
}): string {
  if (isEmptyText) {
    return "transcript-source-text italic text-muted-foreground/60"
  }
  if (isSourceHighlighted) {
    return "transcript-source-emphasis-text text-foreground"
  }
  return `transcript-source-text text-muted-foreground${hasVisibleTranslations ? " mb-1" : ""}`
}

function UtteranceRow({
  block,
  filterLanguage,
  targetLanguages,
  isNew,
  showDivider,
  isIntermediate = false,
  debugEnabled = false,
}: UtteranceRowProps) {
  const t = useTranslations("mockup.session")
  const visibleTranslationEntries = getVisibleTranslationEntries(
    block.translations,
    filterLanguage,
    targetLanguages
  )
  const hasVisibleTranslations = visibleTranslationEntries.length > 0
  // 선택된 언어가 이 블록의 원본 언어이면 소스 텍스트를 강조 표시
  const isSourceHighlighted =
    !!filterLanguage && filterLanguage === block.language
  const [debugOpen, setDebugOpen] = useState(false)
  const canOpenDebug = debugEnabled && !isIntermediate
  const isEmptyText = !block.text.trim()

  return (
    <>
      {showDivider && <div className="h-px" />}
      <div className={isNew ? "animate-new-block" : undefined}>
        <div
          className={`rounded-[10px] px-2 py-1.5 transition-[background-color,box-shadow] ${
            isIntermediate
              ? "border border-dashed border-border opacity-60"
              : "hover:bg-accent"
          }`}
        >
          <div className="flex min-w-0 items-start gap-2">
            <div className="min-w-0 flex-1">
              <p
                className={sourceTextClass({
                  isEmptyText,
                  isSourceHighlighted,
                  hasVisibleTranslations,
                })}
              >
                {isEmptyText ? t("transcript.emptyText") : block.text}
              </p>

              <div
                className={`transcript-translations ${hasVisibleTranslations ? "is-open" : "is-closed"}`}
                aria-hidden={!hasVisibleTranslations}
              >
                <div className="space-y-1 overflow-hidden">
                  {visibleTranslationEntries.map(([lang, text]) => (
                    <p
                      key={lang}
                      className="transcript-translation-text text-foreground"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {canOpenDebug && (
              <button
                type="button"
                onClick={() => setDebugOpen((v) => !v)}
                aria-label={t("transcript.toggleDebug")}
                aria-pressed={debugOpen}
                className="mt-0.5 flex-shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Bug className="h-4 w-4" weight="regular" />
              </button>
            )}
          </div>
          {canOpenDebug && debugOpen && (
            <BlockDebugPanel blockId={block.id} sessionId={block.session_id} />
          )}
        </div>
      </div>
    </>
  )
}

function PartialTranscriptBlock({ block }: { block: PartialBlock }) {
  const t = useTranslations("mockup.session")
  const textRef = useRef<HTMLDivElement>(null)
  const badgeLabel = deriveBadgeLabel(block.speaker)
  const badgeColor =
    SPEAKER_BADGE_COLORS[
      deriveBadgeColorIndex(block.speaker, SPEAKER_BADGE_COLORS.length)
    ]
  const guestN = guestSpeakerNumber(block.speaker)
  const speakerDisplayName =
    guestN !== null ? t("transcript.guestSpeaker", { number: guestN }) : block.speaker

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [block.text])

  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-border bg-secondary/80 px-3 py-3 opacity-70">
      {block.speaker && (
        <div className="mb-1.5 flex min-h-5 items-center gap-1.5">
          {badgeLabel && (
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-inverse-foreground opacity-60 ${badgeColor}`}
            >
              {badgeLabel}
            </span>
          )}
          <span className="text-sm font-semibold text-muted-foreground">
            {speakerDisplayName}
          </span>
        </div>
      )}
      <div
        ref={textRef}
        className="h-6 overflow-hidden text-base leading-6 text-foreground"
      >
        {block.text}
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function getVisibleTranslationEntries(
  translations: Record<string, string> | undefined,
  filterLanguage?: string,
  targetLanguages?: string[]
): Array<[string, string]> {
  const orderedEntries = getOrderedTranslationEntries(
    translations,
    targetLanguages
  )
  return filterLanguage
    ? orderedEntries.filter(([lang]) => lang === filterLanguage)
    : orderedEntries
}

function getOrderedTranslationEntries(
  translations?: Record<string, string>,
  targetLanguages?: string[]
): Array<[string, string]> {
  const entries = Object.entries(translations ?? {})

  if (!targetLanguages || targetLanguages.length === 0) {
    return entries
  }

  const orderedEntries: Array<[string, string]> = []
  const seen = new Set<string>()

  for (const lang of targetLanguages) {
    const text = translations?.[lang]
    if (!text) continue
    orderedEntries.push([lang, text])
    seen.add(lang)
  }

  for (const [lang, text] of entries) {
    if (seen.has(lang)) continue
    orderedEntries.push([lang, text])
  }

  return orderedEntries
}

function buildCopyText(
  block: SpeechBlock,
  filterLanguage?: string,
  targetLanguages?: string[]
): string {
  if (filterLanguage) {
    if (block.language === filterLanguage) {
      return block.text
    }
    return block.translations?.[filterLanguage] ?? ""
  }

  return [
    block.text,
    ...getOrderedTranslationEntries(block.translations, targetLanguages).map(
      ([, text]) => text
    ),
  ]
    .filter(Boolean)
    .join("\n")
}
