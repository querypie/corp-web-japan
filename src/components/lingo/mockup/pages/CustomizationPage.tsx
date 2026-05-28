"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { Input } from "@/components/lingo/mockup/ui/Input"
import { Tabs } from "@/components/lingo/mockup/ui/Tabs"
import type { UserSettings } from "@/components/lingo/mockup/types"

type Tab = "keywords" | "presets" | "rules"

const TAG_CLASS_NAME =
  "rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"

const MAX_HOTWORDS_TOTAL = 100
const MAX_HOTWORD_LENGTH = 50

const TABS: { id: Tab; label: string }[] = [
  { id: "keywords", label: "Keywords" },
  { id: "presets", label: "Presets" },
  { id: "rules", label: "Rules" },
]

const PRESET_DEFINITIONS: Record<
  string,
  { label: string; keywords: string[] }
> = {
  ai: {
    label: "AI",
    keywords: [
      "AWS",
      "Anthropic",
      "Azure",
      "ChatGPT",
      "Claude",
      "Claude Sonnet",
      "DGX",
      "DeepSeek",
      "GPT-4",
      "GPT-4.1",
      "GPT-4o",
      "GPT-5",
      "Gemini",
      "Gen AI",
      "Hugging Face",
      "LLM",
      "LLMOps",
      "LangChain",
      "Llama",
      "MLOps",
      "OVX",
      "OpenAI",
      "Operator",
      "PEFT",
      "QLoRA",
      "Qwen",
      "RAG",
      "ReRank",
      "Sora",
      "Veo3",
      "Vertex AI",
      "fine-tuning",
      "o1",
      "o3",
      "vLLM",
    ],
  },
  crypto: {
    label: "Crypto/Blockchain",
    keywords: [
      "Binance USD (BUSD)",
      "Bitcoin",
      "Blockchain",
      "Crypto",
      "DAI",
      "DAO",
      "DeFi",
      "EVM",
      "Ethereum",
      "NFT",
      "Ripple",
      "Solana",
      "Stablecoin",
      "Tether (USDT)",
      "USD Coin (USDC)",
      "Web3",
    ],
  },
}

const MOCK_USER_SETTINGS: UserSettings = {
  preferred_language: "en",
  theme: "system",
  upcoming_days: 7,
  hotwords: [],
  enabled_hotword_presets: [],
}

function parseKeywords(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[,;]/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0)
    ),
  ]
}

function normalizeSettings(data: UserSettings): UserSettings {
  return {
    ...data,
    hotwords: Array.isArray(data.hotwords) ? data.hotwords : [],
    enabled_hotword_presets: Array.isArray(data.enabled_hotword_presets)
      ? data.enabled_hotword_presets
      : [],
  }
}

function computeAddableKeywords(
  words: string[],
  existing: string[],
  remainingSlots: number,
  maxLength: number
): string[] {
  const existingSet = new Set(existing.map((w) => w.toLowerCase()))
  const result: string[] = []
  for (const w of words) {
    if (result.length >= remainingSlots) break
    const lower = w.toLowerCase()
    if (!existingSet.has(lower) && w.length <= maxLength) {
      existingSet.add(lower)
      result.push(w)
    }
  }
  return result
}

