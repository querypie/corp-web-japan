"use client"

import { Bot, CheckCircle2, MessageCircle, Sparkles } from "lucide-react"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { cn } from "@/lib/lingo/utils"

export type AiNoteFeatureVisualType =
  | "summary"
  | "templates"
  | "customPrompt"
  | "liveQuestion"

interface AiNoteFeatureVisualProps {
  type: AiNoteFeatureVisualType
}

const aiNoteVisualCopy = {
  ko: {
    panelTitle: "AI 요약",
    summaryTitle: "AI 요약",
    summarySubtitle: "회의 맥락 기반 생성",
    summaryTags: ["핵심", "결정", "액션"],
    actionFound: "5개 액션 아이템 발견",
    customPromptTitle: "커스텀 프롬프트",
    customPrompt:
      "고객 니즈, 리스크, 담당자별 To-do를 구분해서 정리해줘.",
    generate: "요약 생성",
    askTitle: "Lingo AI에게 질문",
    question: "방금 결정된 다음 액션이 뭐였지?",
    answer: "디자인 리뷰 후 금요일까지 수정안을 공유하기로 했습니다.",
    comingSoon: "Coming soon",
    templates: [
      {
        title: "빠른 요약",
        description: "주요 주제, 핵심 내용, 다음 단계를 간단히 요약",
      },
      {
        title: "데일리 / 위클리 미팅",
        description: "진행 상황, 계획, 이슈와 필요한 지원을 정리",
      },
      {
        title: "고객 미팅",
        description: "요청, 답변, 미해결 항목과 후속 조치를 정리",
      },
      {
        title: "의사결정 미팅",
        description: "결정 배경, 선택지, 트레이드오프와 후속 조치를 정리",
      },
    ],
  },
  en: {
    panelTitle: "AI Summary",
    summaryTitle: "AI Summary",
    summarySubtitle: "Generated from meeting context",
    summaryTags: ["Key", "Decision", "Action"],
    actionFound: "5 action items found",
    customPromptTitle: "Custom prompt",
    customPrompt: "Separate customer needs, risks, and owner-specific to-dos.",
    generate: "Generate summary",
    askTitle: "Ask Lingo AI",
    question: "What was the next action we just decided?",
    answer: "Share the revised draft by Friday after the design review.",
    comingSoon: "Coming soon",
    templates: [
      {
        title: "Quick summary",
        description: "Summarize key topics, main points, and next steps.",
      },
      {
        title: "Daily / weekly meeting",
        description: "Organize progress, plans, issues, and needed support.",
      },
      {
        title: "Customer meeting",
        description: "Organize requests, answers, open items, and follow-ups.",
      },
      {
        title: "Decision meeting",
        description: "Organize context, options, trade-offs, and next steps.",
      },
    ],
  },
  ja: {
    panelTitle: "AI要約",
    summaryTitle: "AI要約",
    summarySubtitle: "会議の文脈から生成",
    summaryTags: ["要点", "決定", "アクション"],
    actionFound: "5件のアクションを検出",
    customPromptTitle: "カスタムプロンプト",
    customPrompt: "顧客ニーズ、リスク、担当者別To-doを分けて整理して。",
    generate: "要約を生成",
    askTitle: "Lingo AIに質問",
    question: "今決まった次のアクションは何でしたか？",
    answer: "デザインレビュー後、金曜日までに修正版を共有します。",
    comingSoon: "Coming soon",
    templates: [
      {
        title: "クイック要約",
        description: "主要トピック、要点、次のステップを簡潔に要約",
      },
      {
        title: "デイリー / ウィークリーミーティング",
        description: "進捗、計画、課題、必要な支援を整理",
      },
      {
        title: "顧客ミーティング",
        description: "要望、回答、未解決項目、フォローアップを整理",
      },
      {
        title: "意思決定ミーティング",
        description: "決定背景、選択肢、トレードオフ、次の対応を整理",
      },
    ],
  },
}

function VisualStage({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-mockup
      className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#ffede2_0%,#fff7ef_30%,#ffffff_52%,#eaf1ff_100%)]"
    >
      <div className="absolute left-[-8%] top-[-18%] h-[58%] w-[36%] rounded-[44%] bg-[#e25a25]/16" />
      <div className="absolute right-[-7%] top-[-10%] h-[54%] w-[38%] rounded-[42%] bg-[#9478c7]/18" />
      <div className="absolute bottom-[-24%] left-[34%] h-[64%] w-[46%] rounded-[45%] bg-[#4a8cff]/10" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.62)_100%)]" />
      <div className="absolute inset-0 origin-center scale-[0.86] md:scale-100">
        {children}
      </div>
    </div>
  )
}

