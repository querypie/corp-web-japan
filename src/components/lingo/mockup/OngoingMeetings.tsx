"use client"

import { useMemo } from "react"
import { useTranslations } from "@/lib/lingo/intl"
import { useOrganizationContext } from "@/components/lingo/mockup/contexts/OrganizationContext"
import { MOCK_SESSIONS } from "@/components/lingo/mockup/mockData"
import type { BotStatus, Session } from "@/components/lingo/mockup/types"
import { TERMINAL_SESSION_STATES } from "@/components/lingo/mockup/types"
import { formatTime } from "@/components/lingo/mockup/utils/calendarUtils"
import { SessionStatusBadge } from "@/components/lingo/mockup/SessionStatusBadge"

/**
 * 진행 중인 세션 렌더링에 필요한 필드만 추려낸 타입.
 */
interface OngoingSession {
  id: string
  name: string
  session_state: string
  started_at: string | null
  meeting_type: "in-person" | "remote"
  bot_status: string | null
  is_live?: boolean
  session_status?: "active" | "paused" | null
  has_active_speaker?: boolean
}

// Bot이 진행 중인 상태: 생성~녹음까지. 종료/오류 상태는 목록에 표시하지 않음.
const ACTIVE_BOT_STATES = new Set<BotStatus>([
  "creating",
  "ready",
  "joining",
  "in_waiting_room",
  "in_meeting",
  "recording",
])

function botStatusBadgeClass(status: string | null | undefined): string {
  if (status === "error") return "bg-destructive/10 text-destructive"
  if (status === "recording" || status === "in_meeting")
    return "bg-destructive/10 text-destructive"
  if (status === "in_waiting_room")
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
}

const BOT_LABEL_KEYS: Record<string, string> = {
  creating: "ongoing.botStatus.creating",
  ready: "ongoing.botStatus.ready",
  joining: "ongoing.botStatus.joining",
  in_waiting_room: "ongoing.botStatus.inWaitingRoom",
  in_meeting: "ongoing.botStatus.inMeeting",
  recording: "ongoing.botStatus.recording",
  ending: "ongoing.botStatus.ending",
  done: "ongoing.botStatus.done",
  error: "ongoing.botStatus.error",
}

function isOngoing(s: Session): boolean {
  if (s.session_state === "live" && s.is_live !== false) return true
  if (
    s.meeting_type === "remote" &&
    s.bot_status &&
    ACTIVE_BOT_STATES.has(s.bot_status)
  ) {
    return !TERMINAL_SESSION_STATES.has(s.session_state)
  }
  return false
}

function toOngoingSession(s: Session): OngoingSession {
  return {
    id: s.id,
    name: s.name,
    session_state: s.session_state,
    started_at: s.created_at, // 목업에는 started_at이 없어 created_at을 대체
    meeting_type: s.meeting_type,
    bot_status: s.bot_status ?? null,
    is_live: s.is_live,
    session_status: s.session_status ?? null,
    has_active_speaker: s.bot_status === "recording",
  }
}

interface OngoingMeetingsProps {
  onSelectSession?: (sessionId: string) => void
}

export function OngoingMeetings({ onSelectSession }: OngoingMeetingsProps) {
  const { currentOrg } = useOrganizationContext()
  const t = useTranslations("mockup.home")

  const ongoing = useMemo(() => {
    return MOCK_SESSIONS.filter(isOngoing).map(toOngoingSession)
  }, [])

  if (!currentOrg) return null

  const botLabel = (status: string): string => {
    const key = BOT_LABEL_KEYS[status]
    return key ? t(key) : status
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {t("ongoing.heading")}
        </h2>
      </div>

      {ongoing.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("ongoing.empty")}
        </p>
      )}

      {ongoing.length > 0 && (
        <div className="mt-4 space-y-2">
          {ongoing.map((s) => {
            const isPaused = s.session_status === "paused"
            const hasActiveBotBadge = Boolean(
              s.bot_status && ACTIVE_BOT_STATES.has(s.bot_status as BotStatus)
            )
            const showSessionStatusBadge =
              isPaused || (s.session_state === "live" && !hasActiveBotBadge)
            const badge =
              !showSessionStatusBadge && s.bot_status
                ? botLabel(s.bot_status)
                : null
            const Wrapper = onSelectSession ? "button" : "div"
            return (
              <Wrapper
                key={s.id}
                type={onSelectSession ? "button" : undefined}
                onClick={
                  onSelectSession ? () => onSelectSession(s.id) : undefined
                }
                className={`flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left ${
                  onSelectSession
                    ? "cursor-pointer transition-colors hover:border-primary-soft-border hover:bg-accent"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isPaused ? (
                    <span className="relative inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  ) : s.has_active_speaker ? (
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>
                  ) : (
                    <span className="relative inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-red-500/60" />
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {s.name || t("ongoing.noTitle")}
                      </span>
                      {showSessionStatusBadge && (
                        <SessionStatusBadge
                          status={isPaused ? "paused" : "active"}
                        />
                      )}
                      {badge && s.bot_status && (
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] uppercase ${botStatusBadgeClass(s.bot_status)}`}
                        >
                          {(s.bot_status === "recording" ||
                            s.bot_status === "in_meeting") && (
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                          )}
                          {badge}
                        </span>
                      )}
                    </div>
                    {s.started_at && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(s.started_at, "en")}
                      </span>
                    )}
                  </div>
                </div>
                {onSelectSession && (
                  <span className="shrink-0 text-xs font-medium text-primary">
                    {t("ongoing.open")}
                  </span>
                )}
              </Wrapper>
            )
          })}
        </div>
      )}
    </section>
  )
}
