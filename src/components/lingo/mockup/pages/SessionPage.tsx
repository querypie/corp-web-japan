"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Share2 } from "lucide-react"
import type {
  BotStatus,
  Page,
  PartialBlock,
  SpeechBlock,
} from "@/components/lingo/mockup/types"
import { SessionTopBar } from "@/components/lingo/mockup/SessionTopBar"
import { BottomControlBar } from "@/components/lingo/mockup/BottomControlBar"
import { TranscriptView } from "@/components/lingo/mockup/TranscriptView"
import { ShareModal } from "@/components/lingo/mockup/ShareModal"
import { MOCK_BLOCKS } from "@/components/lingo/mockup/mockData"

export interface SessionPageProps {
  sessionName?: string
  targetLanguages?: string[]
  audioSource?: "mic" | "screen" | "mix" | "bot"
  existingSessionId?: string
  isScheduled?: boolean
  startPaused?: boolean
  previewPaused?: boolean
  translationEnabled?: boolean
  onEnd?: () => void
  onNavigate?: (page: Page) => void
}

function getBotStatusBadgeClass(status: BotStatus): string {
  switch (status) {
    case "recording":
      return "bg-destructive/10 text-destructive"
    case "error":
      return "bg-warning/10 text-warning"
    case "done":
      return "bg-secondary text-secondary-foreground"
    case "in_waiting_room":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    default:
      return "border border-primary-soft-border bg-primary-soft text-primary-soft-foreground"
  }
}

function getBotStatusLabel(status: BotStatus): string {
  switch (status) {
    case "creating":
      return "Creating"
    case "ready":
      return "Ready"
    case "joining":
      return "Joining"
    case "in_waiting_room":
      return "Waiting Room"
    case "in_meeting":
      return "In Meeting"
    case "recording":
      return "Recording"
    case "ending":
      return "Ending"
    case "done":
      return "Done"
    case "error":
      return "Error"
    default:
      return status
  }
}

