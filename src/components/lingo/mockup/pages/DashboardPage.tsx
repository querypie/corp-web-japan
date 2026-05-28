"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { SUPPORTED_LANGUAGES } from "@/components/lingo/mockup/types"
import type { CalendarEvent } from "@/components/lingo/mockup/types"
import { MOCK_CALENDAR_EVENTS } from "@/components/lingo/mockup/mockData"

function getInitialSortedEvents() {
  const sorted = [...MOCK_CALENDAR_EVENTS].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )
  return sorted
}

function getInitialClosestId(sorted: CalendarEvent[]) {
  const now = Date.now()
  let bestIdx = 0
  let bestDiff = Infinity
  sorted.forEach((ev, idx) => {
    const diff = Math.abs(new Date(ev.start_time).getTime() - now)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIdx = idx
    }
  })
  return sorted[bestIdx]?.id ?? null
}

export function DashboardPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(getInitialSortedEvents)
  const [syncing, setSyncing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [closestId, setClosestId] = useState<string | null>(() =>
    getInitialClosestId(getInitialSortedEvents())
  )
  const [showTodayButton, setShowTodayButton] = useState(false)
  const [togglingBot, setTogglingBot] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [botModalEvent, setBotModalEvent] = useState<CalendarEvent | null>(null)
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set())

  const scrollRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)
  const closestRef = useRef<HTMLDivElement>(null)

  const scrollToClosest = useCallback(() => {
    requestAnimationFrame(() => {
      closestRef.current?.scrollIntoView({ block: "center" })
    })
  }, [])

  useLayoutEffect(() => {
    scrollToClosest()
  }, [scrollToClosest])

  // Track if closest event is out of view → show "Today" button
  useEffect(() => {
    const el = closestRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setShowTodayButton(!entry.isIntersecting),
      { root: scrollRef.current, threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [closestId, events])

  // Load more future (scroll up — prepend)
  const loadNext = useCallback(async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      // Mock: no more data
      setNextCursor(null)
    } finally {
      setLoadingMore(false)
    }
  }, [nextCursor, loadingMore])

  // Load more past (scroll down — append)
  const loadPrev = useCallback(async () => {
    if (!prevCursor || loadingMore) return
    setLoadingMore(true)
    try {
      // Mock: no more data
      setPrevCursor(null)
    } finally {
      setLoadingMore(false)
    }
  }, [prevCursor, loadingMore])

  // Intersection observers for infinite scroll
  useEffect(() => {
    const topEl = topSentinelRef.current
    const bottomEl = bottomSentinelRef.current
    if (!topEl || !bottomEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (entry.target === topEl) loadNext()
          if (entry.target === bottomEl) loadPrev()
        }
      },
      { root: scrollRef.current, threshold: 0.1 }
    )

    observer.observe(topEl)
    observer.observe(bottomEl)
    return () => observer.disconnect()
  }, [loadNext, loadPrev])

  const handleSync = useCallback(async () => {
    setSyncing(true)
    try {
      const sorted = [...MOCK_CALENDAR_EVENTS].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )
      setEvents(sorted)
      setNextCursor(null)
      setPrevCursor(null)
      const now = Date.now()
      let bestIdx = 0
      let bestDiff = Infinity
      sorted.forEach((ev, idx) => {
        const diff = Math.abs(new Date(ev.start_time).getTime() - now)
        if (diff < bestDiff) {
          bestDiff = diff
          bestIdx = idx
        }
      })
      if (sorted[bestIdx]) {
        setClosestId(sorted[bestIdx].id)
      }
    } finally {
      setSyncing(false)
    }
  }, [])

  const handleTodayClick = useCallback(() => {
    scrollToClosest()
  }, [scrollToClosest])

  const handleToggleBot = useCallback(
    (ev: CalendarEvent) => {
      if (togglingBot.has(ev.id)) return
      if (ev.bot_id) {
        setTogglingBot((prev) => new Set(prev).add(ev.id))
        // Mock: toggle off
        window.setTimeout(() => {
          setEvents((prev) =>
            prev.map((e) => (e.id === ev.id ? { ...e, bot_id: null } : e))
          )
          setTogglingBot((prev) => {
            const next = new Set(prev)
            next.delete(ev.id)
            return next
          })
        }, 400)
      } else {
        setSelectedLangs(new Set(Object.keys(SUPPORTED_LANGUAGES)))
        setBotModalEvent(ev)
      }
    },
    [togglingBot]
  )

  const handleScheduleBot = useCallback(async () => {
    const ev = botModalEvent
    if (!ev || selectedLangs.size === 0) return
    setBotModalEvent(null)
    setTogglingBot((prev) => new Set(prev).add(ev.id))
    // Mock: schedule bot
    window.setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? { ...e, bot_id: `bot-${ev.id}` } : e))
      )
      setTogglingBot((prev) => {
        const next = new Set(prev)
        next.delete(ev.id)
        return next
      })
    }, 400)
  }, [botModalEvent, selectedLangs])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()

    if (isSameDay(d, now)) return "Today"
    if (isSameDay(d, tomorrow)) return "Tomorrow"
    if (isSameDay(d, yesterday)) return "Yesterday"

    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getDateKey = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Fixed header */}
      <div className="mx-auto w-full max-w-[640px] px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync"}
          </button>
        </div>
      </div>

      {/* Scrollable event list */}
      {events.length === 0 ? (
        <div className="mx-auto w-full max-w-[640px] px-4 sm:px-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[640px] px-4 pb-6 sm:px-6 sm:pb-8">
            <div className="space-y-2">
              {/* Top sentinel for loading future events */}
              <div ref={topSentinelRef} className="h-1" />

              {loadingMore && nextCursor && (
                <div className="flex justify-center py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {events.map((ev, i) => {
                const prevDateKey =
                  i > 0 ? getDateKey(events[i - 1].start_time) : null
                const currentDateKey = getDateKey(ev.start_time)
                const showDateSeparator = currentDateKey !== prevDateKey

                return (
                  <div key={ev.id}>
                    {showDateSeparator && (
                      <div className="flex items-center gap-3 py-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatDateLabel(ev.start_time)}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    )}
                    <div
                      ref={ev.id === closestId ? closestRef : undefined}
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        ev.id === closestId
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {ev.title || "(No title)"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatTime(ev.start_time)} -{" "}
                          {formatTime(ev.end_time)}
                        </p>
                        {ev.meeting_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(ev.meeting_url!)
                              setCopiedId(ev.id)
                              setTimeout(
                                () =>
                                  setCopiedId((prev) =>
                                    prev === ev.id ? null : prev
                                  ),
                                1500
                              )
                            }}
                            className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs text-primary hover:underline"
                          >
                            <span className="truncate">{ev.meeting_url}</span>
                            <span className="shrink-0 text-sm text-muted-foreground">
                              {copiedId === ev.id ? "✓" : "⎘"}
                            </span>
                          </button>
                        )}
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-1.5">
                        {ev.meeting_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleBot(ev)
                            }}
                            disabled={togglingBot.has(ev.id)}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                              ev.bot_id
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            {togglingBot.has(ev.id)
                              ? "..."
                              : ev.bot_id
                                ? "Bot ON"
                                : "Bot OFF"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {loadingMore && prevCursor && (
                <div className="flex justify-center py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {/* Bottom sentinel for loading past events */}
              <div ref={bottomSentinelRef} className="h-1" />
            </div>
          </div>
        </div>
      )}

      {/* "Today" floating button */}
      {showTodayButton && closestId && (
        <button
          type="button"
          onClick={handleTodayClick}
          className="absolute right-6 bottom-6 z-10 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Today
        </button>
      )}
      {/* Language selection modal for Bot ON */}
      <Dialog
        open={botModalEvent !== null}
        onClose={() => setBotModalEvent(null)}
      >
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
          <h3 className="mb-1 text-base font-semibold">Target Languages</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            {botModalEvent?.title}
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => {
              const selected = selectedLangs.has(code)
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() =>
                    setSelectedLangs((prev) => {
                      const next = new Set(prev)
                      if (next.has(code)) next.delete(code)
                      else next.add(code)
                      return next
                    })
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBotModalEvent(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleScheduleBot}
              disabled={selectedLangs.size === 0}
            >
              Start Bot
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
