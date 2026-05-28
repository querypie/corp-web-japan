"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
import { TERMINAL_SESSION_STATES } from "@/components/lingo/mockup/types"
import { TranscriptView } from "@/components/lingo/mockup/TranscriptView"
import { LanguageFilterBar } from "@/components/lingo/mockup/LanguageFilterBar"
import { shouldShowLanguageFilter } from "@/components/lingo/mockup/utils/languageFilter"
import {
  MOCK_SESSIONS,
  MOCK_BLOCKS,
  MOCK_SUMMARIES as SESSION_SUMMARIES,
} from "@/components/lingo/mockup/mockData"
import type { Page } from "@/components/lingo/mockup/types"

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

// ── 목업 요약 텍스트 ─────────────────────────

const TEMPLATE_SUMMARIES: Record<string, string> = {
  "action-items": `## Action Items

- [x] Review Q3 roadmap
- [ ] Walk through payment flow documentation — **John Smith**
- [ ] Finalize design draft — **Kim Min-su**
- [ ] Schedule follow-up for API spec review — **Yuki Tanaka**
- [x] Incorporate last week's feedback`,
  minutes: `## Meeting Minutes

**Date:** Q3 Roadmap Review
**Attendees:** Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka

### Topics Discussed
1. Q3 roadmap review before client call
2. API specification documentation status
3. Payment flow checkout process
4. Security audit results
5. Deployment timeline

### Decisions
- Proceed with current roadmap
- Deploy on Friday evening

### Next Steps
- Follow up on action items in next sync`,
  "key-decisions": `## Key Decisions

1. **Q3 Roadmap Approved**
   The team agreed to proceed with the current Q3 roadmap before the client call.

2. **Friday Deployment**
   Deployment is scheduled for Friday evening. All backend endpoints are documented.

3. **Security Audit Cleared**
   The security audit showed no issues.

4. **Payment Flow Expansion**
   Checkout process now supports three different providers.`,
}

// ── 요약 템플릿 ─────────────────────────────

const SUMMARY_TEMPLATES: Array<{
  id: SummaryTemplateId
  icon: typeof Sparkle
  label: string
  desc: string
  prompt: string
}> = [
  {
    id: "default",
    icon: Sparkle,
    label: "Default",
    desc: "General overview of the meeting",
    prompt: "",
  },
  {
    id: "action-items",
    icon: ListChecks,
    label: "Action Items",
    desc: "Extract tasks and deadlines",
    prompt:
      "Extract all action items from this meeting. List each item with the assignee if mentioned, the task, and any deadline. Format the result as a Markdown checklist.",
  },
  {
    id: "minutes",
    icon: ClipboardText,
    label: "Minutes",
    desc: "Formal meeting minutes",
    prompt:
      "Write formal meeting minutes in Markdown. Include agenda or topics discussed, key discussion notes, decisions, action items, and next steps. Only include attendees if speaker names are present in the transcript.",
  },
  {
    id: "key-decisions",
    icon: Lightning,
    label: "Key Decisions",
    desc: "List important decisions",
    prompt:
      "List the key decisions made in this meeting. For each decision, include the decision, relevant context, and any owner or follow-up if mentioned.",
  },
]

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

// ── 페이지 컴포넌트 ──────────────────────────

