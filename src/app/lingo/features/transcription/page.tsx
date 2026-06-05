"use client"

import { useState } from "react"
import { useLocale } from "@/lib/lingo/intl"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/lingo/common/Button"
import { Container } from "@/components/layout/lingo/Container"
import { Footer } from "@/components/layout/lingo/Footer"
import {
  TranscriptionFeatureVisual,
  type TranscriptionFeatureVisualType,
} from "@/components/sections/lingo/TranscriptionFeatureVisuals"
import { SubPageHeroBackground } from "@/components/sections/lingo/SubPageHeroBackground"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { cn } from "@/lib/lingo/utils"

type TranscriptionFeatureCard = {
  title: string
  description: string
  visualType: TranscriptionFeatureVisualType
}

const transcriptionCopy = {
  ko: {
    heroTitle: ["모든 말을,", "실시간으로 정확하게", "기록하세요."],
    heroDescription: [
      "Lingo는 여러 언어가 섞인 회의의 대화를 실시간으로 전사합니다.",
      "긴 대화, 여러 화자, 전문 용어가 섞인 회의에서도 문맥을 유지하며 검토하기 쉬운 기록을 남깁니다.",
    ],
    primaryCta: "Lingo 시작하기",
    secondaryCta: "다국어 전사 보기",
    nextTitle: "기록에서 끝나지 않습니다. 회의를 더 가치 있게 이어갑니다.",
    nextDescription: "전사된 회의는 요약과 업무 연결로 확장됩니다.",
    faqTitle: "자주 묻는 질문",
    ctaTitle: "다음 회의를 실시간으로 기록해보세요.",
    ctaDescription:
      "여러 언어가 섞인 회의에서도, Lingo는 회의가 진행되는 순간부터 말과 맥락을 함께 남깁니다.",
    featureCards: [
      {
        title: "화자 분리",
        description: "누가 어떤 말을 했는지 자동으로 구분합니다. 여러 사람이 오가는 회의에서도 발화 흐름을 빠르게 확인할 수 있습니다.",
        visualType: "speaker",
      },
      {
        title: "정확도 우선 음성 감지",
        description: "말의 멈춤과 이어짐을 지능적으로 판단해 문장이 중간에 끊기는 문제를 줄입니다.",
        visualType: "voice",
      },
      {
        title: "전문 용어 인식 강화",
        description: "AI, 법률, 제품 개발처럼 전문 용어가 많은 회의에서도 더 안정적인 기록을 남길 수 있도록 도메인 용어를 반영합니다.",
        visualType: "terms",
      },
      {
        title: "다국어 전사",
        description: "이중언어 회의는 물론, 한국어·영어·일본어처럼 여러 언어가 섞인 회의도 최대 3개 언어까지 동시에 전사합니다.",
        visualType: "multilingual",
      },
    ] satisfies TranscriptionFeatureCard[],
    nextFeatureCards: [
      {
        title: "AI 요약",
        description: "전사된 회의 내용을 요약, 결정사항, 액션 아이템으로 정리합니다.",
        href: "/features/ai-note",
        cta: "AI 요약 보기",
        visual: "summary",
      },
      {
        title: "업무 연결",
        description: "회의 기록을 AIP, MCP, Agent와 연결해 다음 업무로 확장합니다.",
        href: "/integrations",
        cta: "업무 연결 보기",
        visual: "workflow",
      },
    ],
    faqs: [
      {
        question: "이중언어 회의도 전사할 수 있나요?",
        answer: "네. 두 언어가 오가는 회의에서도 각 발화를 원문 언어 기준으로 전사할 수 있습니다.",
      },
      {
        question: "몇 개 언어까지 동시에 전사할 수 있나요?",
        answer: "최대 3개 언어까지 동시에 전사할 수 있습니다. 한국어, 영어, 일본어가 섞인 회의도 하나의 전사 흐름 안에서 확인할 수 있습니다.",
      },
    ],
  },
  en: {
    heroTitle: ["Capture every word", "accurately", "in real time."],
    heroDescription: [
      "Lingo transcribes conversations in multilingual meetings in real time.",
      "Even with long discussions, multiple speakers, and domain terms, it keeps context and leaves records that are easy to review.",
    ],
    primaryCta: "Start Lingo",
    secondaryCta: "View multilingual transcription",
    nextTitle: "It does not stop at records. Make every meeting more valuable.",
    nextDescription: "Transcribed meetings extend into summaries and workflow connections.",
    faqTitle: "Frequently Asked Questions",
    ctaTitle: "Record your next meeting in real time.",
    ctaDescription:
      "Even in multilingual meetings, Lingo captures speech and context from the moment the meeting starts.",
    featureCards: [
      {
        title: "Speaker diarization",
        description: "Automatically identify who said what and follow the flow even when several people speak.",
        visualType: "speaker",
      },
      {
        title: "Accuracy-first voice detection",
        description: "Intelligently detects pauses and continuations to reduce broken sentences.",
        visualType: "voice",
      },
      {
        title: "Domain terminology recognition",
        description: "Reflect domain terms from AI, legal, and product meetings for more reliable records.",
        visualType: "terms",
      },
      {
        title: "Multilingual transcription",
        description: "Transcribe bilingual and multilingual meetings with up to three languages at once.",
        visualType: "multilingual",
      },
    ] satisfies TranscriptionFeatureCard[],
    nextFeatureCards: [
      {
        title: "AI summary",
        description: "Summarize transcribed meetings into decisions and action items.",
        href: "/features/ai-note",
        cta: "View AI summary",
        visual: "summary",
      },
      {
        title: "Workflow connection",
        description: "Connect meeting records to AIP, MCP, and agents for the next task.",
        href: "/integrations",
        cta: "View workflow connection",
        visual: "workflow",
      },
    ],
    faqs: [
      {
        question: "Can Lingo transcribe bilingual meetings?",
        answer: "Yes. Each utterance can be transcribed in its original language even when two languages are used.",
      },
      {
        question: "How many languages can be transcribed at once?",
        answer: "Up to three languages can be transcribed at once.",
      },
    ],
  },
  ja: {
    heroTitle: ["すべての発話を、", "リアルタイムで正確に", "記録しましょう。"],
    heroDescription: [
      "Lingoは複数言語が混ざる会議の会話をリアルタイムで文字起こしします。",
      "長い会話、複数話者、専門用語が混ざる会議でも文脈を保ち、確認しやすい記録を残します。",
    ],
    primaryCta: "Lingoを始める",
    secondaryCta: "多言語文字起こしを見る",
    nextTitle: "記録で終わりません。会議をさらに価値あるものにします。",
    nextDescription: "文字起こしされた会議は、要約と業務連携へ拡張されます。",
    faqTitle: "よくある質問",
    ctaTitle: "次の会議をリアルタイムで記録しましょう。",
    ctaDescription:
      "複数言語が混ざる会議でも、Lingoは開始直後から発話と文脈を記録します。",
    featureCards: [
      {
        title: "話者分離",
        description: "誰が何を話したかを自動で区別し、複数人の会議でも流れをすばやく把握できます。",
        visualType: "speaker",
      },
      {
        title: "精度優先の音声検知",
        description: "発話の停止と継続を判断し、文が途中で切れる問題を減らします。",
        visualType: "voice",
      },
      {
        title: "専門用語認識の強化",
        description: "AI、法律、製品開発など専門用語の多い会議でも安定した記録を残せます。",
        visualType: "terms",
      },
      {
        title: "多言語文字起こし",
        description: "二言語会議はもちろん、複数言語が混ざる会議も最大3言語まで同時に文字起こしします。",
        visualType: "multilingual",
      },
    ] satisfies TranscriptionFeatureCard[],
    nextFeatureCards: [
      {
        title: "AI要約",
        description: "文字起こしされた会議を要約、決定事項、アクションアイテムに整理します。",
        href: "/features/ai-note",
        cta: "AI要約を見る",
        visual: "summary",
      },
      {
        title: "業務連携",
        description: "会議記録をAIP、MCP、Agentと接続し、次の業務へ拡張します。",
        href: "/integrations",
        cta: "業務連携を見る",
        visual: "workflow",
      },
    ],
    faqs: [
      {
        question: "二言語会議も文字起こしできますか？",
        answer: "はい。二つの言語が使われる会議でも、各発話を原文言語で文字起こしできます。",
      },
      {
        question: "同時に何言語まで文字起こしできますか？",
        answer: "最大3言語まで同時に文字起こしできます。",
      },
    ],
  },
}

