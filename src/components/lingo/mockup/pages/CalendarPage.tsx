"use client"

import { useCallback } from "react"
import type { Page } from "@/components/lingo/mockup/types"
import { UpcomingMeetings } from "@/components/lingo/mockup/UpcomingMeetings"

interface CalendarPageProps {
  onNavigateToSettings?: () => void
  onNavigate?: (page: Page) => void
}

export function CalendarPage({
  onNavigateToSettings,
  onNavigate,
}: CalendarPageProps) {
  const handleNavigateToSettings = useCallback(() => {
    onNavigateToSettings?.()
    onNavigate?.("settings")
  }, [onNavigateToSettings, onNavigate])

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="flex w-full flex-col px-6 py-6 sm:px-10 sm:py-8">
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your upcoming meetings.
          </p>
        </div>
        <UpcomingMeetings onNavigateToSettings={handleNavigateToSettings} />
      </div>
    </div>
  )
}
