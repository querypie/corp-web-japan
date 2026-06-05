"use client"

import { Bot, Check, Copy, Globe2, Link2, Mic, Video } from "lucide-react"
import { useLocale } from "@/lib/lingo/intl"
import { QRCodeSVG } from "qrcode.react"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { cn } from "@/lib/lingo/utils"

export type TranslationFeatureVisualType =
  | "languages"
  | "fast"
  | "remote"
  | "share"

interface TranslationFeatureVisualProps {
  type: TranslationFeatureVisualType
}

const translationVisualCopy = {
  ko: {
    all: "전체",
    globalTitle: "글로벌 제품 회의",
    liveBadge: "Live",
    liveTranslationTitle: "실시간 번역",
    languageChips: [
      { flag: "🇰🇷", label: "한국어" },
      { flag: "🇺🇸", label: "English" },
      { flag: "🇯🇵", label: "日本語" },
    ],
    justNow: "방금",
    liveInput: "실시간 입력 중",
    originalDetect: "원문 감지",
    corrected: "문맥 보정 완료",
    sourceText: "The timeline is still changing, but we can share the current direction...",
    correctedText: "일정은 아직 조정 중이지만, 현재 방향은 공유할 수 있습니다.",
    quickLabels: ["빠른 초안", "문맥 반영", "읽기 좋게 정리"],
    inviteTitle: "Invite Lingo",
    meetingLink: "회의 링크",
    interpretationLanguages: "통역 언어",
    inviteButton: "통역사로 초대",
    shareTitle: "Share publicly",
    shareLinkTitle: "Public sharing link",
    shareDescription: "링크가 있는 사람은 로그인 없이 볼 수 있습니다.",
    copyLink: "Copy Link",
    transcriptRows: [
      {
        speaker: "A",
        color: "bg-orange-400",
        name: "Alice Chen",
        source: "Can we review the launch checklist before Friday?",
        translation: "금요일 전에 출시 체크리스트를 검토할 수 있을까요?",
      },
      {
        speaker: "Y",
        color: "bg-blue-400",
        name: "Yuki Tanaka",
        source: "はい。日本チームの確認事項もまとめておきます。",
        translation: "네. 일본 팀의 확인 사항도 정리해 두겠습니다.",
      },
    ],
  },
  en: {
    all: "All",
    globalTitle: "Global Product Sync",
    liveBadge: "Live",
    liveTranslationTitle: "Live Translation",
    languageChips: [
      { flag: "🇰🇷", label: "Korean" },
      { flag: "🇺🇸", label: "English" },
      { flag: "🇯🇵", label: "Japanese" },
    ],
    justNow: "just now",
    liveInput: "Listening in real time",
    originalDetect: "Source detected",
    corrected: "Context refined",
    sourceText: "The timeline is still changing, but we can share the current direction...",
    correctedText: "The timeline is still changing, but we can share the current direction.",
    quickLabels: ["Fast draft", "Context-aware", "Easy to read"],
    inviteTitle: "Invite Lingo",
    meetingLink: "Meeting link",
    interpretationLanguages: "Interpretation languages",
    inviteButton: "Invite interpreter",
    shareTitle: "Share publicly",
    shareLinkTitle: "Public sharing link",
    shareDescription: "Anyone with the link can view without login.",
    copyLink: "Copy Link",
    transcriptRows: [
      {
        speaker: "A",
        color: "bg-orange-400",
        name: "Alice Chen",
        source: "Can we review the launch checklist before Friday?",
        translation: "Can we review the launch checklist before Friday?",
      },
      {
        speaker: "Y",
        color: "bg-blue-400",
        name: "Yuki Tanaka",
        source: "はい。日本チームの確認事項もまとめておきます。",
        translation: "Yes. I will also organize the Japanese team's checklist.",
      },
    ],
  },
  ja: {
    all: "すべて",
    globalTitle: "グローバル製品会議",
    liveBadge: "Live",
    liveTranslationTitle: "リアルタイム翻訳",
    languageChips: [
      { flag: "🇰🇷", label: "韓国語" },
      { flag: "🇺🇸", label: "English" },
      { flag: "🇯🇵", label: "日本語" },
    ],
    justNow: "たった今",
    liveInput: "リアルタイム入力中",
    originalDetect: "原文を検出",
    corrected: "文脈補正完了",
    sourceText: "The timeline is still changing, but we can share the current direction...",
    correctedText: "スケジュールはまだ調整中ですが、現在の方向性は共有できます。",
    quickLabels: ["高速ドラフト", "文脈反映", "読みやすく整理"],
    inviteTitle: "Lingoを招待",
    meetingLink: "会議リンク",
    interpretationLanguages: "通訳言語",
    inviteButton: "通訳者として招待",
    shareTitle: "公開共有",
    shareLinkTitle: "公開共有リンク",
    shareDescription: "リンクを知っている人はログインなしで閲覧できます。",
    copyLink: "リンクをコピー",
    transcriptRows: [
      {
        speaker: "A",
        color: "bg-orange-400",
        name: "Alice Chen",
        source: "Can we review the launch checklist before Friday?",
        translation: "金曜日までにローンチチェックリストを確認できますか？",
      },
      {
        speaker: "Y",
        color: "bg-blue-400",
        name: "Yuki Tanaka",
        source: "はい。日本チームの確認事項もまとめておきます。",
        translation: "はい。日本チームの確認事項もまとめておきます。",
      },
    ],
  },
}