function FeatureCardsSection() {
  const copy = getLocaleCopy(useLocale(), transcriptionCopy)

  return (
    <Container className="section-gap">
      <div className="flex flex-col gap-16 md:gap-[120px]">
        {copy.featureCards.map((card, index) => {
          const isEven = index % 2 === 0
          return (
            <article
              key={card.title}
              className="flex flex-col gap-[30px] md:flex-row md:items-start md:gap-[60px]"
            >
              <div
                className={cn(
                  "flex flex-1 flex-col gap-[10px]",
                  isEven ? "order-1" : "order-1 md:order-2"
                )}
              >
                <h3 className="text-h2 text-[var(--fg)]">{card.title}</h3>
                <p className="body-md text-[var(--fg)]">{card.description}</p>
              </div>
              <div
                className={cn(
                  "relative order-2 aspect-[1200/748] w-full overflow-hidden rounded-[var(--corner-feature)] md:w-[600px]",
                  isEven ? "md:order-2" : "md:order-1"
                )}
              >
                <TranscriptionFeatureVisual type={card.visualType} />
              </div>
            </article>
          )
        })}
      </div>
    </Container>
  )
}

function renderNextFeatureVisual(visual: string) {
  if (visual === "summary") {
    return (
      <div
        className="relative flex aspect-[4/3] shrink-0 overflow-hidden rounded-[14px] p-5"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #ffe4d3 0%, transparent 32%), linear-gradient(135deg, #f07b2d 0%, #b47cff 48%, #3168f4 100%)",
        }}
      >
        <div className="mt-auto w-full rounded-[18px] bg-white/90 p-4 shadow-[0_18px_50px_rgba(33,23,63,0.16)] backdrop-blur">
          <div className="mb-3 h-3 w-20 rounded-full bg-[var(--brand)]/20" />
          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-full rounded-full bg-black/15" />
            <div className="h-2.5 w-[86%] rounded-full bg-black/10" />
            <div className="h-2.5 w-[62%] rounded-full bg-[#1b1b1b]/10" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-8 rounded-[10px] bg-[#f3ebe4]" />
            <div className="h-8 rounded-[10px] bg-[#eee8f8]" />
            <div className="h-8 rounded-[10px] bg-[#e8eefb]" />
          </div>
        </div>
      </div>
    )
  }

  if (visual === "workflow") {
    return (
      <div
        className="relative flex aspect-[4/3] shrink-0 overflow-hidden rounded-[14px] p-5"
        style={{
          background:
            "linear-gradient(135deg, #f5d9c9 0%, #d9cef3 48%, #7ba4ff 100%)",
        }}
      >
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-[18px] bg-white/90 p-4 shadow-[0_18px_50px_rgba(33,23,63,0.14)]">
            <div className="h-3 w-16 rounded-full bg-black/15" />
            <div className="mt-4 flex flex-col gap-2">
              <div className="h-2.5 rounded-full bg-black/10" />
              <div className="h-2.5 w-3/4 rounded-full bg-[#1b1b1b]/10" />
            </div>
          </div>
          <div className="h-1 w-10 rounded-full bg-white/70" />
          <div className="rounded-[18px] bg-white/90 p-4 shadow-[0_18px_50px_rgba(33,23,63,0.14)]">
            <div className="h-3 w-14 rounded-full bg-[var(--brand)]/32" />
            <div className="mt-4 flex flex-col gap-2">
              <div className="h-2.5 rounded-full bg-black/10" />
              <div className="h-2.5 w-2/3 rounded-full bg-[#1b1b1b]/10" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex aspect-[4/3] shrink-0 overflow-hidden rounded-[14px] p-5"
      style={{
        background:
          "radial-gradient(circle at 72% 18%, #f47a2a 0%, transparent 28%), linear-gradient(135deg, #c6d7ff 0%, #8d83ee 50%, #2668ef 100%)",
      }}
    >
      <div className="mt-auto ml-auto w-[78%] rounded-t-[18px] bg-white/85 p-4 pb-0 shadow-[0_18px_50px_rgba(33,23,63,0.16)] backdrop-blur">
        <div className="mb-4 flex gap-1.5">
          <span className="size-2 rounded-full bg-black/10" />
          <span className="size-2 rounded-full bg-black/10" />
          <span className="size-2 rounded-full bg-black/10" />
        </div>
        <div className="rounded-t-[14px] border border-black/10 bg-white/85 p-4">
          <div className="h-3 w-24 rounded-full bg-black/15" />
          <div className="mt-4 flex flex-col gap-2">
            <div className="h-2.5 rounded-full bg-black/10" />
            <div className="h-2.5 w-[84%] rounded-full bg-[#1b1b1b]/10" />
            <div className="h-2.5 w-[58%] rounded-full bg-[#1b1b1b]/10" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NextFeaturesSection() {
  const copy = getLocaleCopy(useLocale(), transcriptionCopy)

  return (
    <Container>
      <div className="flex flex-col gap-[50px] md:gap-[70px]">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-[14px] text-center">
          <h2 className="text-h1 [word-break:keep-all] text-[var(--fg)]">
            {copy.nextTitle}
          </h2>
          <p className="body-md text-[var(--fg)]">{copy.nextDescription}</p>
        </div>
        <div className="mx-auto grid w-full max-w-[680px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {copy.nextFeatureCards.map((card) => (
            <article
              key={card.title}
              className="group flex min-h-[380px] flex-col rounded-[var(--corner-box)] bg-[var(--card)] p-4 text-left shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform duration-250 hover:-translate-y-1 md:min-h-[470px] md:p-5"
            >
              {renderNextFeatureVisual(card.visual)}
              <div className="flex flex-1 flex-col gap-[14px] px-1 pt-8 md:px-2">
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-h3 text-[var(--fg)]">{card.title}</h3>
                  <p className="body-sm text-[var(--mute)]">
                    {card.description}
                  </p>
                </div>
                <Button
                  href={`/lingo${card.href}`}
                  variant="dark"
                  className="mt-auto w-full"
                >
                  {card.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Container>
  )
}

function TranscriptionFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const copy = getLocaleCopy(useLocale(), transcriptionCopy)

  return (
    <Container>
      <div className="flex flex-col gap-4 md:gap-[20px]">
        <h2 className="text-h1 text-[var(--fg)]">{copy.faqTitle}</h2>
        <div className="flex flex-col gap-[10px]">
          {copy.faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="rounded-[var(--corner-box)] bg-[var(--card)]"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex((current) => (current === i ? null : i))
                }
                aria-expanded={openIndex === i}
                className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-[30px]"
              >
                <span className="body-md text-[var(--fg)]">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-[var(--fg)] transition-transform duration-250",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid px-5 transition-[grid-template-rows] duration-300 md:px-[30px]",
                  openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="body-md pb-5 text-[var(--mute)] md:pb-[30px]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

function TranscriptionCTASection() {
  const copy = getLocaleCopy(useLocale(), transcriptionCopy)

  return (
    <Container>
      <div className="flex flex-col items-center gap-6 text-center md:gap-[30px]">
        <div className="flex w-full flex-col items-center gap-4 text-[var(--fg)] md:gap-[20px]">
          <h2 className="text-h1">{copy.ctaTitle}</h2>
          <p className="body-md">
            {copy.ctaDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="dark">{copy.primaryCta}</Button>
        </div>
      </div>
    </Container>
  )
}

export default function TranscriptionPage() {
  const copy = getLocaleCopy(useLocale(), transcriptionCopy)

  return (
    <main className="page-layout-sub min-h-screen bg-[var(--bg)]">
      <SubPageHeroBackground />
      <div className="page-gutter w-full">
        <div className="container-main relative z-10 w-full">
          <div className="flex flex-col gap-5 md:gap-[20px]">
            <h1 className="text-h1 text-[var(--fg)]">
              {copy.heroTitle[0]}
              <br />
              {copy.heroTitle[1]} {copy.heroTitle[2]}
            </h1>
          </div>
          <p className="body-md mt-5 max-w-[1000px] text-[var(--fg)]">
            {copy.heroDescription[0]}
            <br />
            {copy.heroDescription[1]}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="dark">{copy.secondaryCta}</Button>
          </div>
        </div>
      </div>
      <FeatureCardsSection />
      <div className="section-gap">
        <NextFeaturesSection />
      </div>
      <div className="section-gap">
        <TranscriptionFAQSection />
      </div>
      <div className="section-gap">
        <TranscriptionCTASection />
      </div>
      <div className="section-gap">
        <Footer />
      </div>
    </main>
  )
}
