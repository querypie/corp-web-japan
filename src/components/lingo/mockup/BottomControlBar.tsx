"use client"

import { useState } from "react"
import { useTranslations } from "@/lib/lingo/intl"
import { DropdownMenu } from "@/components/lingo/mockup/ui/DropdownMenu"

interface BottomControlBarProps {
  currentDeviceId: string
  onDeviceChange: (deviceId: string) => void
  volumeLevel: number
  isActive: boolean
  onEnd: () => void
  audioSource?: "mic" | "screen" | "mix"
  isPaused?: boolean
  onPause?: () => void
  onResume?: () => void
  isStarted?: boolean
  onStart?: () => void
}

interface AudioDevice {
  deviceId: string
  label: string
}

export function BottomControlBar({
  currentDeviceId,
  onDeviceChange,
  volumeLevel,
  onEnd,
  audioSource = "mic",
  isPaused = false,
  onPause,
  onResume,
  isStarted = true,
  onStart,
}: BottomControlBarProps) {
  const t = useTranslations("mockup.session")
  const [devices] = useState<AudioDevice[]>(() => [
    { deviceId: "default", label: t("controls.devices.default") },
    { deviceId: "mic-001", label: t("controls.devices.builtIn") },
    { deviceId: "mic-002", label: t("controls.devices.externalUsb") },
  ])

  const selectedLabel =
    devices.find((d) => d.deviceId === currentDeviceId)?.label ??
    devices[0]?.label ??
    t("controls.devices.fallback")

  const volumeBarCount = 10
  const activeBars = Math.round(volumeLevel * volumeBarCount)

  return (
    <footer className="flex items-end justify-center gap-2 border-t border-border bg-card px-4 py-3">
      {/* 1. Start / Pause+Timer card */}
      {!isStarted ? (
        /* Start button */
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onStart}
            className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border border-transparent bg-primary text-primary-foreground transition-colors hover:opacity-90"
          >
            {/* Record icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84z" />
            </svg>
          </button>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            {t("controls.start")}
          </span>
        </div>
      ) : (
        /* Pause / Resume + timer */
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={isPaused ? onResume : onPause}
            className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border text-foreground transition-colors hover:bg-accent"
            style={{
              borderColor: isPaused
                ? "var(--color-border)"
                : "var(--color-success)",
              animation: isPaused
                ? "none"
                : "breathe-success 2s ease-in-out infinite",
            }}
          >
            {isPaused ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 shrink-0"
              >
                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 shrink-0"
              >
                <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5zM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5z" />
              </svg>
            )}
          </button>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            {isPaused ? t("controls.resume") : t("controls.pause")}
          </span>
        </div>
      )}

      {/* 2. Mic selector card */}
      {audioSource !== "screen" && (
        <DropdownMenu
          className="relative flex w-[120px] flex-col items-stretch gap-1"
          menuClassName="absolute bottom-full left-0 z-20 mb-1.5 w-72 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
          trigger={({ open, toggle }) => (
            <>
              <button
                type="button"
                onClick={toggle}
                className="flex h-[52px] w-full cursor-pointer items-center gap-2 rounded-full border border-border px-4 transition-colors hover:bg-accent"
                title={t("controls.selectMicrophone")}
                aria-label={t("controls.selectMicrophone")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0 text-foreground"
                >
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
                  <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.08A7 7 0 0019 11z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`-ml-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: volumeBarCount }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 w-[2px] shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          i < activeBars
                            ? "var(--color-success)"
                            : "var(--color-border)",
                        transition: "background-color 60ms linear",
                      }}
                    />
                  ))}
                </div>
              </button>
              <span
                className="hidden w-full truncate text-center text-[11px] text-muted-foreground sm:inline"
                title={selectedLabel}
              >
                {selectedLabel}
              </span>
            </>
          )}
        >
          {({ close }) => (
            <>
              {devices.map((d) => {
                const isSelected = d.deviceId === currentDeviceId
                return (
                  <button
                    key={d.deviceId}
                    type="button"
                    onClick={() => {
                      onDeviceChange(d.deviceId)
                      close()
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:active:scale-100 ${
                      isSelected
                        ? "bg-accent font-medium text-primary"
                        : "text-popover-foreground sm:hover:text-accent-foreground"
                    }`}
                  >
                    {isSelected ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 shrink-0 text-primary"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{d.label}</span>
                  </button>
                )
              })}
            </>
          )}
        </DropdownMenu>
      )}

      {/* 3. End button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onEnd}
          className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-colors hover:opacity-90"
          title={t("controls.stop")}
          aria-label={t("controls.stop")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
        <span className="hidden text-[11px] text-muted-foreground sm:inline">
          {t("controls.stop")}
        </span>
      </div>
    </footer>
  )
}
