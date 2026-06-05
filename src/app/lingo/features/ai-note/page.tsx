"use client"

import { useState } from "react"
import { useLocale } from "@/lib/lingo/intl"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/lingo/common/Button"
import { Container } from "@/components/layout/lingo/Container"
import { Footer } from "@/components/layout/lingo/Footer"
import {
  AiNoteFeatureVisual,
  type AiNoteFeatureVisualType,
} from "@/components/sections/lingo/AiNoteFeatureVisuals"
import { SubPageHeroBackground } from "@/components/sections/lingo/SubPageHeroBackground"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { cn } from "@/lib/lingo/utils"

type AiNoteFeatureCard = {
  title: string
  description: string
  visualType: AiNoteFeatureVisualType
  badge?: string
}

const aiNoteCopy = {
  ko: {
    heroTitle: ["회의록은 AI에게 맡기고,", "팀은 실행에 집중하세요."],
    heroDescription: [
      "긴 회의 대화에서 핵심 내용과 결정사항, 액션 아이템을 자동으로 정리합니다.",
      "회의 후 별도 정리 시간을 줄이고, 중요한 후속 업무를 놓치지 않게 도와줍니다.",
    ],
    primaryCta: "Lingo 시작하기",
    secondaryCta: "AI 노트 보기",
    faqTitle: "자주 묻는 질문",
    ctaTitle: "수동 회의록 작성은 이제 그만.",
    ctaDescription:
      "Lingo는 회의가 끝난 뒤에도 팀이 바로 움직일 수 있도록, 핵심 요약과 결정사항, 액션 아이템을 한곳에 정리합니다.",
    featureCards: [
      {
        title: "중요한 내용을 놓치지 않는 AI 요약",
        description:
          "회의 전체를 다시 듣거나 긴 전사문을 훑지 않아도, 무엇이 논의되었고 무엇을 해야 하는지 빠르게 확인할 수 있습니다.",
        visualType: "summary",
      },
      {
        title: "회의 목적에 맞는 템플릿 선택",
        description:
          "빠른 요약, 데일리 / 위클리 미팅, 고객 미팅, 의사결정 미팅처럼 회의 목적에 맞는 형식을 선택할 수 있습니다.",
        visualType: "templates",
      },
      {
        title: "커스텀 프롬프트를 통한 노트 생성",
        description:
          "정해진 템플릿으로 부족할 때는 직접 프롬프트를 입력해 원하는 형식의 AI 노트를 만들 수 있습니다.",
        visualType: "customPrompt",
      },
      {
        title: "회의 중 궁금한 점을 AI에게 질문",
        description:
          "회의가 진행되는 동안 놓친 내용이나 방금 논의된 맥락을 자연스럽게 이어서 질문할 수 있습니다.",
        visualType: "liveQuestion",
        badge: "Coming Soon",
      },
    ] satisfies AiNoteFeatureCard[],
    faqs: [
      {
        question: "AI 노트는 언제 쓸 수 있나요?",
        answer: "회의 세션이 종료된 후 사용할 수 있습니다. AI 노트 버튼을 클릭하면 노트 생성 패널이 열립니다.",
      },
      {
        question: "AI 노트 형식을 커스텀할 수 있나요?",
        answer: "네. 기본 템플릿을 사용할 수 있고, 직접 프롬프트를 입력해 원하는 형식으로 생성할 수도 있습니다.",
      },
      {
        question: "액션 아이템도 따로 정리되나요?",
        answer: "네. 회의 내용에서 해야 할 일, 담당자, 기한 같은 실행 정보를 분리해 확인하기 쉬운 형태로 정리합니다.",
      },
    ],
  },
  en: {
    heroTitle: ["Let AI handle notes,", "so your team can execute."],
    heroDescription: [
      "Automatically organize key points, decisions, and action items from long meeting conversations.",
      "Reduce post-meeting cleanup and keep important follow-ups from slipping.",
    ],
    primaryCta: "Start Lingo",
    secondaryCta: "View AI Notes",
    faqTitle: "Frequently Asked Questions",
    ctaTitle: "Stop writing meeting notes manually.",
    ctaDescription:
      "Lingo organizes summaries, decisions, and action items in one place so teams can move immediately after meetings.",
    featureCards: [
      {
        title: "AI summaries that keep key points visible",
        description:
          "Without replaying the full meeting or scanning a long transcript, quickly see what was discussed and what needs to be done.",
        visualType: "summary",
      },
      {
        title: "Choose a template for the meeting purpose",
        description:
          "Pick from quick summaries, daily or weekly meetings, customer meetings, and decision meetings.",
        visualType: "templates",
      },
      {
        title: "Generate notes with custom prompts",
        description:
          "When templates are not enough, enter your own prompt and create notes in the exact format you need.",
        visualType: "customPrompt",
      },
      {
        title: "Ask AI questions during meetings",
        description:
          "Naturally follow up with questions about missed details or context that was just discussed during the meeting.",
        visualType: "liveQuestion",
        badge: "Coming Soon",
      },
    ] satisfies AiNoteFeatureCard[],
    faqs: [
      {
        question: "When can I use AI Notes?",
        answer: "AI Notes are available after a meeting session ends. Click the AI Notes button to open the note generation panel.",
      },
      {
        question: "Can I customize the AI note format?",
        answer: "Yes. You can use built-in templates or enter a custom prompt to generate notes in the format you need.",
      },
      {
        question: "Are action items extracted separately?",
        answer: "Yes. Lingo separates tasks, owners, due dates, and follow-ups into an easy-to-review format.",
      },
    ],
  },
  ja: {
    heroTitle: ["議事録はAIに任せて、", "チームは実行に集中しましょう。"],
    heroDescription: [
      "長い会議から要点、決定事項、アクションアイテムを自動で整理します。",
      "会議後の整理時間を減らし、重要なフォローアップを逃しません。",
    ],
    primaryCta: "Lingoを始める",
    secondaryCta: "AIノートを見る",
    faqTitle: "よくある質問",
    ctaTitle: "手動の議事録作成は終わりにしましょう。",
    ctaDescription:
      "Lingoは会議後すぐに動けるよう、要約、決定事項、アクションアイテムを一か所に整理します。",
    featureCards: [
      {
        title: "重要な内容を逃さないAI要約",
        description:
          "会議全体を聞き直したり長い文字起こしを読み返したりしなくても、何が議論され、何をすべきかをすばやく確認できます。",
        visualType: "summary",
      },
      {
        title: "会議目的に合ったテンプレート選択",
        description:
          "クイック要約、デイリー / ウィークリー、顧客ミーティング、意思決定ミーティングから選べます。",
        visualType: "templates",
      },
      {
        title: "カスタムプロンプトでノート生成",
        description:
          "テンプレートだけでは足りない場合、直接プロンプトを入力して必要な形式のAIノートを作成できます。",
        visualType: "customPrompt",
      },
      {
        title: "会議中の疑問をAIに質問",
        description:
          "会議中に聞き逃した内容や直前に話された文脈について、自然な流れで続けて質問できます。",
        visualType: "liveQuestion",
        badge: "Coming Soon",
      },
    ] satisfies AiNoteFeatureCard[],
    faqs: [
      {
        question: "AIノートはいつ使えますか？",
        answer: "会議セッション終了後に利用できます。AIノートボタンから生成パネルを開きます。",
      },
      {
        question: "AIノートの形式をカスタマイズできますか？",
        answer: "はい。基本テンプレートを使うことも、独自プロンプトで必要な形式に生成することもできます。",
      },
      {
        question: "アクションアイテムも整理されますか？",
        answer: "はい。タスク、担当者、期限、フォローアップを確認しやすい形式で整理します。",
      },
    ],
  },
}