export function CustomizationPage() {
  const [settings, setSettings] = useState<UserSettings | null>(() =>
    normalizeSettings(MOCK_USER_SETTINGS)
  )
  const [tab, setTab] = useState<Tab>("keywords")
  const [input, setInput] = useState("")
  const [previewWords, setPreviewWords] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewWords(parseKeywords(input))
    }, 300)
    return () => clearTimeout(timer)
  }, [input])

  const saveSettings = async (patch: Partial<UserSettings>) => {
    setSaving(true)
    setSettings((current) =>
      current ? normalizeSettings({ ...current, ...patch }) : current
    )
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setSaving(false)
    }, 1500)
  }

  const addKeywords = () => {
    const words = parseKeywords(input)
    if (words.length === 0 || !settings) return
    const toAdd = computeAddableKeywords(
      words,
      settings.hotwords,
      remainingSlots,
      MAX_HOTWORD_LENGTH
    )
    if (toAdd.length === 0) return
    const next = [...settings.hotwords, ...toAdd]
    setSettings({ ...settings, hotwords: next })
    setInput("")
    saveSettings({ hotwords: next })
    inputRef.current?.focus()
  }

  const removeKeyword = (index: number) => {
    if (!settings) return
    const next = settings.hotwords.filter((_, i) => i !== index)
    setSettings({ ...settings, hotwords: next })
    saveSettings({ hotwords: next })
  }

  const togglePreset = (presetId: string) => {
    if (!settings) return
    const current = settings.enabled_hotword_presets || []
    const next = current.includes(presetId)
      ? current.filter((id) => id !== presetId)
      : [...current, presetId]
    setSettings({ ...settings, enabled_hotword_presets: next })
    saveSettings({ enabled_hotword_presets: next })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === "Enter") {
      e.preventDefault()
      addKeywords()
    }
  }

  const remainingSlots = settings
    ? MAX_HOTWORDS_TOTAL - settings.hotwords.length
    : MAX_HOTWORDS_TOTAL

  const addableCount = settings
    ? computeAddableKeywords(
        previewWords,
        settings.hotwords,
        remainingSlots,
        MAX_HOTWORD_LENGTH
      ).length
    : 0

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
          Customization
        </h1>

        {/* Tabs */}
        <Tabs
          className="mb-6 flex w-full"
          items={TABS.map((tabItem) => ({
            id: tabItem.id,
            label: tabItem.label,
          }))}
          value={tab}
          onValueChange={setTab}
        />

        {/* Tab content */}
        {tab === "keywords" && (
          <section className="rounded-xl border border-border bg-card p-5">
            <p className="mb-4 text-sm text-muted-foreground">
              Add keywords to improve recognition accuracy for domain-specific
              terms.
            </p>

            {/* Input */}
            <div className="mb-4 flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter keywords separated by commas..."
                className="flex-1"
              />
              <Button
                onClick={addKeywords}
                disabled={!input.trim() || remainingSlots <= 0}
              >
                Add
              </Button>
            </div>

            {/* Preview */}
            {previewWords.length > 0 && (
              <div className="mb-4">
                {addableCount > 0 && (
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    {addableCount} new keywords will be added
                  </p>
                )}
                {(() => {
                  const filtered = previewWords.filter(
                    (word) => !settings.hotwords.includes(word)
                  )
                  const hasTooLong = filtered.some(
                    (w) => w.length > MAX_HOTWORD_LENGTH
                  )
                  return (
                    <>
                      {hasTooLong && (
                        <p className="mb-1.5 text-xs text-destructive">
                          Some keywords exceed the {MAX_HOTWORD_LENGTH}{" "}
                          character limit.
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {filtered.map((word) => {
                          const isTooLong = word.length > MAX_HOTWORD_LENGTH
                          return (
                            <span
                              key={word}
                              className={`rounded-full border border-dashed px-2.5 py-0.5 text-xs ${
                                isTooLong
                                  ? "border-destructive text-destructive"
                                  : "border-primary/40 text-foreground"
                              }`}
                              title={
                                isTooLong
                                  ? `Exceeds ${MAX_HOTWORD_LENGTH} characters`
                                  : undefined
                              }
                            >
                              {word}
                            </span>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            {/* Count */}
            <p
              className={`mb-3 text-xs font-medium ${remainingSlots <= 0 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {settings.hotwords.length} keywords
              {" · "}
              {remainingSlots} of {MAX_HOTWORDS_TOTAL} remaining
            </p>

            {/* Tags */}
            {settings.hotwords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {settings.hotwords.map((word, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 ${TAG_CLASS_NAME}`}
                  >
                    {word}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      aria-label={`Remove ${word}`}
                      className="ml-0.5 inline-flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full text-secondary-foreground/60 hover:text-destructive"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3 w-3"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No keywords added yet.
              </p>
            )}
          </section>
        )}

        {tab === "presets" && (
          <section className="rounded-xl border border-border bg-card p-5">
            <p className="mb-4 text-sm text-muted-foreground">
              Toggle preset keyword packs to quickly add industry-specific
              terms.
            </p>

            <div className="space-y-3">
              {Object.entries(PRESET_DEFINITIONS).map(([id, preset]) => {
                const enabled = (
                  settings.enabled_hotword_presets || []
                ).includes(id)
                return (
                  <div key={id} className="rounded-lg border border-border p-4">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => togglePreset(id)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                      />
                      <span className="text-sm font-medium text-card-foreground">
                        {preset.label}
                      </span>
                    </label>

                    {enabled && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {preset.keywords.map((kw) => (
                          <span key={kw} className={TAG_CLASS_NAME}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Save indicator */}
            {(saving || saved) && (
              <p
                className={`mt-3 text-xs ${saved ? "text-success" : "text-muted-foreground"}`}
              >
                {saving ? "Saving…" : "Saved"}
              </p>
            )}
          </section>
        )}

        {tab === "rules" && (
          <section className="rounded-xl border border-border bg-card p-5">
            <p className="mb-4 text-sm text-muted-foreground">
              Create custom rules for how Lingo should handle specific phrases
              or contexts.
            </p>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 h-10 w-10"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm font-medium">No rules yet</p>
              <p className="mt-1 text-xs">Custom rules are coming soon.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
