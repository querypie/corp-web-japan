"use client"

import { useTranslations } from "@/lib/lingo/intl"

interface AudioCaptureProps {
  capturing: boolean
  connected: boolean
}

export function AudioCapture({ capturing, connected }: AudioCaptureProps) {
  const t = useTranslations("mockup.misc.audio")
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            connected ? "bg-success" : "bg-muted"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {connected ? t("connected") : t("disconnected")}
        </span>
      </div>

      {capturing && (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm font-medium text-destructive">
            {t("recording")}
          </span>
        </div>
      )}
    </div>
  )
}
