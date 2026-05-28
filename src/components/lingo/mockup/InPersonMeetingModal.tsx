"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { Input } from "@/components/lingo/mockup/ui/Input"
import { Select } from "@/components/lingo/mockup/ui/Select"
import { Switch } from "@/components/lingo/mockup/ui/Switch"
import { LanguageMultiSelect } from "@/components/lingo/mockup/LanguageMultiSelect"
import {
  AUDIO_SOURCE_KEYS,
  LLM_TEXT_MODELS,
  LLM_AUDIO_MODELS,
  ASR_BACKENDS,
  ASR_BACKEND_DEFAULT,
  ASR_BACKEND_LLM_DIRECT,
  DEFAULT_LLM_CONFIG,
} from "@/components/lingo/mockup/types"
import type { AudioSource, LLMConfig } from "@/components/lingo/mockup/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lingo/mockup/ui/tooltip"
import { useLangValidation } from "@/components/lingo/mockup/hooks/useLangValidation"

const isDev = false

const MOCK_AUDIO_DEVICES = [
  { deviceId: "default", label: "MacBook Pro Mic" },
  { deviceId: "usb-1", label: "Blue Yeti" },
]

function isIOSWebKitDevice(): boolean {
  const ua = navigator.userAgent
  return (
    /iP(hone|od|ad)/.test(ua) ||
    (ua.includes("Macintosh") && "ontouchend" in document)
  )
}

interface InPersonMeetingModalProps {
  open: boolean
  onClose: () => void
  onStart: (
    name: string,
    targetLanguages: string[],
    audioSource: AudioSource,
    asrBackend: string,
    audioVerify: boolean,
    deviceId?: string,
    speechEnhance?: boolean,
    llmConfig?: LLMConfig,
    vadRedemptionMs?: number,
    translationEnabled?: boolean
  ) => void
}

export function InPersonMeetingModal({
  open,
  onClose,
  onStart,
}: InPersonMeetingModalProps) {
  const [name, setName] = useState("")
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set())
  const [audioSource, setAudioSource] = useState<AudioSource>("mic")
  const [audioDevices] =
    useState<{ deviceId: string; label: string }[]>(MOCK_AUDIO_DEVICES)
  const [selectedDevice, setSelectedDevice] = useState<string>(
    MOCK_AUDIO_DEVICES[0]?.deviceId ?? ""
  )
  const [micError, setMicError] = useState<string | null>(null)
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    ...DEFAULT_LLM_CONFIG,
    textEnabled: false,
  })
  const [asrBackendOverride, setAsrBackendOverride] = useState<string>(
    ASR_BACKEND_LLM_DIRECT
  )
  const [addTranslation, setAddTranslation] = useState(false)
  const [vadRedemptionMs, setVadRedemptionMs] = useState(1200)
  const { langError, errorToken, triggerError, clearError } =
    useLangValidation()

  const handleStart = async () => {
    if (selectedLangs.size === 0) {
      triggerError()
      return
    }
    setMicError(null)
    const isIOS = isIOSWebKitDevice()
    // Mockup: skip actual microphone permission request

    const sessionName =
      name.trim() || new Date().toLocaleString(navigator.language || "en-US")
    const effectiveLlmConfig = isDev ? llmConfig : undefined
    const userAsrBackend = addTranslation
      ? ASR_BACKEND_DEFAULT
      : ASR_BACKEND_LLM_DIRECT
    const effectiveAsrBackend = isDev ? asrBackendOverride : userAsrBackend
    const effectiveVadRedemptionMs = isDev ? vadRedemptionMs : 1200
    onStart(
      sessionName,
      Array.from(selectedLangs),
      audioSource,
      effectiveAsrBackend,
      effectiveLlmConfig?.audioEnabled ?? true,
      selectedDevice || undefined,
      !isIOS,
      effectiveLlmConfig,
      effectiveVadRedemptionMs,
      addTranslation
    )
    setName("")
    setSelectedLangs(new Set())
    setAudioSource("mic")
    setMicError(null)
    setLlmConfig({ ...DEFAULT_LLM_CONFIG, textEnabled: false })
    setAsrBackendOverride(ASR_BACKEND_LLM_DIRECT)
    setAddTranslation(false)
    setVadRedemptionMs(1200)
    clearError()
  }

  const handleClose = useCallback(() => {
    clearError()
    onClose()
  }, [clearError, onClose])

  // Mockup: always show screen-capture option in UI without probing the real API
  const supportsScreenCapture = true
  const localAudioSources = Object.entries(AUDIO_SOURCE_KEYS).filter(
    ([source]) =>
      source !== "bot" &&
      (supportsScreenCapture || (source !== "screen" && source !== "mix"))
  ) as [AudioSource, string][]

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="mx-4 w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <h2 className="mb-5 text-xl font-semibold text-card-foreground">
          In-Person Meeting
        </h2>

        {/* Audio Source */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Audio Source
          </label>
          <div className="flex flex-wrap gap-2">
            {localAudioSources.map(([source, labelKey]) => (
              <Button
                key={source}
                onClick={() => setAudioSource(source)}
                variant={audioSource === source ? "primary" : "outline"}
                size="sm"
              >
                {labelKey}
              </Button>
            ))}
          </div>
        </div>

        {/* Microphone selector */}
        {(audioSource === "mic" || audioSource === "mix") &&
          audioDevices.length > 0 && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Microphone
              </label>
              <Select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
              >
                {audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label ||
                      `Microphone ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </Select>
            </div>
          )}

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
        <div className="mb-4">
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
            errorToken={errorToken}
          />
        </div>

        {/* Add Translation Toggle */}
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

            {/* Browser VAD: redemptionMs */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-700">
                  VAD Stop Hangover
                </span>
                <span className="text-xs text-amber-600">
                  {vadRedemptionMs}ms
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={vadRedemptionMs}
                onChange={(e) => setVadRedemptionMs(Number(e.target.value))}
                className="mt-1 w-full accent-amber-500"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {micError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {micError}
            </p>
          )}
          <Button onClick={handleStart} fullWidth>
            Create Meeting
          </Button>
          <Button onClick={handleClose} variant="ghost" fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
