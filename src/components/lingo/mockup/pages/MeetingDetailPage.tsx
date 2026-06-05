"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "@/lib/lingo/intl"
import {
  ArrowsClockwise,
  Check,
  ClipboardText,
  Copy,
  DotsThree,
  DownloadSimple,
  Lightning,
  ListChecks,
  MonitorPlay,
  PencilSimple,
  ShareNetwork,
  Sparkle,
  Trash,
  X,
} from "@phosphor-icons/react"
import { DropdownMenu } from "@/components/lingo/mockup/ui/DropdownMenu"
import { useToast } from "@/components/lingo/mockup/ui/Toast"
import { DeleteConfirmationDialog } from "@/components/lingo/mockup/DeleteConfirmationDialog"
import { ShareModal } from "@/components/lingo/mockup/ShareModal"
import type { Session, SpeechBlock } from "@/components/lingo/mockup/types"
import {
  TERMINAL_SESSION_STATES,
  SUPPORTED_LANGUAGES,
  LANGUAGE_FLAGS,
} from "@/components/lingo/mockup/types"
import { TranscriptView } from "@/components/lingo/mockup/TranscriptView"
import { LanguageFilterBar } from "@/components/lingo/mockup/LanguageFilterBar"
import { shouldShowLanguageFilter } from "@/components/lingo/mockup/utils/languageFilter"
import { MOCK_SESSIONS, MOCK_BLOCKS } from "@/components/lingo/mockup/mockData"
import type { Page } from "@/components/lingo/mockup/types"
import {
  SAMPLE_SUMMARIES,
  type SummaryLanguage,
} from "@/components/lingo/mockup/summarySamples"

// ── 타입 ────────────────────────────────────

interface MeetingDetailPageProps {
  sessionId: string
  onBack: () => void
  onRejoinSession?: (session: Session, autoJoinBot?: boolean) => void
  onNavigate?: (page: Page) => void
}

type SummaryTemplateId =
  | "default"
  | "action-items"
  | "minutes"
  | "key-decisions"

// ── 요약 템플릿 ─────────────────────────────

type SummaryTemplate = {
  id: SummaryTemplateId
  icon: typeof Sparkle
  label: string
  desc: string
  prompt: string
}

const SUMMARY_TEMPLATE_PROMPTS: Record<SummaryTemplateId, string> = {
  default: "",
  "action-items":
    "Extract all action items from this meeting. List each item with the assignee if mentioned, the task, and any deadline. Format the result as a Markdown checklist.",
  minutes:
    "Write formal meeting minutes in Markdown. Include agenda or topics discussed, key discussion notes, decisions, action items, and next steps. Only include attendees if speaker names are present in the transcript.",
  "key-decisions":
    "List the key decisions made in this meeting. For each decision, include the decision, relevant context, and any owner or follow-up if mentioned.",
}

const SUMMARY_TEMPLATE_ICONS: Record<SummaryTemplateId, typeof Sparkle> = {
  default: Sparkle,
  "action-items": ListChecks,
  minutes: ClipboardText,
  "key-decisions": Lightning,
}

// ── 유틸 ────────────────────────────────────