type VisualStageTone = "blue" | "lavender"

function VisualStage({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: VisualStageTone
}) {
  return (
    <div
      data-mockup
      className={cn(
        "relative h-full w-full overflow-hidden",
        tone === "blue" ? "bg-[#EEF5FD]" : "bg-[#F1E9F8]"
      )}
    >
      <div className="absolute inset-0 origin-top-left scale-[0.8] md:scale-100">
        {children}
      </div>
    </div>
  )
}

function ProductPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute rounded-[22px] border border-[#e8e8e8] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      {children}
    </div>
  )
}

function PanelHeader({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#eeeeee] px-5 py-4">
      <div className="flex min-w-0 items-center gap-2">
        <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#e25a25] text-[13px] font-bold text-white">
          L
        </div>
        <p className="truncate text-[15px] font-semibold leading-none text-[#171717]">
          {title}
        </p>
      </div>
      {action}
    </div>
  )
}

function LanguageFilters({ copy }: { copy: (typeof translationVisualCopy)["ko"] }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-5 py-3">
      <span className="rounded-full border border-[#dddddd] bg-[#f7f7f7] px-3 py-1 text-[11px] font-medium text-[#333333]">
        {copy.all}
      </span>
      {copy.languageChips.map((language) => (
        <span
          key={language.label}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium",
            "border-[#e25a25]/25 bg-[#e25a25]/10 text-[#c94d1e]"
          )}
        >
          <span aria-hidden="true">{language.flag}</span>
          <span>{language.label}</span>
        </span>
      ))}
    </div>
  )
}

function TranscriptCard({
  row,
  justNow,
}: {
  row: (typeof translationVisualCopy)["ko"]["transcriptRows"][number]
  justNow: string
}) {
  return (
    <div className="rounded-2xl px-3 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "grid size-5 place-items-center rounded-full text-[10px] font-bold text-white",
            row.color
          )}
        >
          {row.speaker}
        </span>
        <span className="text-[12px] font-semibold text-[#333333]">
          {row.name}
        </span>
        <span className="text-[11px] text-[#999999]">{justNow}</span>
      </div>
      <p className="mb-2 text-[13px] leading-[1.35] text-[#777777]">
        {row.source}
      </p>
      <p className="border-l-2 border-[#e25a25] pl-3 text-[15px] leading-[1.4] text-[#171717]">
        {row.translation}
      </p>
    </div>
  )
}