export function SessionPage({
  sessionName = "Live Session",
  targetLanguages = ["en", "ko", "ja"],
  audioSource = "mic",
  isScheduled = false,
  startPaused = false,
  previewPaused = false,
  translationEnabled = true,
  onEnd,
}: SessionPageProps) {
  const isBotMode = audioSource === "bot"
  const barAudioSource: "mic" | "screen" | "mix" | undefined = isBotMode
    ? undefined
    : (audioSource as "mic" | "screen" | "mix")

  const [blocks, setBlocks] = useState<SpeechBlock[]>(MOCK_BLOCKS.slice(0, 2))
  const [partialBlocks, setPartialBlocks] = useState<PartialBlock[]>([])
  const [isPaused, setIsPaused] = useState(startPaused)
  const [isStarted, setIsStarted] = useState(!isScheduled)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [filterLanguage, setFilterLanguage] = useState("")
  const [currentDeviceId, setCurrentDeviceId] = useState("default")
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [shareInfo, setShareInfo] = useState<{
    share_token: string
    share_expires_at?: string | null
    requires_password?: boolean
    generated_password?: string | null
  } | null>(null)
  const [botStatus, setBotStatus] = useState<BotStatus | null>(
    isBotMode ? "recording" : null
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showJoinBotPrompt] = useState(false)
  const isPreviewPaused = previewPaused
  const isEffectivelyPaused = isPaused || isPreviewPaused

  const blockIndexRef = useRef(2)
  const pauseRef = useRef(isPaused)
  const startRef = useRef(isStarted)

  useEffect(() => {
    pauseRef.current = isEffectivelyPaused
  }, [isEffectivelyPaused])

  useEffect(() => {
    startRef.current = isStarted
  }, [isStarted])

  // Simulate live transcription: append a block every 4 s
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!startRef.current || pauseRef.current) return
      const idx = blockIndexRef.current % MOCK_BLOCKS.length
      const next = MOCK_BLOCKS[idx]
      if (next) {
        setBlocks((prev) => {
          // prevent exact duplicate by id
          if (prev.some((b) => b.id === next.id)) {
            const cloned: SpeechBlock = {
              ...next,
              id: `${next.id}-dup-${Date.now()}`,
            }
            return [...prev, cloned]
          }
          return [...prev, next]
        })
      }
      blockIndexRef.current += 1
    }, 4000)
    return () => window.clearInterval(interval)
  }, [])

  // Simulate partial transcript flicker
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!startRef.current || pauseRef.current) return
      setPartialBlocks([
        {
          id: "partial",
          session_id: "mock",
          start_time: 0,
          end_time: 0,
          language: "en",
          text: "...",
          speaker: "Alice Chen",
        },
      ])
      window.setTimeout(() => setPartialBlocks([]), 1200)
    }, 2500)
    return () => window.clearInterval(interval)
  }, [])

  // Elapsed timer
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (startRef.current && !pauseRef.current) {
        setElapsedSeconds((s) => s + 1)
      }
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  // Fake volume meter
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (startRef.current && !pauseRef.current) {
        setVolumeLevel(Math.random() * 0.7 + 0.1)
      } else {
        setVolumeLevel(0)
      }
    }, 150)
    return () => window.clearInterval(interval)
  }, [])

  const handleStart = useCallback(() => {
    setIsStarted(true)
    setIsPaused(false)
  }, [])

  const handlePause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    setIsPaused(false)
  }, [])

  const handleStopAndEnd = useCallback(() => {
    onEnd?.()
  }, [onEnd])

  const handleDeviceChange = useCallback((deviceId: string) => {
    setCurrentDeviceId(deviceId)
  }, [])

  const handleCreateShare = useCallback(async () => {
    const token = `mock-share-${Date.now()}`
    const info = {
      share_token: token,
      share_expires_at: null,
      requires_password: false,
      generated_password: null,
    }
    setShareToken(token)
    setShareInfo(info)
    return token
  }, [])

  const handleUpdateShare = useCallback(
    async (settings: {
      expires_at?: string | null
      password?: string | null
    }) => {
      const info = {
        share_token: shareToken ?? `mock-share-${Date.now()}`,
        share_expires_at: settings.expires_at ?? null,
        requires_password: Boolean(settings.password),
        generated_password: settings.password ?? null,
      }
      setShareInfo(info)
      return info
    },
    [shareToken]
  )

  const handleUnshare = useCallback(async () => {
    setShareToken(null)
    setShareInfo(null)
  }, [])

  const formatElapsed = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    const pad = (n: number) => String(n).padStart(2, "0")
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    return `${pad(mins)}:${pad(secs)}`
  }

  return (
    <div className="flex h-full flex-col">
      <SessionTopBar
        title={sessionName}
        languages={targetLanguages}
        selectedLanguage={filterLanguage}
        onSelectLanguage={setFilterLanguage}
        hidden={isFullscreen}
        isLive
        isPaused={isEffectivelyPaused}
        actions={
          <>
            {isBotMode && botStatus && (
              <div className="hidden items-center gap-2 sm:mr-2 sm:flex">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${getBotStatusBadgeClass(
                    botStatus
                  )}`}
                >
                  {botStatus === "recording" && (
                    <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  )}
                  {getBotStatusLabel(botStatus)}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
              aria-label="Share"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <span className="hidden text-xs text-muted-foreground tabular-nums sm:inline">
              {formatElapsed(elapsedSeconds)}
            </span>
          </>
        }
      />

      {/* Transcript */}
      <main className="relative flex flex-1 flex-col overflow-hidden bg-background">
        {showJoinBotPrompt ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <p className="text-sm text-muted-foreground">
              The bot has not joined the meeting yet.
            </p>
            <button
              type="button"
              onClick={() => setBotStatus("joining")}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Join Bot Now
            </button>
          </div>
        ) : (
          <>
            {isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                title="Exit Fullscreen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06L5.44 6.5H2.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69L3.28 2.22zM13.5 2.75a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-2.69l3.22-3.22a.75.75 0 0 0-1.06-1.06L13.5 5.44V2.75zM6.5 13.5H2.75a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 1 0 1.06 1.06L6.5 16.06v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75zM17.28 13.72a.75.75 0 0 0-1.06 0L13 16.94v-2.69a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-2.69l3.22-3.22a.75.75 0 0 0 0-1.06z" />
                </svg>
              </button>
            )}
            <TranscriptView
              blocks={blocks}
              partialBlocks={partialBlocks}
              filterLanguage={filterLanguage || undefined}
              targetLanguages={targetLanguages}
              isActive={isStarted && !isEffectivelyPaused}
              transcriptOnly={!translationEnabled}
            />
          </>
        )}
      </main>

      {!isBotMode && (
        <BottomControlBar
          currentDeviceId={currentDeviceId}
          onDeviceChange={handleDeviceChange}
          volumeLevel={volumeLevel}
          isActive={isStarted && !isEffectivelyPaused}
          onEnd={handleStopAndEnd}
          audioSource={barAudioSource}
          isPaused={isEffectivelyPaused}
          onPause={handlePause}
          onResume={handleResume}
          isStarted={isStarted}
          onStart={handleStart}
        />
      )}

      <ShareModal
        open={showShareModal}
        share={shareInfo}
        shareToken={shareToken}
        onClose={() => setShowShareModal(false)}
        onCreateShare={handleCreateShare}
        onUpdateShare={handleUpdateShare}
        onUnshare={handleUnshare}
      />
    </div>
  )
}
