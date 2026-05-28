"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Lightning, HandTap } from "@phosphor-icons/react"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { Input } from "@/components/lingo/mockup/ui/Input"
import { Select } from "@/components/lingo/mockup/ui/Select"
import { Switch } from "@/components/lingo/mockup/ui/Switch"
import { LanguageMultiSelect } from "@/components/lingo/mockup/LanguageMultiSelect"
import {
  LLM_TEXT_MODELS,
  LLM_AUDIO_MODELS,
  ASR_BACKENDS,
  ASR_BACKEND_DEFAULT,
  ASR_BACKEND_LLM_DIRECT,
  DEFAULT_LLM_CONFIG,
} from "@/components/lingo/mockup/types"
import type { LLMConfig } from "@/components/lingo/mockup/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lingo/mockup/ui/tooltip"
import { useTimedValidation } from "@/components/lingo/mockup/hooks/useTimedValidation"

const isDev = false

const ALLOWED_HOSTS = [
  "meet.google.com",
  "zoom.us",
  "teams.microsoft.com",
  "teams.live.com",
]

function isValidMeetingUrl(url: string): boolean {
  try {
    const u = new URL(url.trim())
    if (u.protocol !== "https:") return false
    const hostname = u.hostname.toLowerCase()
    return ALLOWED_HOSTS.some(
      (allowed) => hostname === allowed || hostname.endsWith("." + allowed)
    )
  } catch {
    return false
  }
}

interface RemoteMeetingModalProps {
  open: boolean
  onClose: () => void
  onStart: (
    name: string,
    targetLanguages: string[],
    meetingUrl: string,
    asrBackend: string,
    audioVerify: boolean,
    llmConfig?: LLMConfig,
    vadStopHangoverMs?: number,
    translationEnabled?: boolean
  ) => void
  onManualCreate: (
    name: string,
    targetLanguages: string[],
    meetingUrl: string,
    asrBackend: string,
    audioVerify: boolean,
    llmConfig?: LLMConfig,
    vadStopHangoverMs?: number,
    translationEnabled?: boolean
  ) => void
}

