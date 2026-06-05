"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "@/lib/lingo/intl"
import {
  DotsThree,
  DownloadSimple,
  LinkSimple,
  Microphone,
  MonitorPlay,
  ShareNetwork,
  Trash,
  XCircle,
} from "@phosphor-icons/react"
import type {
  CalendarEvent,
  Session,
  ShareInfo,
} from "@/components/lingo/mockup/types"
import {
  LANGUAGE_FLAGS,
  TERMINAL_SESSION_STATES,
} from "@/components/lingo/mockup/types"
import { DropdownMenu } from "@/components/lingo/mockup/ui/DropdownMenu"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { ServerDownBanner } from "@/components/lingo/mockup/ServerDownBanner"
import { ShareModal } from "@/components/lingo/mockup/ShareModal"
import { DeleteConfirmationDialog } from "@/components/lingo/mockup/DeleteConfirmationDialog"
import {
  detectPlatform,
  formatTime,
} from "@/components/lingo/mockup/utils/calendarUtils"
import { PlatformLogo } from "@/components/lingo/mockup/PlatformLogo"
import { SessionStatusBadge } from "@/components/lingo/mockup/SessionStatusBadge"
import {
  MOCK_SESSIONS,
  MOCK_CALENDAR_EVENTS,
} from "@/components/lingo/mockup/mockData"

interface HistoryPageProps {
  onSelectSession: (sessionId: string) => void
  onRejoinSession?: (session: Session, autoJoinBot?: boolean) => void
  onResumeScheduled?: (session: Session) => void
}

// Maps CalendarEvent.bot_id → calendar event info for display + recurring delete
type CalendarEventInfo = Pick<
  CalendarEvent,
  "start_time" | "end_time" | "meeting_url" | "id" | "is_recurring" | "ical_uid"
>

type HistoryRow =
  | { type: "title" }
  | { type: "loading" }
  | { type: "server_down" }
  | { type: "empty" }
  | { type: "scheduled_header" }
  | { type: "scheduled_card"; session: Session }
  | { type: "history_header" }
  | { type: "history_card"; session: Session }
  | { type: "loading_more" }

function getInitialSessions() {
  return MOCK_SESSIONS
}

function getInitialScheduledSessions() {
  return MOCK_SESSIONS.filter((s) => s.session_state === "scheduled")
}

function getInitialCalendarInfoMap() {
  const map = new Map<string, CalendarEventInfo>()
  for (const ev of MOCK_CALENDAR_EVENTS) {
    if (ev.bot_id) {
      map.set(ev.bot_id, {
        id: ev.id,
        start_time: ev.start_time,
        end_time: ev.end_time,
        meeting_url: ev.meeting_url,
        is_recurring: ev.is_recurring,
        ical_uid: ev.ical_uid,
      })
    }
  }
  return map
}