function LanguagesVisual() {
  const copy = getLocaleCopy(useLocale(), translationVisualCopy)

  return (
    <VisualStage tone="blue">
      <ProductPanel className="left-[60px] top-[40px] h-[125%] w-[125%] overflow-hidden md:left-[9%] md:top-[60px] md:h-full md:w-[82%]">
        <PanelHeader
          title={copy.globalTitle}
          action={
            <span className="rounded-full bg-[#111111] px-2.5 py-1 text-[11px] font-medium text-white">
              {copy.liveBadge}
            </span>
          }
        />
        <LanguageFilters copy={copy} />
        <div className="grid gap-2 px-5 pb-5">
          {copy.transcriptRows.map((row) => (
            <TranscriptCard key={row.name} row={row} justNow={copy.justNow} />
          ))}
          <div className="rounded-2xl border border-dashed border-[#dddddd] px-3 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#999999]">
              <Mic className="size-3.5" />
              {copy.liveInput}
            </div>
            <div className="h-2 w-[72%] rounded-full bg-[#e25a25]/20" />
          </div>
        </div>
      </ProductPanel>
    </VisualStage>
  )
}

function FastVisual() {
  const copy = getLocaleCopy(useLocale(), translationVisualCopy)

  return (
    <VisualStage tone="lavender">
      <ProductPanel className="left-[60px] top-[40px] h-[125%] w-[125%] overflow-hidden md:left-[11%] md:top-[60px] md:h-full md:w-[78%]">
        <PanelHeader
          title={copy.liveTranslationTitle}
          action={
            <div className="flex items-center gap-1 rounded-full bg-[#e25a25]/10 px-2.5 py-1 text-[11px] font-semibold text-[#c94d1e]">
              <span className="size-1.5 rounded-full bg-[#e25a25]" />
              0.8s
            </div>
          }
        />
        <div className="grid gap-2.5 p-5">
          <div className="rounded-2xl border border-[#eeeeee] bg-[#fbfbfb] p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#777777]">
                {copy.originalDetect}
              </span>
              <div className="flex gap-1">
                {[18, 30, 22, 36, 24, 40, 20].map((height, index) => (
                  <span
                    key={index}
                    className="w-1 rounded-full bg-[#e25a25]/55"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[13px] leading-[1.4] text-[#777777]">
              {copy.sourceText}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eeeeee] bg-white p-3.5">
            <div className="mb-3 flex items-center gap-2">
              <Check className="size-4 text-[#e25a25]" />
              <span className="text-[12px] font-semibold text-[#c94d1e]">
                {copy.corrected}
              </span>
            </div>
            <p className="text-[16px] leading-[1.38] text-[#171717]">
              {copy.correctedText}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {copy.quickLabels.map((label) => (
              <div
                key={label}
                className="rounded-xl bg-[#f5f5f5] px-3 py-2 text-center text-[11px] font-medium text-[#555555]"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </ProductPanel>
    </VisualStage>
  )
}

function RemoteVisual() {
  const copy = getLocaleCopy(useLocale(), translationVisualCopy)

  return (
    <VisualStage tone="blue">
      <div className="absolute left-[24px] top-[40px] grid h-[52%] w-[38%] grid-cols-2 gap-2 md:left-[8%] md:top-[17%]">
        {["A", "Y", "K", "L"].map((name, index) => (
          <div
            key={name}
            className="grid place-items-center rounded-2xl bg-[#171717] text-[18px] font-bold text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
          >
            <span
              className={cn(
                "grid size-10 place-items-center rounded-full",
                index === 0 && "bg-orange-400",
                index === 1 && "bg-blue-400",
                index === 2 && "bg-emerald-400",
                index === 3 && "bg-purple-400"
              )}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
      <ProductPanel className="left-[80px] top-[40px] h-[125%] w-[95%] overflow-hidden md:left-auto md:right-[9%] md:top-[9%] md:h-[82%] md:w-[45%]">
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-[#e25a25]/10 text-[#e25a25]">
              <Bot className="size-4" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#171717]">
                {copy.inviteTitle}
              </p>
              <p className="text-[11px] text-[#999999]">
                Zoom · Google Meet · Teams
              </p>
            </div>
          </div>
          <label className="mb-1 block text-[11px] font-semibold text-[#555555]">
            {copy.meetingLink}
          </label>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#dddddd] px-3 py-2.5 text-[12px] text-[#777777]">
            <Video className="size-4 text-[#e25a25]" />
            meet.google.com/abc-defg-hij
          </div>
          <label className="mb-2 block text-[11px] font-semibold text-[#555555]">
            {copy.interpretationLanguages}
          </label>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {copy.languageChips.map((language) => (
              <span
                key={language.label}
                className="inline-flex items-center gap-1 rounded-full border border-[#e25a25]/20 bg-[#e25a25]/10 px-2.5 py-1 text-[11px] font-medium text-[#c94d1e]"
              >
                <span aria-hidden="true">{language.flag}</span>
                <span>{language.label}</span>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#171717] text-[13px] font-semibold text-white"
          >
            <Bot className="size-4" />
            {copy.inviteButton}
          </button>
        </div>
      </ProductPanel>
    </VisualStage>
  )
}

function ShareVisual() {
  const copy = getLocaleCopy(useLocale(), translationVisualCopy)

  return (
    <VisualStage tone="lavender">
      <div className="absolute bottom-[9%] left-1/2 h-10 w-[38%] -translate-x-1/2 rounded-full bg-[#171717]/10 blur-xl" />
      <ProductPanel className="left-[62.5%] top-[40px] h-[125%] w-[47%] min-w-[272px] -translate-x-1/2 overflow-hidden border-0 shadow-[0_30px_80px_rgba(47,47,47,0.18),0_0_0_1px_rgba(255,255,255,0.78)] md:left-1/2 md:top-[6%] md:h-[86%]">
        <div className="flex h-full flex-col bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[19px] font-bold leading-none text-[#111111]">
              {copy.shareTitle}
            </h4>
            <span className="text-[22px] leading-none text-[#777777]">×</span>
          </div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Globe2 className="size-7 shrink-0 text-[#777777]" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-[#111111]">
                  {copy.shareLinkTitle}
                </p>
                <p className="truncate text-[11px] text-[#777777]">
                  {copy.shareDescription}
                </p>
              </div>
            </div>
            <div className="h-8 w-[58px] shrink-0 rounded-full bg-[#df7424] p-1">
              <div className="ml-auto size-6 rounded-full bg-white" />
            </div>
          </div>
          <div className="relative mx-auto grid aspect-square w-[55%] min-w-[140px] place-items-center">
            <QRCodeSVG
              value="https://lingo.demo/shared/global-sync"
              size={210}
              level="H"
              includeMargin
              className="h-full w-full"
            />
            <div className="absolute grid size-[24%] place-items-center rounded-full bg-white">
              <div className="relative h-[58%] w-[72%]">
                <span className="absolute left-0 top-[15%] h-[70%] w-[58%] rounded-[50%] bg-[#d9743a]" />
                <span className="absolute right-0 top-[10%] h-[76%] w-[58%] rounded-[50%] bg-[#9478c7]" />
                <span className="absolute left-[34%] top-[15%] h-[70%] w-[30%] rounded-full bg-[#7b352d]" />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mt-auto flex h-9 items-center justify-center gap-2 rounded-xl bg-[#f5f5f5] text-[13px] font-bold text-[#333333]"
          >
            <Copy className="size-4" />
            {copy.copyLink}
          </button>
        </div>
      </ProductPanel>
    </VisualStage>
  )
}

export function TranslationFeatureVisual({
  type,
}: TranslationFeatureVisualProps) {
  if (type === "languages") return <LanguagesVisual />
  if (type === "fast") return <FastVisual />
  if (type === "remote") return <RemoteVisual />
  return <ShareVisual />
}