function resolveTranslationEnabled(config?: Session["config"] | null): boolean {
  return config?.translation_enabled !== false
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="rounded bg-muted px-1 py-0.5 text-[0.92em]"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

function SummaryMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-6 text-foreground">
      {content.split(/\r?\n/).map((rawLine, index) => {
        const line = rawLine.trim()
        if (!line) return <div key={index} className="h-1" />

        const heading = line.match(/^(#{1,3})\s+(.+)$/)
        if (heading) {
          return (
            <h4
              key={index}
              className="pt-2 text-sm font-semibold text-foreground"
            >
              <InlineMarkdown text={heading[2]} />
            </h4>
          )
        }

        const checklist = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/)
        if (checklist) {
          const checked = checklist[1].toLowerCase() === "x"
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border text-[10px] text-primary">
                {checked ? <Check className="h-3 w-3" weight="bold" /> : ""}
              </span>
              <span>
                <InlineMarkdown text={checklist[2]} />
              </span>
            </div>
          )
        }

        const unordered = line.match(/^[-*]\s+(.+)$/)
        if (unordered) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span>
                <InlineMarkdown text={unordered[1]} />
              </span>
            </div>
          )
        }

        const ordered = line.match(/^(\d+)\.\s+(.+)$/)
        if (ordered) {
          return (
            <div key={index} className="flex gap-2">
              <span className="w-5 shrink-0 text-right text-muted-foreground">
                {ordered[1]}.
              </span>
              <span>
                <InlineMarkdown text={ordered[2]} />
              </span>
            </div>
          )
        }

        return (
          <p key={index}>
            <InlineMarkdown text={line} />
          </p>
        )
      })}
    </div>
  )
}

// ── 요약 언어 드롭다운 ───────────────────────

const SUMMARY_LANGUAGES = ["ko", "ja", "en", "th", "vi"] as const