export function MeetingDetailPage({
  sessionId,
  onBack,
  onRejoinSession,
}: MeetingDetailPageProps) {
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
  const [summaryEditingPrompt, setSummaryEditingPrompt] = useState(false)
  const { showToast } = useToast()

  const meta =
    SESSION_SUMMARIES[sessionId] ?? SESSION_SUMMARIES["sess-live-001"]

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
    setSummaryEditingPrompt(false)
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
    setSummaryEditingPrompt(false)

    try {
      // 목업: 템플릿에 맞는 정적 요약 반환
      await new Promise((r) => setTimeout(r, 800))
      let text: string
      if (templateId === "default" || templateId === "custom") {
        text = `## Meeting Summary\n\n${meta.summary}\n\n### Key Points\n${meta.keyPoints.map((p) => `- ${p}`).join("\n")}`
      } else {
        text =
          TEMPLATE_SUMMARIES[templateId] ??
          `## Meeting Summary\n\n${meta.summary}\n\n### Key Points\n${meta.keyPoints.map((p) => `- ${p}`).join("\n")}`
      }
      setSummaryText(text)
    } catch {
      setSummaryError("Failed to generate summary")
    } finally {
      setSummaryLoading(false)
    }
  }

  const handleCopySummary = async () => {
    if (!summaryText) return
    try {
      await navigator.clipboard.writeText(summaryText)
      setSummaryCopied(true)
      showToast("Summary copied")
      window.setTimeout(() => setSummaryCopied(false), 2000)
    } catch {
      showToast("Failed to copy summary")
    }
  }

  const handleExport = async (format: string) => {
    if (!session) return
    if (format === "srt") {
      const blob = new Blob(
        ["1\n00:00:12,000 --> 00:00:16,500\nMock SRT content"],
        { type: "text/plain" }
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `session-${session.id}.srt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const blob = new Blob([JSON.stringify(session, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `session-${session.id}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Session not found</p>
        <button
          onClick={onBack}
          className="cursor-pointer text-sm text-primary-soft-foreground hover:underline"
        >
          Back to meetings
        </button>
      </div>
    )
  }

  const showLanguageFilter = shouldShowLanguageFilter(session.target_languages)
  const showSummaryControls =
    !summaryText || summaryEditingPrompt || Boolean(summaryError)
  const activeSummaryTemplate = SUMMARY_TEMPLATES.find(
    (item) => item.id === summaryActiveTemplate
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
                title="Back"
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
                    Join Bot Now
                  </button>
                )}
              {TERMINAL_SESSION_STATES.has(session.session_state) && (
                <button
                  type="button"
                  onClick={openSummaryPanel}
                  className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-primary transition-[background-color,color,transform] active:scale-95 sm:hover:bg-primary/10 sm:active:scale-100"
                  aria-label="AI Summary"
                  title="AI Summary"
                >
                  <Sparkle className="h-4 w-4" weight="fill" />
                  <span className="hidden sm:inline">AI Summary</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                aria-label="Share"
                title="Share"
              >
                <ShareNetwork
                  className={`h-4 w-4 ${session.share ? "text-success" : ""}`}
                  weight="regular"
                />
              </button>
              <DropdownMenu
                className="relative shrink-0"
                menuClassName="absolute right-0 top-9 z-20 w-44 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                    aria-label="More actions"
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
                      <DownloadSimple className="h-4 w-4" weight="regular" />
                      <span>Export JSON</span>
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
                      <span>Delete</span>
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
              No transcript available
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
            aria-label="AI Summary"
            className="flex h-full w-[340px] shrink-0 flex-col overflow-hidden border-l border-border bg-card text-card-foreground sm:w-[390px] lg:w-[430px]"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkle className="h-4 w-4" weight="fill" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">AI Summary</h2>
                  <p className="text-xs text-muted-foreground">
                    Generated by AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {summaryText && !summaryLoading && (
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Copy"
                    title="Copy"
                  >
                    {summaryCopied ? (
                      <Check className="h-4 w-4 text-success" weight="bold" />
                    ) : (
                      <Copy className="h-4 w-4" weight="regular" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowSummaryPanel(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Close"
                  title="Close"
                >
                  <X className="h-4 w-4" weight="regular" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              {showSummaryControls && (
                <div className="border-b border-border px-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    {SUMMARY_TEMPLATES.map(
                      ({ id, icon: Icon, label, desc }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => void handleGenerateSummary(id)}
                          disabled={summaryLoading}
                          className={`flex min-h-[92px] cursor-pointer flex-col gap-2 rounded-xl border p-3 text-left transition-[background-color,border-color,transform] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
                            summaryActiveTemplate === id
                              ? "border-primary/40 bg-primary/5"
                              : "border-border bg-background hover:border-primary/30 hover:bg-accent"
                          }`}
                        >
                          <Icon
                            className="h-4 w-4 text-primary"
                            weight="duotone"
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {label}
                          </span>
                          <span className="text-[11px] leading-snug text-muted-foreground">
                            {desc}
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-4">
                    <label
                      className="text-xs font-medium text-muted-foreground"
                      htmlFor="summary-custom-prompt"
                    >
                      Custom prompt
                    </label>
                    <textarea
                      id="summary-custom-prompt"
                      value={summaryPrompt}
                      onChange={(event) => setSummaryPrompt(event.target.value)}
                      placeholder="Describe what you'd like the AI to focus on..."
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        void handleGenerateSummary("custom", summaryPrompt)
                      }
                      disabled={summaryLoading || !summaryPrompt.trim()}
                      className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-[background-color,opacity,transform] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Sparkle className="h-4 w-4" weight="fill" />
                      Generate
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col px-4 py-4">
                {summaryLoading && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
                    <p className="text-sm text-muted-foreground">
                      Generating summary...
                    </p>
                  </div>
                )}

                {!summaryLoading && summaryError && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
                    {summaryError}
                  </div>
                )}

                {!summaryLoading && !summaryError && !summaryText && (
                  <div className="flex flex-1 items-center justify-center py-10 text-center text-sm text-muted-foreground">
                    Choose a template or enter a custom prompt
                  </div>
                )}

                {!summaryLoading && !summaryError && summaryText && (
                  <>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <Sparkle className="h-3 w-3" weight="fill" />
                        {summaryActiveTemplate === "custom"
                          ? "Custom prompt"
                          : (activeSummaryTemplate?.label ?? "Default")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Generated
                      </span>
                    </div>
                    <SummaryMarkdown content={summaryText} />
                  </>
                )}
              </div>
            </div>

            {summaryText && !summaryLoading && !summaryEditingPrompt && (
              <div className="border-t border-border bg-background/50 px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setSummaryError(null)
                    setSummaryEditingPrompt(true)
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <ArrowsClockwise className="h-4 w-4" weight="regular" />
                  Regenerate
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
        title="Delete meeting?"
        description={`Are you sure you want to delete "${session.name}"?`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
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