function AiTemplateProductPanel({
  className,
  copy,
}: {
  className?: string
  copy: (typeof aiNoteVisualCopy)["ko"]
}) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.10)]",
        className
      )}
    >
      <div className="flex h-[18%] items-center justify-between border-b border-[#eeeeee] bg-[linear-gradient(90deg,#fff4ee_0%,#fbf9ff_100%)] px-[7%]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#e25a25_0%,#9478c7_100%)] text-white shadow-[0_10px_24px_rgba(226,90,37,0.20)]">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate text-[18px] font-bold text-[#111111]">
            {copy.panelTitle}
          </span>
        </div>
        <span className="text-[22px] leading-none text-[#777777]">×</span>
      </div>
      <div className="flex h-[82%] flex-col justify-center px-[8%] py-[5%]">
        {copy.templates.map((item) => (
          <div
            key={item.title}
            className="border-b border-[#e5e5e5] py-3 last:border-b-0"
          >
            <p className="text-[14px] font-bold text-[#111111]">{item.title}</p>
            <p className="mt-1 text-[11px] leading-[1.35] font-medium text-[#777777]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FloatingCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute rounded-[20px] border border-white/80 bg-white/94 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.08)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  )
}

function SummaryVisual() {
  const copy = getLocaleCopy(useLocale(), aiNoteVisualCopy)

  return (
    <VisualStage>
      <AiTemplateProductPanel
        className="hidden md:block md:right-[8%] md:top-[6%] md:h-[88%] md:w-[43%]"
        copy={copy}
      />
      <FloatingCard className="left-[8%] top-[18%] w-[64%] md:left-[8%] md:top-[17%] md:w-[44%]">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[12px] bg-[var(--brand)] text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13px] font-bold text-[#171717]">
              {copy.summaryTitle}
            </p>
            <p className="text-[11px] font-medium text-[#999999]">
              {copy.summarySubtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="h-2.5 w-full rounded-full bg-black/14" />
          <div className="h-2.5 w-[88%] rounded-full bg-black/10" />
          <div className="h-2.5 w-[62%] rounded-full bg-black/10" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {copy.summaryTags.map((label) => (
            <span
              key={label}
              className="rounded-[10px] bg-[#f7f2ee] px-2 py-1.5 text-center text-[10px] font-semibold text-[#6b625d]"
            >
              {label}
            </span>
          ))}
        </div>
      </FloatingCard>
      <FloatingCard className="bottom-[16%] left-[12%] w-[64%] p-3 md:bottom-[13%] md:left-[15%] md:w-[34%]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-[var(--brand)]" aria-hidden="true" />
          <span className="text-[12px] font-bold text-[#171717]">
            {copy.actionFound}
          </span>
        </div>
      </FloatingCard>
    </VisualStage>
  )
}

function TemplatesVisual() {
  const copy = getLocaleCopy(useLocale(), aiNoteVisualCopy)

  return (
    <VisualStage>
      <AiTemplateProductPanel
        className="left-1/2 top-[5%] h-[90%] w-[60%] -translate-x-1/2 md:w-[52%]"
        copy={copy}
      />
    </VisualStage>
  )
}

function CustomPromptVisual() {
  const copy = getLocaleCopy(useLocale(), aiNoteVisualCopy)

  return (
    <VisualStage>
      <AiTemplateProductPanel
        className="hidden md:block md:right-[9%] md:top-[4%] md:h-[92%] md:w-[43%]"
        copy={copy}
      />
      <FloatingCard className="left-[8%] top-[17%] w-[84%] md:left-[8%] md:top-[18%] md:w-[44%]">
        <p className="mb-3 text-[13px] font-bold text-[#171717]">
          {copy.customPromptTitle}
        </p>
        <div className="rounded-[16px] border-2 border-[var(--brand)]/70 bg-white p-3">
          <p className="text-[13px] leading-[1.45] text-[#777777]">
            {copy.customPrompt}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-full bg-[linear-gradient(90deg,#f4d0be_0%,#e7d8ef_55%,#dcd7f0_100%)] px-4 py-3 text-white">
          <span className="text-[13px] font-bold">{copy.generate}</span>
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
      </FloatingCard>
    </VisualStage>
  )
}

function LiveQuestionVisual() {
  const copy = getLocaleCopy(useLocale(), aiNoteVisualCopy)

  return (
    <VisualStage>
      <AiTemplateProductPanel
        className="hidden md:block md:left-[8%] md:top-[7%] md:h-[86%] md:w-[42%]"
        copy={copy}
      />
      <FloatingCard className="right-[8%] top-[14%] w-[84%] md:right-[8%] md:top-[15%] md:w-[42%]">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[12px] bg-[#111111] text-white">
            <Bot className="size-4" aria-hidden="true" />
          </span>
          <p className="text-[13px] font-bold text-[#171717]">
            {copy.askTitle}
          </p>
        </div>
        <div className="rounded-[16px] bg-[#f5f5f5] p-3">
          <p className="text-[13px] leading-[1.45] text-[#555555]">
            {copy.question}
          </p>
        </div>
        <div className="mt-3 rounded-[16px] border border-[#eeeeee] bg-white p-3">
          <p className="text-[13px] leading-[1.45] text-[#777777]">
            {copy.answer}
          </p>
        </div>
      </FloatingCard>
      <FloatingCard className="bottom-[15%] right-[15%] flex items-center gap-2 p-3 md:bottom-[14%] md:right-[14%]">
        <MessageCircle className="size-4 text-[var(--brand)]" aria-hidden="true" />
        <span className="text-[12px] font-bold text-[#171717]">
          {copy.comingSoon}
        </span>
      </FloatingCard>
    </VisualStage>
  )
}

export function AiNoteFeatureVisual({ type }: AiNoteFeatureVisualProps) {
  if (type === "summary") return <SummaryVisual />
  if (type === "templates") return <TemplatesVisual />
  if (type === "customPrompt") return <CustomPromptVisual />
  return <LiveQuestionVisual />
}
