"use client"

import { Microphone, MonitorPlay } from "@phosphor-icons/react"
import { OngoingMeetings } from "@/components/lingo/mockup/OngoingMeetings"

interface HomePageProps {
  onStartInPerson: () => void
  onStartRemote: () => void
  onOpenOngoing?: (sessionId: string) => void
}

export function HomePage({
  onStartInPerson,
  onStartRemote,
  onOpenOngoing,
}: HomePageProps) {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[800px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            Start of meeting
          </h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            When the meeting ends, your conversation and translations will be
            saved to{" "}
            <span className="font-medium text-foreground">Meetings</span> so you
            can review them anytime.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onStartInPerson}
            className="group flex min-h-[144px] cursor-pointer flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left transition-[border-color,background-color,transform] active:scale-[0.99] sm:min-h-[160px] sm:p-5 sm:hover:border-primary-soft-border sm:hover:bg-accent sm:active:scale-100"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
              <Microphone className="h-6 w-6" weight="regular" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">
                In-Person Meeting
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Record audio from your device
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onStartRemote}
            className="group flex min-h-[144px] cursor-pointer flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left transition-[border-color,background-color,transform] active:scale-[0.99] sm:min-h-[160px] sm:p-5 sm:hover:border-primary-soft-border sm:hover:bg-accent sm:active:scale-100"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500 text-white">
              <MonitorPlay className="h-6 w-6" weight="regular" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">
                Remote Meeting
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Join via Zoom, Meet, or Teams
              </p>
            </div>
          </button>
        </div>

        <div className="mt-8">
          <OngoingMeetings onSelectSession={onOpenOngoing} />
        </div>
      </div>
    </div>
  )
}
