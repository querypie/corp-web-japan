"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "@/lib/lingo/intl"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { Select } from "@/components/lingo/mockup/ui/Select"
import { Tabs } from "@/components/lingo/mockup/ui/Tabs"
import { CalendarProviderLogo } from "@/components/lingo/mockup/CalendarProviderLogo"
import type { UserSettings } from "@/components/lingo/mockup/types"
import { UI_LANGUAGES } from "@/components/lingo/mockup/types"

type ThemeValue = "light" | "dark" | "system"
type CalendarProvider = "google" | "microsoft"
type CalendarAccount = {
  provider: CalendarProvider
  email: string | null
  connected_at: string
  status: string
  status_reason: string | null
}

const CALENDAR_PROVIDERS: {
  provider: CalendarProvider
  label: string
}[] = [
  { provider: "google", label: "Google Calendar" },
  { provider: "microsoft", label: "Microsoft Outlook" },
]

const MOCK_USER_SETTINGS: UserSettings = {
  preferred_language: "en",
  theme: "system",
  upcoming_days: 7,
  hotwords: [],
  enabled_hotword_presets: [],
}

export function SettingsPage() {
  const locale = useLocale()
  const t = useTranslations("mockup.settings")
  const initialLanguage =
    locale in UI_LANGUAGES ? locale : MOCK_USER_SETTINGS.preferred_language
  const themeOptions: { value: ThemeValue; label: string }[] = [
    { value: "light", label: t("theme.light") },
    { value: "dark", label: t("theme.dark") },
    { value: "system", label: t("theme.system") },
  ]
  const [settings, setSettings] = useState<UserSettings | null>(() => ({
    ...MOCK_USER_SETTINGS,
    preferred_language: initialLanguage,
  }))
  const [calendarAccounts, setCalendarAccounts] = useState<CalendarAccount[]>(
    () => [
      {
        provider: "google",
        email: "alice@acme.corp",
        connected_at: "2024-01-15T08:00:00Z",
        status: "connected",
        status_reason: null,
      },
    ]
  )
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [connectLoading] = useState(false)

  const saveSettings = async (patch: Partial<UserSettings>) => {
    setSettings((current) => (current ? { ...current, ...patch } : current))
  }

  const handleLanguageChange = (lang: string) => {
    if (!settings) return
    setSettings({ ...settings, preferred_language: lang })
    saveSettings({ preferred_language: lang })
  }

  const handleCalendarConnect = (provider: CalendarProvider) => {
    setCalendarAccounts((prev) => {
      if (prev.some((a) => a.provider === provider)) return prev
      return [
        ...prev,
        {
          provider,
          email: "alice@acme.corp",
          connected_at: new Date().toISOString(),
          status: "connected",
          status_reason: null,
        },
      ]
    })
  }

  const handleCalendarDisconnect = async (provider: CalendarProvider) => {
    setCalendarLoading(true)
    try {
      setCalendarAccounts((current) =>
        current.filter((account) => account.provider !== provider)
      )
    } finally {
      setCalendarLoading(false)
    }
  }

  const handleCalendarReconnect = async (provider: CalendarProvider) => {
    setCalendarLoading(true)
    try {
      setCalendarAccounts((current) =>
        current.map((account) =>
          account.provider === provider
            ? { ...account, status: "connected", status_reason: null }
            : account
        )
      )
    } finally {
      setCalendarLoading(false)
    }
  }

  const handleThemeChange = (theme: ThemeValue) => {
    if (!settings) return
    setSettings({ ...settings, theme })
    saveSettings({ theme })
  }

  const handleUpcomingDaysChange = (days: number) => {
    if (!settings) return
    setSettings({ ...settings, upcoming_days: days })
    saveSettings({ upcoming_days: days })
  }

  if (!settings) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-[640px] px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-6 text-xl font-semibold text-foreground">
          {t("title")}
        </h1>

        {/* Language */}
        <section className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 text-sm font-medium text-card-foreground">
            {t("language.heading")}
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("language.description")}
          </p>
          <Select
            containerClassName="w-full max-w-[200px]"
            value={settings.preferred_language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {Object.entries(UI_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
        </section>

        {/* Theme */}
        <section className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 text-sm font-medium text-card-foreground">
            {t("theme.heading")}
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("theme.description")}
          </p>
          <Tabs<ThemeValue>
            items={themeOptions.map((opt) => ({
              id: opt.value,
              label: opt.label,
            }))}
            value={(settings.theme as ThemeValue) ?? "system"}
            onValueChange={handleThemeChange}
            fit="content"
          />
        </section>

        {/* Upcoming meetings window */}
        <section className="mb-4 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 text-sm font-medium text-card-foreground">
            {t("upcomingMeetings.heading")}
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("upcomingMeetings.description")}
          </p>
          <Select
            containerClassName="w-full max-w-[200px]"
            value={String(settings.upcoming_days ?? 7)}
            onChange={(e) => handleUpcomingDaysChange(Number(e.target.value))}
          >
            {[1, 3, 5, 7, 14, 21, 28].map((d) => (
              <option key={d} value={String(d)}>
                {t("upcomingMeetings.daysLabel", { count: d })}
              </option>
            ))}
          </Select>
        </section>

        {/* Calendar */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="min-w-0">
            <h2 className="mb-1 text-sm font-medium text-card-foreground">
              {t("calendar.heading")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("calendar.description")}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {CALENDAR_PROVIDERS.map(({ provider, label }) => {
              const account = calendarAccounts.find(
                (item) => item.provider === provider
              )
              return (
                <div
                  key={provider}
                  className="flex items-center justify-between gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CalendarProviderLogo provider={provider} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      {account?.status === "connected" ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {t("calendar.connectedAs", {
                            email: account.email ?? "",
                          })}
                        </p>
                      ) : account?.status === "sync_failed" ? (
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-destructive">
                            {t("calendar.syncFailed")}
                          </p>
                          {account.status_reason && (
                            <span className="group relative text-destructive">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                {account.status_reason}
                              </span>
                            </span>
                          )}
                        </div>
                      ) : account ? (
                        <p className="text-xs text-muted-foreground">
                          {t("calendar.connectionPending")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {account?.status === "connected" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalendarDisconnect(provider)}
                      disabled={calendarLoading}
                    >
                      {t("calendar.disconnect")}
                    </Button>
                  ) : account ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalendarReconnect(provider)}
                      disabled={calendarLoading}
                    >
                      {t("calendar.reconnect")}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalendarConnect(provider)}
                      disabled={calendarLoading || connectLoading}
                    >
                      {t("calendar.connect")}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