export function RemoteMeetingModal({
  open,
  onClose,
  onStart,
  onManualCreate,
}: RemoteMeetingModalProps) {
  const [name, setName] = useState("")
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set())
  const [meetingUrl, setMeetingUrl] = useState("")
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    ...DEFAULT_LLM_CONFIG,
    textEnabled: false,
  })
  const [asrBackendOverride, setAsrBackendOverride] = useState<string>(
    ASR_BACKEND_LLM_DIRECT
  )
  const [addTranslation, setAddTranslation] = useState(false)
  const [vadStopHangoverMs, setVadStopHangoverMs] = useState(1200)
  const [joinMode, setJoinMode] = useState<"immediate" | "manual">("immediate")
  const {
    error: langError,
    errorToken: langErrorToken,
    triggerError,
    clearError,
  } = useTimedValidation()
  const {
    error: urlError,
    errorToken: urlErrorToken,
    triggerError: triggerUrlError,
    clearError: clearUrlError,
  } = useTimedValidation({ autoDismiss: false })
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (urlError && urlInputRef.current) {
      const el = urlInputRef.current
      el.style.animation = "none"
      void el.offsetHeight
      el.style.animation = ""
    }
  }, [urlError, urlErrorToken])

  const handleStart = () => {
    const trimmedUrl = meetingUrl.trim()
    let hasError = false
    if (!isValidMeetingUrl(trimmedUrl)) {
      triggerUrlError()
      hasError = true
    }
    if (selectedLangs.size === 0) {
      triggerError()
      hasError = true
    }
    if (hasError) return

    const sessionName =
      name.trim() || new Date().toLocaleString(navigator.language || "en-US")
    const effectiveLlmConfig = isDev ? llmConfig : undefined
    const userAsrBackend = addTranslation
      ? ASR_BACKEND_DEFAULT
      : ASR_BACKEND_LLM_DIRECT
    const effectiveAsrBackend = isDev ? asrBackendOverride : userAsrBackend
    const effectiveVadStopHangoverMs = isDev ? vadStopHangoverMs : undefined
    if (joinMode === "immediate") {
      onStart(
        sessionName,
        Array.from(selectedLangs),
        meetingUrl.trim(),
        effectiveAsrBackend,
        effectiveLlmConfig?.audioEnabled ?? true,
        effectiveLlmConfig,
        effectiveVadStopHangoverMs,
        addTranslation
      )
    } else {
      onManualCreate(
        sessionName,
        Array.from(selectedLangs),
        meetingUrl.trim(),
        effectiveAsrBackend,
        effectiveLlmConfig?.audioEnabled ?? true,
        effectiveLlmConfig,
        effectiveVadStopHangoverMs,
        addTranslation
      )
    }
    setName("")
    setSelectedLangs(new Set())
    setMeetingUrl("")
    setLlmConfig({ ...DEFAULT_LLM_CONFIG, textEnabled: false })
    setAsrBackendOverride(ASR_BACKEND_LLM_DIRECT)
    setAddTranslation(false)
    setVadStopHangoverMs(1200)
    setJoinMode("immediate")
    clearError()
    clearUrlError()
  }

  const handleClose = useCallback(() => {
    clearError()
    clearUrlError()
    onClose()
  }, [clearError, clearUrlError, onClose])

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="mx-4 w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <h2 className="mb-5 text-xl font-semibold text-card-foreground">
          Remote Meeting
        </h2>

        {/* Meeting URL */}
        <div className="mb-4">
          <label
            htmlFor="meeting-url"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Meeting URL
          </label>
          <Input
            id="meeting-url"
            ref={urlInputRef}
            type="url"
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            onBlur={() => {
              if (isValidMeetingUrl(meetingUrl)) {
                clearUrlError()
              }
            }}
            placeholder="Paste meeting link (Zoom, Google Meet, Teams...)"
            aria-invalid={urlError || undefined}
            aria-describedby={urlError ? "url-error-msg" : "meeting-url-hint"}
            className={
              urlError
                ? "animate-shake border-destructive focus:border-destructive focus:ring-destructive"
                : undefined
            }
          />
          {urlError ? (
            <p id="url-error-msg" className="mt-1 text-xs text-destructive">
              Please enter a valid meeting URL (Zoom, Google Meet, Teams)
            </p>
          ) : (
            <p
              id="meeting-url-hint"
              className="mt-1 text-xs text-muted-foreground"
            >
              Supported: Google Meet, Zoom, Microsoft Teams
            </p>
          )}
        </div>

        {/* Session Name */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-foreground">
            Meeting Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter meeting name (optional)"
          />
        </div>

        {/* Target Languages */}
        <div className="mb-6">
          <LanguageMultiSelect
            selected={selectedLangs}
            onChange={(next) => {
              setSelectedLangs(next)
              clearError()
              if (addTranslation && next.size < 2) {
                setAddTranslation(false)
                if (isDev) {
                  setAsrBackendOverride(ASR_BACKEND_LLM_DIRECT)
                  setLlmConfig({
                    ...DEFAULT_LLM_CONFIG,
                    textEnabled: false,
                  })
                }
              }
            }}
            max={3}
            label="Source Language"
            error={langError}
            errorToken={langErrorToken}
          />
        </div>

        {/* Translation Toggle */}
        <div className="mb-4 rounded-xl border border-border bg-accent/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">
                Add Translation
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Enable real-time translation between selected languages
              </div>
            </div>
            {selectedLangs.size < 2 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Switch
                        checked={false}
                        disabled
                        aria-label="Add Translation"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Select at least 2 languages to enable translation
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Switch
                checked={addTranslation}
                onClick={() => {
                  setAddTranslation((v) => {
                    const next = !v
                    if (isDev) {
                      setAsrBackendOverride(
                        next ? ASR_BACKEND_DEFAULT : ASR_BACKEND_LLM_DIRECT
                      )
                      setLlmConfig(
                        next
                          ? { ...DEFAULT_LLM_CONFIG }
                          : { ...DEFAULT_LLM_CONFIG, textEnabled: false }
                      )
                    }
                    return next
                  })
                }}
                aria-label="Add Translation"
              />
            )}
          </div>
        </div>

        {/* Join Mode */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Join Mode
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setJoinMode("immediate")}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-sm transition-colors ${
                joinMode === "immediate"
                  ? "border-foreground/20 bg-muted font-medium text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent/30"
              }`}
            >
              <Lightning
                className="h-6 w-6"
                weight={joinMode === "immediate" ? "fill" : "regular"}
              />
              <span>Join Now</span>
            </button>
            <button
              type="button"
              onClick={() => setJoinMode("manual")}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-sm transition-colors ${
                joinMode === "manual"
                  ? "border-foreground/20 bg-muted font-medium text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent/30"
              }`}
            >
              <HandTap
                className="h-6 w-6"
                weight={joinMode === "manual" ? "fill" : "regular"}
              />
              <span>Join Later</span>
            </button>
          </div>
        </div>

        {/* Dev Settings */}
        {isDev && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <label className="mb-3 block text-xs font-semibold tracking-wide text-amber-600 uppercase">
              Dev Settings
            </label>

            {/* ASR Backend */}
            <div className="mb-3">
              <span className="text-xs font-medium text-amber-700">
                ASR Backend
              </span>
              <Select
                className="mt-1.5 !text-xs"
                value={asrBackendOverride}
                onChange={(e) => {
                  const val = e.target.value
                  setAsrBackendOverride(val)
                  if (val === ASR_BACKEND_DEFAULT) {
                    if (selectedLangs.size >= 2) setAddTranslation(true)
                    setLlmConfig({ ...DEFAULT_LLM_CONFIG })
                  } else if (val === ASR_BACKEND_LLM_DIRECT) {
                    setAddTranslation(false)
                    setLlmConfig({
                      ...DEFAULT_LLM_CONFIG,
                      textEnabled: false,
                    })
                  }
                }}
              >
                {Object.entries(ASR_BACKENDS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            {/* LLM Stage-1: Clean + Translate */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-700">
                  LLM Stage-1 (Clean+Translate)
                </span>
                <Switch
                  checked={llmConfig.textEnabled}
                  disabled={asrBackendOverride === ASR_BACKEND_LLM_DIRECT}
                  onClick={() =>
                    setLlmConfig((prev) => ({
                      ...prev,
                      textEnabled: !prev.textEnabled,
                    }))
                  }
                />
              </div>
              {llmConfig.textEnabled && (
                <Select
                  className="mt-1.5 !text-xs"
                  value={llmConfig.textModel}
                  onChange={(e) =>
                    setLlmConfig((prev) => ({
                      ...prev,
                      textModel: e.target.value,
                    }))
                  }
                >
                  {Object.entries(LLM_TEXT_MODELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            {/* LLM Stage-2: Audio Verify */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-700">
                  LLM Stage-2 (Audio Verify)
                </span>
                <Switch
                  checked={llmConfig.audioEnabled}
                  disabled={asrBackendOverride === ASR_BACKEND_LLM_DIRECT}
                  onClick={() =>
                    setLlmConfig((prev) => ({
                      ...prev,
                      audioEnabled: !prev.audioEnabled,
                    }))
                  }
                />
              </div>
              {llmConfig.audioEnabled && (
                <Select
                  className="mt-1.5 !text-xs"
                  value={llmConfig.audioModel}
                  onChange={(e) =>
                    setLlmConfig((prev) => ({
                      ...prev,
                      audioModel: e.target.value,
                    }))
                  }
                >
                  {Object.entries(LLM_AUDIO_MODELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            {/* Recall VAD: stop hangover */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-700">
                  VAD Stop Hangover
                </span>
                <span className="text-xs text-amber-600">
                  {vadStopHangoverMs}ms
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={vadStopHangoverMs}
                onChange={(e) => setVadStopHangoverMs(Number(e.target.value))}
                className="mt-1 w-full accent-amber-500"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button onClick={handleStart} fullWidth>
            Save Session
          </Button>
          <Button onClick={handleClose} variant="ghost" fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