function SummaryLanguageDropdown({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const selectedLabel = SUPPORTED_LANGUAGES[value] ?? value
  const selectedFlag = LANGUAGE_FLAGS[value] ?? ""

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-[128px] cursor-pointer items-center justify-between gap-2 rounded-[999px] border border-input bg-background px-3 text-xs font-medium text-foreground transition-[border-color,box-shadow] focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
      >
        <span className="min-w-0 truncate">
          <span className="mr-1.5">{selectedFlag}</span>
          {selectedLabel}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-lg"
        >
          {SUMMARY_LANGUAGES.map((code) => {
            const name = SUPPORTED_LANGUAGES[code] ?? code
            const isSelected = value === code
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(code)
                  setOpen(false)
                }}
                className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${isSelected ? "bg-accent/50 text-accent-foreground" : ""}`}
              >
                <span className="text-base">{LANGUAGE_FLAGS[code] ?? ""}</span>
                <span>{name}</span>
                {isSelected && (
                  <Check
                    className="ml-auto h-4 w-4 shrink-0 text-primary"
                    weight="bold"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── 페이지 컴포넌트 ──────────────────────────

export function MeetingDetailPage({
  sessionId,
  onBack,
  onRejoinSession,
}: MeetingDetailPageProps) {
  const t = useTranslations("mockup.meetings.detail")
  const locale = useLocale()
  const summaryTemplates = useMemo<SummaryTemplate[]>(() => {
    const ids: SummaryTemplateId[] = [
      "default",
      "action-items",
      "minutes",
      "key-decisions",
    ]
    return ids.map((id) => ({
      id,
      icon: SUMMARY_TEMPLATE_ICONS[id],
      label: t(`summary.templates.${id}.label`),
      desc: t(`summary.templates.${id}.desc`),
      prompt: SUMMARY_TEMPLATE_PROMPTS[id],
    }))
  }, [t])
  const joiningRef = useRef(false)
  const [session, setSession] = useState<Session | null>(null)
  const [blocks, setBlocks] = useState<SpeechBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [filterLanguage, setFilterLanguage] = useState<string>("")
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSummaryPanel, setShowSummaryPanel] = useState(false)
  const [summaryText, setSummaryText] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryPrompt, setSummaryPrompt] = useState("")
  const [summaryCopied, setSummaryCopied] = useState(false)
  const [summaryActiveTemplate, setSummaryActiveTemplate] = useState<
    string | null
  >(null)
  const [selectedSummaryType, setSelectedSummaryType] = useState<
    SummaryTemplateId | "custom" | null
  >(null)
  const [customPromptOpen, setCustomPromptOpen] = useState(false)
  const [showRegenerateForm, setShowRegenerateForm] = useState(false)
  const [summaryLanguage, setSummaryLanguage] = useState<string>(locale)
  const { showToast } = useToast()

  // 목업 데이터 로딩
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const found =
        MOCK_SESSIONS.find((s) => s.id === sessionId) ?? MOCK_SESSIONS[0]
      setSession(found)
      setBlocks(MOCK_BLOCKS.filter((b) => b.session_id === found.id))
      setLoading(false)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [sessionId])

  const loadOlderBlocks = useCallback(async () => {
    // 목업에서는 이전 블록 로딩을 시뮬레이션만 함
    if (loadingOlder) return
    setLoadingOlder(true)
    await new Promise((r) => setTimeout(r, 500))
    setLoadingOlder(false)
  }, [loadingOlder])

  const handleDeleteClick = () => {
    // 목업에서는 반복 일정 확인 없이 바로 삭제 확인
    setShowDeleteConfirm(true)
  }

  const openSummaryPanel = () => {
    setShowSummaryPanel(true)
    setSummaryText(null)
    setSummaryError(null)
    setSummaryCopied(false)
    setSummaryActiveTemplate(null)
    setSelectedSummaryType(null)
    setCustomPromptOpen(false)
    setShowRegenerateForm(false)
    setSummaryPrompt("")
    setSummaryLanguage(locale)
  }

  const handleGenerateSummary = async (
    templateId: SummaryTemplateId | "custom",
    customPrompt?: string
  ) => {
    void customPrompt
    setSummaryLoading(true)
    setSummaryError(null)
    setSummaryText(null)
    setSummaryCopied(false)
    setSummaryActiveTemplate(templateId)
    setShowRegenerateForm(false)

    try {
      // 목업: 선택한 요약 언어에 맞는 정적 요약 반환
      await new Promise((r) => setTimeout(r, 800))
      const lang: SummaryLanguage = (
        summaryLanguage in SAMPLE_SUMMARIES ? summaryLanguage : "en"
      ) as SummaryLanguage
      const sampleTemplate = templateId === "custom" ? "default" : templateId
      setSummaryText(SAMPLE_SUMMARIES[lang][sampleTemplate])
    } catch {
      setSummaryError(t("summary.error"))
    } finally {
      setSummaryLoading(false)
    }
  }

  const handleSelectSummaryType = (type: SummaryTemplateId | "custom") => {
    setSelectedSummaryType(type)
    setCustomPromptOpen(type === "custom")
    if (type !== "custom") setSummaryPrompt("")
  }

  const handleGenerateSelected = () => {
    if (!selectedSummaryType) return
    if (selectedSummaryType === "custom") {
      const prompt = summaryPrompt.trim()
      if (!prompt) return
      void handleGenerateSummary("custom", prompt)
      return
    }
    void handleGenerateSummary(selectedSummaryType)
  }

  const canGenerateSummary =
    selectedSummaryType === "custom"
      ? Boolean(summaryPrompt.trim())
      : selectedSummaryType !== null

  const handleCopySummary = async () => {
    if (!summaryText) return
    try {
      await navigator.clipboard.writeText(summaryText)
      setSummaryCopied(true)
      showToast(t("summary.copied"))
      window.setTimeout(() => setSummaryCopied(false), 2000)
    } catch {
      showToast(t("summary.copyFailed"))
    }
  }

  const handleExport = async (format: string) => {
    // 데모 목업: 실제 파일을 내려받지 않는다.
    void format
  }

  const handleDelete = async () => {
    // 목업: 삭제 후 뒤로 가기
    onBack()
  }

  const handleCreateShare = async () => {
    const share = {
      share_token: "share-" + Math.random().toString(36).slice(2, 10),
      created_at: new Date().toISOString(),
      share_expires_at: null as string | null,
      requires_password: false,
      generated_password: null as string | null,
    }
    setSession((prev) => (prev ? { ...prev, share } : prev))
    return share
  }

  const handleUpdateShare = async (settings: {
    expires_at?: string | null
    password?: string | null
  }) => {
    const share = {
      share_token: session?.share?.share_token ?? "share-mock",
      created_at: session?.share?.created_at ?? new Date().toISOString(),
      share_expires_at: settings.expires_at ?? null,
      requires_password:
        settings.password !== null && settings.password !== undefined,
      generated_password: settings.password ?? null,
    }
    setSession((prev) => (prev ? { ...prev, share } : prev))
    return share
  }

  const handleUnshare = async () => {
    setSession((prev) => (prev ? { ...prev, share: null } : prev))
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("notFound.title")}</p>
        <button
          onClick={onBack}
          className="cursor-pointer text-sm text-primary-soft-foreground hover:underline"
        >
          {t("notFound.backLink")}
        </button>
      </div>
    )
  }

  const showLanguageFilter = shouldShowLanguageFilter(session.target_languages)
  const activeSummaryTemplate = summaryTemplates.find(
    (item) => item.id === summaryActiveTemplate
  )

  const summarySelectionForm = (
    <div className="flex flex-1 flex-col py-5">
      <div className="flex flex-col px-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="min-w-0 text-[15px] text-muted-foreground">
            {t("summary.guide")}
          </p>
          <SummaryLanguageDropdown
            label={t("summary.language")}
            value={summaryLanguage}
            onChange={setSummaryLanguage}
          />
        </div>
        {summaryError && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
            {summaryError}
          </div>
        )}
        {summaryTemplates.map(({ id, label, desc }, idx) => (
          <div key={id}>
            <button
              type="button"
              onClick={() => handleSelectSummaryType(id)}
              className="group w-full cursor-pointer py-4 text-left transition-all"
            >
              <p
                className={`text-[15px] font-semibold transition-colors group-hover:text-[var(--brand)] ${selectedSummaryType === id ? "text-[var(--brand)]" : "text-foreground"}`}
              >
                {label}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">{desc}</p>
            </button>
            {idx < summaryTemplates.length - 1 && (
              <div className="h-px bg-border" />
            )}
          </div>
        ))}
        <div className="h-px bg-border" />
        <button
          type="button"
          onClick={() => handleSelectSummaryType("custom")}
          className="group w-full cursor-pointer py-4 text-left transition-all"
        >
          <p
            className={`text-[15px] font-semibold transition-colors group-hover:text-[var(--brand)] ${selectedSummaryType === "custom" ? "text-[var(--brand)]" : "text-foreground"}`}
          >
            {t("summary.customPrompt.label")}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {t("summary.customPrompt.desc")}
          </p>
        </button>
      </div>

      <div className="mt-auto px-5 pt-6 pb-4">
        {customPromptOpen && (
          <div
            className="flex rounded-[10px] p-[2px]"
            style={{
              background:
                "linear-gradient(135deg, var(--brand), var(--purple))",
              boxShadow:
                "0 4px 16px -2px color-mix(in srgb, var(--brand) 30%, transparent), 0 2px 8px -1px color-mix(in srgb, var(--purple) 25%, transparent)",
            }}
          >
            <textarea
              id="summary-custom-prompt"
              aria-label={t("summary.customPrompt.label")}
              value={summaryPrompt}
              onChange={(e) => setSummaryPrompt(e.target.value)}
              placeholder={t("summary.customPrompt.placeholder")}
              rows={5}
              className="block w-full resize-none rounded-[8px] bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>
        )}
        <button
          type="button"
          onClick={handleGenerateSelected}
          disabled={!canGenerateSummary}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] px-4 py-3 text-[15px] font-medium text-white transition-[transform,opacity] duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, var(--brand), var(--purple))",
            boxShadow: "0 6px 16px color-mix(in srgb, var(--brand) 35%, transparent)",
          }}
        >
          <Sparkle className="h-4 w-4" weight="fill" />
          {t("summary.generate")}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-2.5 sm:px-5">
        <div className="w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                onClick={onBack}
                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                title={t("header.back")}
                aria-label={t("header.back")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="min-w-0 flex-1 overflow-hidden">
                {editing ? (
                  <input
                    autoFocus
                    maxLength={200}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => {
                      const trimmed = editName.trim()
                      if (trimmed && trimmed !== session.name) {
                        setSession({ ...session, name: trimmed })
                      }
                      setEditing(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        (e.target as HTMLInputElement).blur()
                      if (e.key === "Escape") {
                        setEditing(false)
                        setEditName(session.name)
                      }
                    }}
                    className="w-full rounded border border-primary-soft-border bg-background px-2 py-1 text-lg font-semibold text-foreground outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(session.name)
                      setEditing(true)
                    }}
                    className="group/title flex max-w-full min-w-0 cursor-pointer items-center gap-1.5"
                  >
                    <h1 className="truncate text-lg font-semibold text-foreground">
                      {session.name}
                    </h1>
                    <PencilSimple
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      weight="regular"
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-nowrap items-center gap-2">
              {session.session_state === "scheduled" &&
                session.meeting_type === "remote" &&
                !session.meeting_bot_id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (joiningRef.current) return
                      joiningRef.current = true
                      onRejoinSession?.(session, true)
                    }}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-purple px-3 py-1.5 text-sm font-medium text-white transition-[background-color,transform] active:scale-95 sm:hover:bg-purple/90 sm:active:scale-100"
                  >
                    <MonitorPlay className="h-4 w-4" weight="fill" />
                    {t("header.joinBotNow")}
                  </button>
                )}
              {TERMINAL_SESSION_STATES.has(session.session_state) && (
                <button
                  type="button"
                  onClick={openSummaryPanel}
                  className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-primary transition-[background-color,color,transform] active:scale-95 sm:hover:bg-primary/10 sm:active:scale-100"
                  aria-label={t("summary.heading")}
                  title={t("summary.heading")}
                >
                  <Sparkle className="h-4 w-4" weight="fill" />
                  <span className="hidden sm:inline">
                    {t("summary.heading")}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                aria-label={t("header.share")}
                title={t("header.share")}
              >
                <ShareNetwork
                  className={`h-4 w-4 ${session.share ? "text-success" : ""}`}
                  weight="regular"
                />
              </button>
              <DropdownMenu
                className="relative shrink-0"
                menuClassName="absolute right-0 top-9 z-20 w-max min-w-44 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                    aria-label={t("header.moreActions")}
                  >
                    <DotsThree className="h-4 w-4" weight="bold" />
                  </button>
                )}
              >
                {({ close }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        void handleExport("json")
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                    >
                      <DownloadSimple
                        className="h-4 w-4 shrink-0"
                        weight="regular"
                      />
                      <span className="whitespace-nowrap">
                        {t("actions.downloadTranscript")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        handleDeleteClick()
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-destructive/10 sm:active:scale-100"
                    >
                      <Trash className="h-4 w-4" weight="regular" />
                      <span>{t("actions.delete")}</span>
                    </button>
                  </>
                )}
              </DropdownMenu>
            </div>
          </div>

          {/* Language filter */}
          <div className="mt-2.5 flex min-h-[30px] flex-wrap items-center gap-3">
            {showLanguageFilter && (
              <LanguageFilterBar
                languages={session.target_languages}
                selected={filterLanguage}
                onSelect={setFilterLanguage}
              />
            )}
            <span className="hidden text-xs text-muted-foreground sm:ml-auto sm:inline">
              {new Date(session.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Transcript + AI summary sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {blocks.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              {t("transcript.empty")}
            </p>
          ) : (
            <TranscriptView
              blocks={blocks}
              partialBlocks={undefined}
              filterLanguage={filterLanguage || undefined}
              targetLanguages={session.target_languages}
              hasMoreAbove={false}
              loadingAbove={loadingOlder}
              onReachTop={loadOlderBlocks}
              isActive={false}
              transcriptOnly={!resolveTranslationEnabled(session.config)}
            />
          )}
        </div>

        {showSummaryPanel && (
          <aside
            aria-label={t("summary.heading")}
            className="flex h-full w-full shrink-0 flex-col overflow-hidden border-l border-border bg-card text-card-foreground sm:w-[400px] lg:w-[440px]"
          >
            {/* Gradient header */}
            <div
              className="flex shrink-0 items-center justify-between gap-3 px-5 py-4"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--brand) 8%, transparent), color-mix(in srgb, var(--purple) 6%, transparent))",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand), var(--purple))",
                    boxShadow:
                      "0 4px 10px color-mix(in srgb, var(--brand) 35%, transparent)",
                  }}
                >
                  <Sparkle className="h-4 w-4 text-white" weight="fill" />
                </div>
                <h3 className="truncate text-sm font-semibold tracking-[-0.2px] text-foreground">
                  {t("summary.heading")}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {summaryText && !summaryLoading && (
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={t("summary.copy")}
                    title={t("summary.copy")}
                  >
                    {summaryCopied ? (
                      <Check className="h-3.5 w-3.5 text-success" weight="bold" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" weight="regular" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowSummaryPanel(false)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={t("summary.close")}
                  title={t("summary.close")}
                >
                  <X className="h-3.5 w-3.5" weight="regular" />
                </button>
              </div>
            </div>

            <div className="relative flex flex-1 flex-col overflow-y-auto">
              {summaryCopied && (
                <div className="pointer-events-none absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-card px-4 py-2 text-sm text-card-foreground shadow-lg ring-1 ring-border">
                  {t("summary.copied")}
                </div>
              )}

              {!summaryText && !summaryLoading && !showRegenerateForm &&
                summarySelectionForm}

              {summaryLoading && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
                  <div
                    className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
                    style={{
                      borderColor: "var(--purple)",
                      borderTopColor: "transparent",
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {t("summary.loading")}
                  </span>
                </div>
              )}

              {summaryText && !summaryLoading && !showRegenerateForm && (
                <div className="flex-1 px-5 py-5">
                  {summaryActiveTemplate && (
                    <div className="mb-4 flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-[999px] px-3 py-1 text-[11px] font-medium text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand), var(--purple))",
                        }}
                      >
                        <Sparkle className="h-3 w-3" weight="fill" />
                        {summaryActiveTemplate === "custom"
                          ? t("summary.customPrompt.label")
                          : (activeSummaryTemplate?.label ??
                            t("summary.templates.default.label"))}
                      </span>
                    </div>
                  )}
                  <SummaryMarkdown content={summaryText} />
                </div>
              )}

              {showRegenerateForm && !summaryLoading && (
                <div className="flex flex-1 flex-col">
                  {summarySelectionForm}
                  <button
                    type="button"
                    onClick={() => setShowRegenerateForm(false)}
                    className="mx-5 mb-1 w-[calc(100%-2.5rem)] cursor-pointer text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("summary.cancel")}
                  </button>
                </div>
              )}
            </div>

            {summaryText && !summaryLoading && !showRegenerateForm && (
              <div className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setSummaryPrompt("")
                    setCustomPromptOpen(false)
                    setSelectedSummaryType(null)
                    setSummaryError(null)
                    setShowRegenerateForm(true)
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] border px-4 py-2.5 text-sm font-medium transition-[transform,colors] duration-200 hover:bg-[color-mix(in_srgb,var(--brand)_5%,transparent)] active:scale-[0.97]"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--brand) 40%, transparent)",
                    color: "var(--brand)",
                  }}
                >
                  <ArrowsClockwise className="h-4 w-4" weight="regular" />
                  {t("summary.back")}
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await handleDelete()
        }}
        title={t("deleteDialog.title")}
        description={t("deleteDialog.description", { name: session.name })}
        confirmButtonText={t("deleteDialog.confirm")}
        cancelButtonText={t("deleteDialog.cancel")}
      />

      <ShareModal
        open={showShareModal}
        share={session.share}
        shareToken={session.share?.share_token ?? null}
        onClose={() => setShowShareModal(false)}
        onCreateShare={handleCreateShare}
        onUpdateShare={handleUpdateShare}
        onUnshare={handleUnshare}
      />
    </div>
  )
}
