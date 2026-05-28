"use client"

import { useCallback, useState } from "react"
import { Clock } from "@phosphor-icons/react"
import { useOrganizationContext } from "@/components/lingo/mockup/contexts/OrganizationContext"
import { useCalendarConnect } from "@/components/lingo/mockup/hooks/useCalendarConnect"
import { useLangValidation } from "@/components/lingo/mockup/hooks/useLangValidation"
import { MOCK_CALENDAR_EVENTS } from "@/components/lingo/mockup/mockData"
import type { CalendarEvent } from "@/components/lingo/mockup/types"
import { LANGUAGE_FLAGS } from "@/components/lingo/mockup/types"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { Switch } from "@/components/lingo/mockup/ui/Switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/lingo/mockup/ui/tooltip"
import { CalendarProviderLogo } from "@/components/lingo/mockup/CalendarProviderLogo"
import { LanguageMultiSelect } from "@/components/lingo/mockup/LanguageMultiSelect"
import { PlatformLogo } from "@/components/lingo/mockup/PlatformLogo"
import {
  detectPlatform,
  formatTime,
  getDateKey,
  formatDateLabel,
} from "@/components/lingo/mockup/utils/calendarUtils"
import { getDefaultLanguageSet } from "@/components/lingo/mockup/utils/locale"

const DEFAULT_UPCOMING_DAYS = 7
export const TOOLTIP_HOVER_DELAY_MS = 400

type RecurringChoice = "this" | "from_here" | "all"
type CalendarStatus = "connected" | "sync_failed" | "pending" | "disconnected"

function getInitialEvents(days: number): CalendarEvent[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + days)
  return MOCK_CALENDAR_EVENTS.filter(
    (ev) => ev.meeting_url && new Date(ev.start_time) <= cutoff
  )
}

interface UpcomingMeetingsProps {
  onNavigateToSettings: () => void
}