function FeatureCardsSection() {
  const copy = getLocaleCopy(useLocale(), aiNoteCopy)

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
                  "flex flex-1 flex-col gap-[12px]",
                  isEven ? "order-1" : "order-1 md:order-2"
                )}
              >
                {card.badge && (
                  <span className="body-sm w-fit rounded-full bg-[var(--fg)] px-3 py-1 text-[var(--white)]">
                    {card.badge}
                  </span>
                )}
                <h3 className="text-h2 text-[var(--fg)]">{card.title}</h3>
                <p className="body-md text-[var(--fg)]">{card.description}</p>
              </div>
              <div
                className={cn(
                  "relative order-2 aspect-[1200/748] w-full overflow-hidden rounded-[var(--corner-feature)] md:w-[600px]",
                  isEven ? "md:order-2" : "md:order-1"
                )}
              >
                <AiNoteFeatureVisual type={card.visualType} />
              </div>
            </article>
          )
        })}
      </div>
    </Container>
  )
}

function AiNoteFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const copy = getLocaleCopy(useLocale(), aiNoteCopy)

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

function AiNoteCTASection() {
  const copy = getLocaleCopy(useLocale(), aiNoteCopy)

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

export default function AiNotePage() {
  const copy = getLocaleCopy(useLocale(), aiNoteCopy)

  return (
    <main className="page-layout-sub min-h-screen bg-[var(--bg)]">
      <SubPageHeroBackground />
      <div className="page-gutter w-full">
        <div className="container-main relative z-10 w-full">
          <div className="flex flex-col gap-5 md:gap-[20px]">
            <h1 className="text-h1 text-[var(--fg)]">
              {copy.heroTitle[0]}
              <br />
              {copy.heroTitle[1]}
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
        <AiNoteFAQSection />
      </div>
      <div className="section-gap">
        <AiNoteCTASection />
      </div>
      <div className="section-gap">
        <Footer />
      </div>
    </main>
  )
}