export function HistoryPage({
  onSelectSession,
  onRejoinSession,
  onResumeScheduled,
}: HistoryPageProps) {
  const t = useTranslations("mockup.meetings.history")
  const locale = useLocale()
  const dateLocale = locale === "ko" ? "ko" : locale === "ja" ? "ja" : "en"
  const [sessions, setSessions] = useState<Session[]>(getInitialSessions)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const nextCursorRef = useRef<string | null>(null)
  // Mockup: never actually loading or server-down
  const loading = false
  const serverDown = false

  const [scheduledSessions, setScheduledSessions] = useState<Session[]>(
    getInitialScheduledSessions
  )
  const [calendarInfoMap, setCalendarInfoMap] = useState<
    Map<string, CalendarEventInfo>
  >(getInitialCalendarInfoMap)
  const [deleteChoiceSession, setDeleteChoiceSession] =
    useState<Session | null>(null)
  type DeleteTarget = { session: Session; mode: "history" | "scheduled" } | null
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [shareModalSession, setShareModalSession] = useState<Session | null>(
    null
  )

  const loadScheduledSessions = useCallback(async () => {
    const scheduled = MOCK_SESSIONS.filter(
      (s) => s.session_state === "scheduled"
    )
    setScheduledSessions(scheduled)
    setCalendarInfoMap(getInitialCalendarInfoMap())
  }, [])

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasNextPage || !nextCursorRef.current) {
      return
    }
    setLoadingMore(true)
    try {
      nextCursorRef.current = null
      setHasNextPage(false)
    } finally {
      setLoadingMore(false)
    }
  }, [hasNextPage, loading, loadingMore])

  // Scroll-based loadMore trigger
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
        void loadMore()
      }
    }
    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  const handleCreateShare = async (sessionId: string): Promise<ShareInfo> => {
    const updatedShare = {
      share_token: `token-${sessionId}`,
      share_url: `https://lingo.demo/s/${sessionId}`,
      created_at: new Date().toISOString(),
    }
    const applyShare = (s: Session) =>
      s.id === sessionId ? { ...s, share: updatedShare } : s
    setSessions((current) => current.map(applyShare))
    setScheduledSessions((current) => current.map(applyShare))
    setShareModalSession((current) =>
      current?.id === sessionId ? { ...current, share: updatedShare } : current
    )
    return updatedShare
  }

  const handleUpdateShare = async (
    sessionId: string,
    settings: { expires_at?: string | null; password?: string | null }
  ): Promise<ShareInfo> => {
    const updatedShare = {
      share_token: `token-${sessionId}`,
      share_url: `https://lingo.demo/s/${sessionId}`,
      created_at: new Date().toISOString(),
      share_expires_at: settings.expires_at ?? null,
      requires_password: !!settings.password,
      generated_password: settings.password ?? null,
    }
    const applyShare = (s: Session) =>
      s.id === sessionId
        ? {
            ...s,
            share: {
              ...updatedShare,
              created_at: s.share?.created_at ?? new Date().toISOString(),
            },
          }
        : s
    setSessions((current) => current.map(applyShare))
    setScheduledSessions((current) => current.map(applyShare))
    setShareModalSession((current) =>
      current?.id === sessionId
        ? {
            ...current,
            share: {
              ...updatedShare,
              created_at: current.share?.created_at ?? new Date().toISOString(),
            },
          }
        : current
    )
    return updatedShare
  }

  const handleUnshareSession = async (sessionId: string) => {
    const clearShare = (s: Session) =>
      s.id === sessionId ? { ...s, share: null } : s
    setSessions((current) => current.map(clearShare))
    setScheduledSessions((current) => current.map(clearShare))
  }

  const handleExportSession = async (
    sessionId: string,
    format: "json" | "srt"
  ) => {
    // 데모 목업: 실제 파일을 내려받지 않는다.
    void sessionId
    void format
  }

  const handleDeleteSession = async (sessionId: string) => {
    setSessions((current) =>
      current.filter((session) => session.id !== sessionId)
    )
  }

  const handleCancelBot = async (sessionId: string) => {
    const target =
      sessions.find((s) => s.id === sessionId) ??
      scheduledSessions.find((s) => s.id === sessionId)
    if (!target) return

    if (target.session_state === "scheduled") {
      const finalState = "cancelled" as Session["session_state"]
      setSessions((current) =>
        current.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                session_state: finalState,
                bot_status: "done",
                is_live: false,
              }
            : s
        )
      )
      setScheduledSessions((current) =>
        current.filter((s) => s.id !== sessionId)
      )
    } else {
      setSessions((current) =>
        current.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                session_state: "ended",
                bot_status: "done",
                is_live: false,
              }
            : s
        )
      )
    }
  }

  const handleDeleteScheduledSession = async (sessionId: string) => {
    setScheduledSessions((current) => current.filter((s) => s.id !== sessionId))
    void loadScheduledSessions()
  }

  const handleDeleteScheduledWithChoice = (session: Session) => {
    const calInfo = session.meeting_bot_id
      ? calendarInfoMap.get(session.meeting_bot_id)
      : undefined
    if (calInfo?.is_recurring) {
      setDeleteChoiceSession(session)
    } else {
      setDeleteTarget({ session, mode: "scheduled" })
    }
  }

  const handleDeleteScheduledAll = async (session: Session) => {
    setDeleteChoiceSession(null)
    const calInfo = session.meeting_bot_id
      ? calendarInfoMap.get(session.meeting_bot_id)
      : undefined
    if (!calInfo?.id) {
      void handleDeleteScheduledSession(session.id)
      return
    }
    setScheduledSessions((current) =>
      current.filter((s) => {
        const sCal = s.meeting_bot_id
          ? calendarInfoMap.get(s.meeting_bot_id)
          : undefined
        return sCal?.ical_uid !== calInfo.ical_uid
      })
    )
  }

  // Sort scheduled sessions by display time ascending (soonest first)
  const sortedScheduled = [...scheduledSessions].sort((a, b) => {
    const aTime = a.meeting_bot_id
      ? (calendarInfoMap.get(a.meeting_bot_id)?.start_time ?? a.created_at)
      : a.created_at
    const bTime = b.meeting_bot_id
      ? (calendarInfoMap.get(b.meeting_bot_id)?.start_time ?? b.created_at)
      : b.created_at
    return new Date(aTime).getTime() - new Date(bTime).getTime()
  })

  // Deduplicate by ical_uid: show soonest session per recurring series
  const upcomingScheduled = (() => {
    const seen = new Set<string>()
    const result: Session[] = []
    for (const session of sortedScheduled) {
      const calInfo = session.meeting_bot_id
        ? calendarInfoMap.get(session.meeting_bot_id)
        : undefined
      const key = calInfo?.ical_uid || session.id
      if (!seen.has(key)) {
        seen.add(key)
        result.push(session)
      }
    }
    return result
  })()

  // Regular session list excludes scheduled sessions
  const historySessions = sessions.filter(
    (s) => s.session_state !== "scheduled"
  )

  const rows = useMemo<HistoryRow[]>(() => {
    const result: HistoryRow[] = []
    result.push({ type: "title" })

    if (loading) {
      result.push({ type: "loading" })
      return result
    }

    if (serverDown) {
      result.push({ type: "server_down" })
      return result
    }

    if (upcomingScheduled.length > 0) {
      result.push({ type: "scheduled_header" })
      for (const session of upcomingScheduled) {
        result.push({ type: "scheduled_card", session })
      }
    }

    if (historySessions.length === 0 && scheduledSessions.length === 0) {
      result.push({ type: "empty" })
      return result
    }

    if (historySessions.length > 0) {
      result.push({ type: "history_header" })
      for (const session of historySessions) {
        result.push({ type: "history_card", session })
      }
    }

    if (loadingMore) {
      result.push({ type: "loading_more" })
    }

    return result
  }, [
    loading,
    serverDown,
    upcomingScheduled,
    historySessions,
    scheduledSessions,
    loadingMore,
  ])

  return (
    <div className="flex h-full flex-col bg-background">
      <div
        ref={scrollContainerRef}
        className="mx-auto w-full max-w-[640px] flex-1 overflow-y-auto px-4 sm:px-6"
      >
        {rows.map((row, idx) => {
          switch (row.type) {
            case "title":
              return (
                <div
                  key={`title-${idx}`}
                  className="flex items-center justify-between gap-3 pt-6 pb-6 sm:pt-8"
                >
                  <h1 className="text-xl font-semibold text-foreground">
                    {t("title")}
                  </h1>
                </div>
              )
            case "loading":
              return (
                <p
                  key={`loading-${idx}`}
                  className="py-4 text-muted-foreground"
                >
                  {t("loading")}
                </p>
              )
            case "server_down":
              return (
                <div key={`server-down-${idx}`} className="py-4">
                  <ServerDownBanner />
                </div>
              )
            case "empty":
              return (
                <div
                  key={`empty-${idx}`}
                  data-testid="history-empty-state"
                  className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                >
                  <p className="mb-2 text-lg">{t("empty.title")}</p>
                  <p className="text-sm">{t("empty.description")}</p>
                </div>
              )
            case "scheduled_header":
              return (
                <p
                  key={`scheduled-header-${idx}`}
                  className="pb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  {t("scheduledHeader")}
                </p>
              )
            case "scheduled_card": {
              const session = row.session
              const calInfo = session.meeting_bot_id
                ? calendarInfoMap.get(session.meeting_bot_id)
                : undefined
              const displayTime = calInfo?.start_time ?? session.created_at
              const date = new Date(displayTime)
              const platform = calInfo
                ? detectPlatform(calInfo.meeting_url)
                : null

              return (
                <div
                  key={`scheduled-${session.id}-${idx}`}
                  data-testid="meeting-card"
                  className={`group mb-2 flex w-full cursor-pointer items-stretch gap-x-4 rounded-2xl border px-4 py-3 transition-[background-color,transform] active:scale-[0.985] sm:active:scale-100 ${
                    session.meeting_type === "remote"
                      ? "border-purple/20 bg-purple/5 sm:hover:bg-purple/10"
                      : "border-brand/20 bg-brand/5 sm:hover:bg-brand/10"
                  }`}
                  onClick={() => {
                    if (
                      session.meeting_type !== "remote" &&
                      onResumeScheduled
                    ) {
                      onResumeScheduled(session)
                    } else {
                      onSelectSession(session.id)
                    }
                  }}
                >
                  {/* Date/time column */}
                  <div className="flex h-full w-[88px] shrink-0 items-center sm:w-[108px]">
                    <div className="flex min-h-[52px] w-full flex-col justify-center px-2">
                      <div className="text-[15px] leading-none font-semibold text-foreground">
                        {date.toLocaleDateString(dateLocale, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {date.toLocaleTimeString(dateLocale, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="ml-2 h-12 w-px shrink-0 bg-border sm:ml-4" />
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-base font-semibold text-foreground">
                            {session.name}
                          </h2>
                          {session.meeting_type === "remote" ? (
                            <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-purple text-white">
                              <MonitorPlay
                                className="h-3 w-3"
                                weight="regular"
                              />
                            </span>
                          ) : (
                            <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                              <Microphone
                                className="h-3 w-3"
                                weight="regular"
                              />
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            {session.target_languages.map((lang) => (
                              <span key={lang} className="text-sm leading-none">
                                {LANGUAGE_FLAGS[lang] ?? "🌐"}
                              </span>
                            ))}
                          </span>
                          {platform && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <PlatformLogo platform={platform} />
                              {platform}
                            </span>
                          )}
                        </div>
                        {/* Bot status badge */}
                        {session.bot_status &&
                          session.bot_status !== "done" && (
                            <span
                              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] uppercase ${
                                session.bot_status === "error"
                                  ? "bg-destructive/10 text-destructive"
                                  : session.bot_status === "recording" ||
                                      session.bot_status === "in_meeting"
                                    ? "bg-destructive/10 text-destructive"
                                    : session.bot_status === "in_waiting_room"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {(session.bot_status === "recording" ||
                                session.bot_status === "in_meeting") && (
                                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                              )}
                              {session.bot_status}
                            </span>
                          )}
                        {/* Time range colored by meeting type */}
                        {calInfo && (
                          <p
                            className={`mt-1 text-xs font-medium ${session.meeting_type === "remote" ? "text-purple" : "text-brand"}`}
                          >
                            {formatTime(calInfo.start_time, dateLocale)}
                            {" – "}
                            {formatTime(calInfo.end_time, dateLocale)}
                          </p>
                        )}
                      </div>

                      {/* "..." menu */}
                      <DropdownMenu
                        className="relative shrink-0 self-center"
                        menuClassName="absolute right-0 top-8 z-10 w-max min-w-44 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggle()
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                            aria-label={t("moreActions")}
                          >
                            <DotsThree className="h-5 w-5" weight="bold" />
                          </button>
                        )}
                      >
                        {({ close }) => (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                close()
                                setShareModalSession(session)
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                            >
                              <ShareNetwork
                                className="h-4 w-4"
                                weight="regular"
                              />
                              <span>{t("actions.share")}</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                close()
                                handleDeleteScheduledWithChoice(session)
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-destructive/10 sm:active:scale-100"
                            >
                              <Trash className="h-4 w-4" weight="regular" />
                              <span>{t("actions.delete")}</span>
                            </button>
                          </>
                        )}
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            }
            case "history_header":
              return (
                <p
                  key={`history-header-${idx}`}
                  className="pt-6 pb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  {t("allHeader")}
                </p>
              )
            case "history_card": {
              const session = row.session
              const date = new Date(session.created_at)
              const timeLabel = date.toLocaleTimeString(dateLocale, {
                hour: "numeric",
                minute: "2-digit",
              })
              return (
                <div
                  key={`history-${session.id}-${idx}`}
                  className="group mb-2 flex w-full cursor-pointer items-stretch gap-x-4 rounded-2xl border border-border bg-card px-4 py-3 transition-[background-color,transform] active:scale-[0.985] sm:hover:bg-accent sm:active:scale-100"
                  onClick={() => {
                    const isTerminal = TERMINAL_SESSION_STATES.has(
                      session.session_state
                    )
                    if (isTerminal) {
                      onSelectSession(session.id)
                    } else if (
                      session.session_state === "scheduled" &&
                      session.meeting_type !== "remote" &&
                      onResumeScheduled
                    ) {
                      onResumeScheduled(session)
                    } else if (onRejoinSession) {
                      onRejoinSession(session)
                    } else {
                      onSelectSession(session.id)
                    }
                  }}
                >
                  <div className="flex h-full w-[88px] shrink-0 items-center sm:w-[108px]">
                    <div className="flex min-h-[52px] w-full flex-col justify-center px-2">
                      <div className="text-[15px] leading-none font-semibold text-foreground">
                        {date.toLocaleDateString(dateLocale, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {timeLabel}
                      </div>
                    </div>
                    <div className="ml-2 h-12 w-px shrink-0 bg-border sm:ml-4" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-base font-semibold text-foreground">
                            {session.name}
                          </h2>
                          {session.meeting_type === "remote" ? (
                            <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-purple text-white">
                              <MonitorPlay
                                className="h-3 w-3"
                                weight="regular"
                              />
                            </span>
                          ) : (
                            <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                              <Microphone
                                className="h-3 w-3"
                                weight="regular"
                              />
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            {session.target_languages.map((lang) => (
                              <span key={lang} className="text-sm leading-none">
                                {LANGUAGE_FLAGS[lang] ?? "🌐"}
                              </span>
                            ))}
                          </span>
                          {session.session_state === "scheduled" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-amber-700 uppercase dark:bg-amber-900/30 dark:text-amber-400">
                              {t("badges.scheduled")}
                            </span>
                          )}
                          {session.session_state === "cancelled" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                              {t("badges.cancelled")}
                            </span>
                          )}
                          {session.session_state === "auto_join_failed" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-destructive uppercase">
                              {t("badges.autoJoinFailed")}
                            </span>
                          )}
                          {session.bot_status &&
                            session.bot_status !== "done" && (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] uppercase ${
                                  session.bot_status === "error"
                                    ? "bg-destructive/10 text-destructive"
                                    : session.bot_status === "recording" ||
                                        session.bot_status === "in_meeting"
                                      ? "bg-destructive/10 text-destructive"
                                      : session.bot_status === "in_waiting_room"
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}
                              >
                                {(session.bot_status === "recording" ||
                                  session.bot_status === "in_meeting") && (
                                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                                )}
                                {session.bot_status}
                              </span>
                            )}
                          {session.session_state === "live" &&
                            session.meeting_type !== "remote" && (
                              <SessionStatusBadge
                                status={
                                  session.session_status === "paused"
                                    ? "paused"
                                    : "active"
                                }
                              />
                            )}
                          {session.share && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-primary-soft-foreground uppercase">
                              <LinkSimple
                                className="h-3 w-3"
                                weight="regular"
                              />
                              {t("badges.shared")}
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu
                        className="relative shrink-0 self-center"
                        menuClassName="absolute right-0 top-8 z-10 w-max min-w-44 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              toggle()
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                            aria-label={t("moreActions")}
                          >
                            <DotsThree className="h-5 w-5" weight="bold" />
                          </button>
                        )}
                      >
                        {({ close }) => (
                          <>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                close()
                                setShareModalSession(session)
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                            >
                              <ShareNetwork
                                className="h-4 w-4"
                                weight="regular"
                              />
                              <span>{t("actions.share")}</span>
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                close()
                                void handleExportSession(session.id, "json")
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                            >
                              <DownloadSimple
                                className="h-4 w-4 shrink-0"
                                weight="regular"
                              />
                              <span className="whitespace-nowrap">
                                {t("actions.downloadTranscript")}
                              </span>
                            </button>
                            {session.meeting_type === "remote" &&
                              !TERMINAL_SESSION_STATES.has(
                                session.session_state
                              ) &&
                              session.bot_status !== "done" &&
                              session.bot_status !== "error" && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    close()
                                    void handleCancelBot(session.id)
                                  }}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-destructive/10 sm:active:scale-100"
                                >
                                  <XCircle
                                    className="h-4 w-4"
                                    weight="regular"
                                  />
                                  <span>
                                    {session.bot_status === "recording" ||
                                    session.bot_status === "in_meeting"
                                      ? t("actions.removeBot")
                                      : t("actions.cancelMeeting")}
                                  </span>
                                </button>
                              )}
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                close()
                                setDeleteTarget({ session, mode: "history" })
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-destructive/10 sm:active:scale-100"
                            >
                              <Trash className="h-4 w-4" weight="regular" />
                              <span>{t("actions.delete")}</span>
                            </button>
                          </>
                        )}
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            }
            case "loading_more":
              return (
                <p
                  key={`loading-more-${idx}`}
                  className="py-4 text-center text-sm text-muted-foreground"
                >
                  {t("loading")}
                </p>
              )
          }
        })}
      </div>

      {/* Recurring delete choice modal */}
      <Dialog
        open={deleteChoiceSession !== null}
        onClose={() => setDeleteChoiceSession(null)}
      >
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
          <h3 className="mb-1 text-base font-semibold">
            {t("recurringDialog.title")}
          </h3>
          <p className="mb-5 text-sm text-muted-foreground">
            {t("recurringDialog.description")}
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() =>
                deleteChoiceSession &&
                void handleDeleteScheduledAll(deleteChoiceSession)
              }
              className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
            >
              {t("recurringDialog.removeAll")}
            </button>
            <button
              type="button"
              onClick={() => {
                const s = deleteChoiceSession
                setDeleteChoiceSession(null)
                if (s) void handleDeleteScheduledSession(s.id)
              }}
              className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              {t("recurringDialog.removeOne")}
            </button>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setDeleteChoiceSession(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t("recurringDialog.cancel")}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          const target = deleteTarget
          if (!target) return
          if (target.mode === "scheduled") {
            await handleDeleteScheduledSession(target.session.id)
          } else {
            await handleDeleteSession(target.session.id)
          }
          setDeleteTarget(null)
        }}
        title={t("deleteDialog.title")}
        description={t("deleteDialog.description", {
          name: deleteTarget?.session.name ?? "",
        })}
        confirmButtonText={t("deleteDialog.confirm")}
        cancelButtonText={t("deleteDialog.cancel")}
      />

      <ShareModal
        open={shareModalSession !== null}
        share={shareModalSession?.share ?? null}
        shareToken={shareModalSession?.share?.share_token ?? null}
        onClose={() => setShareModalSession(null)}
        onCreateShare={() => handleCreateShare(shareModalSession!.id)}
        onUpdateShare={(settings) =>
          handleUpdateShare(shareModalSession!.id, settings)
        }
        onUnshare={() => handleUnshareSession(shareModalSession!.id)}
      />
    </div>
  )
}