export function UpcomingMeetings({
  onNavigateToSettings,
}: UpcomingMeetingsProps) {
  const { currentOrg } = useOrganizationContext()
  const { connect: startCalendarConnect } = useCalendarConnect()

  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus | null>(
    "connected"
  )
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getInitialEvents(DEFAULT_UPCOMING_DAYS)
  )
  const [loading, setLoading] = useState(false)
  const [reconnectLoading, setReconnectLoading] = useState(false)
  const [upcomingDays] = useState(DEFAULT_UPCOMING_DAYS)
  const [togglingBot, setTogglingBot] = useState<Set<string>>(new Set())

  // Language selection modal state
  const [botModalEvent, setBotModalEvent] = useState<CalendarEvent | null>(null)
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set())
  const { langError, triggerError, clearError } = useLangValidation()
  const [addTranslation, setAddTranslation] = useState(false)

  // Recurring schedule choice modal state (shown after language selection)
  const [recurringModalEvent, setRecurringModalEvent] =
    useState<CalendarEvent | null>(null)
  const [pendingLangs, setPendingLangs] = useState<Set<string>>(new Set())
  const [pendingTranslation, setPendingTranslation] = useState(false)

  // Recurring remove choice modal state (shown when toggling OFF a recurring event)
  const [recurringRemoveEvent, setRecurringRemoveEvent] =
    useState<CalendarEvent | null>(null)

  const reloadEvents = useCallback(
    (days?: number) => {
      const cutoffDays = days ?? upcomingDays
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() + cutoffDays)
      const filtered = MOCK_CALENDAR_EVENTS.filter(
        (ev) => ev.meeting_url && new Date(ev.start_time) <= cutoff
      )
      setEvents(filtered)
    },
    [upcomingDays]
  )

  const handleCalendarReconnect = useCallback(async () => {
    setReconnectLoading(true)
    try {
      setCalendarStatus("connected")
      reloadEvents()
    } finally {
      setReconnectLoading(false)
      setLoading(false)
    }
  }, [reloadEvents])

  const removeBot = useCallback(
    (ev: CalendarEvent, removeAll: boolean) => {
      setRecurringRemoveEvent(null)
      if (!currentOrg) return
      setTogglingBot((prev) => new Set(prev).add(ev.id))

      if (removeAll) {
        setEvents((prev) => {
          const isSameSeries = (e: CalendarEvent) => {
            if (!e.is_recurring) return false
            return ev.ical_uid
              ? e.ical_uid === ev.ical_uid
              : e.meeting_url === ev.meeting_url
          }
          return prev.map((e) =>
            isSameSeries(e)
              ? { ...e, bot_id: null, has_recurring_schedule: false }
              : e
          )
        })
      } else {
        setEvents((prev) =>
          prev.map((e) => (e.id === ev.id ? { ...e, bot_id: null } : e))
        )
      }

      setTogglingBot((prev) => {
        const next = new Set(prev)
        next.delete(ev.id)
        return next
      })
    },
    [currentOrg]
  )

  const scheduleBot = useCallback(
    async (
      ev: CalendarEvent,
      langs: Set<string>,
      scope: RecurringChoice,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      translationEnabled: boolean
    ) => {
      if (!currentOrg) return
      setTogglingBot((prev) => new Set(prev).add(ev.id))
      try {
        const fakeBotId = `bot-${ev.id}`
        const isRecurringScope = scope === "from_here" || scope === "all"
        const now = Date.now()
        const evStart = new Date(ev.start_time).getTime()

        setEvents((prev) =>
          prev.map((e) => {
            if (e.id === ev.id) {
              return {
                ...e,
                bot_id: fakeBotId,
                target_languages: Array.from(langs),
                has_recurring_schedule: isRecurringScope,
              }
            }
            if (isRecurringScope && ev.ical_uid && e.ical_uid === ev.ical_uid) {
              const eStart = new Date(e.start_time).getTime()
              const futureOnly = eStart > now
              const inScope =
                scope === "all" ? futureOnly : eStart >= evStart && futureOnly
              if (inScope) {
                return {
                  ...e,
                  bot_id: fakeBotId,
                  target_languages: Array.from(langs),
                  has_recurring_schedule: true,
                }
              }
              return { ...e, has_recurring_schedule: true }
            }
            return e
          })
        )
      } finally {
        setTogglingBot((prev) => {
          const next = new Set(prev)
          next.delete(ev.id)
          return next
        })
      }
    },
    [currentOrg]
  )

  const handleToggleBot = useCallback(
    (ev: CalendarEvent) => {
      if (togglingBot.has(ev.id)) return
      if (ev.bot_id) {
        // Bot ON → turn OFF
        if (ev.is_recurring && ev.has_recurring_schedule) {
          setRecurringRemoveEvent(ev)
        } else {
          removeBot(ev, false)
        }
      } else {
        // Bot OFF → turn ON
        setSelectedLangs(getDefaultLanguageSet(undefined))
        setAddTranslation(false)
        setBotModalEvent(ev)
      }
    },
    [togglingBot, removeBot]
  )

  // Step 1: Language selection dialog → confirm
  const handleLanguageConfirm = useCallback(() => {
    const ev = botModalEvent
    if (!ev) return
    if (selectedLangs.size === 0) {
      triggerError()
      return
    }
    clearError()
    setBotModalEvent(null)

    if (ev.is_recurring) {
      setPendingLangs(new Set(selectedLangs))
      setPendingTranslation(addTranslation)
      setRecurringModalEvent(ev)
    } else {
      scheduleBot(ev, selectedLangs, "this", addTranslation)
    }
  }, [
    botModalEvent,
    selectedLangs,
    addTranslation,
    scheduleBot,
    clearError,
    triggerError,
  ])

  const closeBotModal = useCallback(() => {
    clearError()
    setBotModalEvent(null)
    setAddTranslation(false)
  }, [clearError])

  // Step 2: Recurring choice selected
  const handleRecurringChoice = useCallback(
    (choice: RecurringChoice) => {
      const ev = recurringModalEvent
      if (!ev) return
      setRecurringModalEvent(null)
      scheduleBot(ev, pendingLangs, choice, pendingTranslation)
    },
    [recurringModalEvent, pendingLangs, pendingTranslation, scheduleBot]
  )

  // Group events by date
  const grouped: Array<{
    dateKey: string
    label: string
    items: CalendarEvent[]
  }> = []
  for (const ev of events) {
    const dateKey = getDateKey(ev.start_time)
    const last = grouped[grouped.length - 1]
    if (last && last.dateKey === dateKey) {
      last.items.push(ev)
    } else {
      grouped.push({
        dateKey,
        label: formatDateLabel(ev.start_time, "en"),
        items: [ev],
      })
    }
  }

  if (calendarStatus === null) return null

  const handleGoogleConnect = () => {
    sessionStorage.setItem("calendarConnectSource", "1")
    startCalendarConnect("google")
  }

  const handleMicrosoftConnect = () => {
    sessionStorage.setItem("calendarConnectSource", "1")
    startCalendarConnect("microsoft")
  }

  if (calendarStatus === "disconnected") {
    return (
      <section className="mt-10">
        <h2 className="text-base font-semibold text-foreground">Upcoming</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your calendar to see upcoming meetings.
        </p>
        <div className="mt-3 max-w-[30rem] rounded-xl border border-border bg-card pt-5 pr-2 pb-5 pl-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-t border-border pt-3 first:border-t-0 first:pt-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <CalendarProviderLogo provider="google" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Google Calendar
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGoogleConnect}
              >
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 first:border-t-0 first:pt-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <CalendarProviderLogo provider="microsoft" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Microsoft Outlook
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleMicrosoftConnect}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (calendarStatus === "sync_failed") {
    return (
      <section className="mt-10">
        <h2 className="text-base font-semibold text-foreground">Upcoming</h2>
        <div className="mt-3 rounded-xl border border-destructive/30 bg-card p-5">
          <p className="text-sm text-destructive">
            Calendar sync failed. Please reconnect.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              onClick={handleCalendarReconnect}
              disabled={reconnectLoading}
            >
              Reconnect
            </Button>
            <button
              type="button"
              onClick={onNavigateToSettings}
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Go to settings
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Upcoming</h2>
      </div>

      {calendarStatus === "pending" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Syncing calendar…
        </div>
      )}

      {/* Loading */}
      {calendarStatus === "connected" && loading && (
        <div className="mt-4 flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Empty state */}
      {calendarStatus === "connected" && !loading && events.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No upcoming meetings.
        </p>
      )}

      {/* Event list */}
      {calendarStatus === "connected" &&
        !loading &&
        grouped.map((group) => (
          <div key={group.dateKey}>
            <div className="mt-6 mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.label}
            </div>
            <div className="space-y-2">
              {group.items.map((ev) => {
                const platform = detectPlatform(ev.meeting_url)
                const botOn = !!ev.bot_id
                const toggling = togglingBot.has(ev.id)

                return (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-border bg-card px-4 py-3"
                  >
                    {/* Row 1: time | platform … language flags + recurring badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="whitespace-nowrap">
                          {formatTime(ev.start_time, "en")}
                          <span className="mx-1">–</span>
                          {formatTime(ev.end_time, "en")}
                        </span>
                        {platform && ev.meeting_url && (
                          <>
                            <span className="text-border">|</span>
                            <a
                              href={ev.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 transition-colors hover:bg-accent"
                            >
                              <PlatformLogo platform={platform} />
                              <span className="text-xs text-foreground">
                                {platform === "googleMeet" && "Google Meet"}
                                {platform === "zoom" && "Zoom"}
                                {platform === "teams" && "Teams"}
                              </span>
                            </a>
                          </>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {botOn &&
                          ev.target_languages &&
                          ev.target_languages.length > 0 && (
                            <span className="flex items-center gap-0.5">
                              {ev.target_languages.map((lang) => (
                                <span
                                  key={lang}
                                  className="text-sm leading-none"
                                >
                                  {LANGUAGE_FLAGS[lang] ?? lang}
                                </span>
                              ))}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Row 2: title … join toggle */}
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <p className="min-w-0 truncate text-sm font-semibold text-foreground">
                          {ev.title || "No title"}
                        </p>
                        {ev.is_recurring && (
                          <Clock
                            className="h-4 w-4 shrink-0 self-center text-muted-foreground/60"
                            weight="regular"
                          />
                        )}
                      </div>
                      {ev.meeting_url && (
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Auto-join
                          </span>
                          <Tooltip delayDuration={TOOLTIP_HOVER_DELAY_MS}>
                            <TooltipTrigger asChild>
                              <Switch
                                checked={botOn}
                                disabled={toggling}
                                onClick={() => handleToggleBot(ev)}
                                className={toggling ? "opacity-50" : ""}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {botOn
                                ? "Lingo will join this meeting"
                                : "Lingo will not join this meeting"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

      {/* Step 1: Language selection dialog */}
      <Dialog open={botModalEvent !== null} onClose={closeBotModal}>
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
          <h3 className="mb-1 text-base font-semibold">Source language</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            {botModalEvent?.title}
          </p>
          <div className="mb-5">
            <LanguageMultiSelect
              selected={selectedLangs}
              onChange={(next) => {
                setSelectedLangs(next)
                clearError()
                if (addTranslation && next.size < 2) {
                  setAddTranslation(false)
                }
              }}
              max={3}
              error={langError}
            />
          </div>
          {/* Translation Toggle — slim inline variant for max-w-sm dialog */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">
                Add translation
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Translate into additional languages
              </div>
            </div>
            {selectedLangs.size < 2 ? (
              <Tooltip delayDuration={TOOLTIP_HOVER_DELAY_MS}>
                <TooltipTrigger asChild>
                  <span>
                    <Switch
                      checked={false}
                      disabled
                      aria-label="Add translation"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Select at least 2 languages</TooltipContent>
              </Tooltip>
            ) : (
              <Switch
                checked={addTranslation}
                onClick={() => setAddTranslation((v) => !v)}
                aria-label="Add translation"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={closeBotModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleLanguageConfirm}>
              Start bot
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Step 2: Recurring schedule choice dialog */}
      <Dialog
        open={recurringModalEvent !== null}
        onClose={() => setRecurringModalEvent(null)}
      >
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
          <h3 className="mb-1 text-base font-semibold">
            Schedule recurring meeting
          </h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Apply bot to which occurrences?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => handleRecurringChoice("from_here")}
            >
              From this occurrence
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRecurringChoice("all")}
            >
              All occurrences
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRecurringChoice("this")}
            >
              This occurrence only
            </Button>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRecurringModalEvent(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Recurring remove choice dialog */}
      <Dialog
        open={recurringRemoveEvent !== null}
        onClose={() => setRecurringRemoveEvent(null)}
      >
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
          <h3 className="mb-1 text-base font-semibold">Remove bot</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Remove bot from which occurrences?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() =>
                recurringRemoveEvent && removeBot(recurringRemoveEvent, true)
              }
            >
              All occurrences
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                recurringRemoveEvent && removeBot(recurringRemoveEvent, false)
              }
            >
              This occurrence only
            </Button>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRecurringRemoveEvent(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </section>
  )
}
