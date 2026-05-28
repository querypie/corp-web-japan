"use client"

import { useLocale } from "@/lib/lingo/intl"
import { SubHeroSection } from "@/components/sections/lingo/SubHeroSection"
import { CTASection } from "@/components/sections/lingo/CTASection"
import { Footer } from "@/components/layout/lingo/Footer"
import { Container } from "@/components/layout/lingo/Container"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"

const helpCopy = {
  ko: {
    title: ["무엇을", "도와드릴까요?"],
    description: [
      "Lingo에 대한 자주 묻는 질문을 확인하세요.",
      "시작 방법부터 주요 기능까지 필요한 답변을 모았습니다.",
    ],
    faqTitle: "자주 묻는 질문",
    faqs: [
      {
        q: "전사는 어떻게 시작하나요?",
        a: "캘린더를 연결하거나 회의 링크를 입력하면 Lingo가 참여해 자동으로 전사를 시작합니다.",
      },
      {
        q: "어떤 언어를 지원하나요?",
        a: "현재 한국어, 영어, 일본어 중심의 전사와 실시간 번역을 지원합니다.",
      },
      {
        q: "회의 데이터는 안전하게 보호되나요?",
        a: "전송 및 저장 구간에서 데이터를 암호화하고, AIP 기반 조직 관리 흐름과 함께 운영합니다.",
      },
      {
        q: "회의 기록을 내보낼 수 있나요?",
        a: "전사, 번역, AI 노트는 텍스트로 내보내거나 링크로 공유할 수 있습니다.",
      },
      {
        q: "화상회의 도구와 연동되나요?",
        a: "Zoom, Google Meet, Microsoft Teams 등 주요 회의 도구와 함께 사용할 수 있습니다.",
      },
    ],
  },
  en: {
    title: ["How can we", "help you?"],
    description: [
      "Find answers to common questions about Lingo.",
      "From getting started to advanced features, we have got you covered.",
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How do I start a transcription?",
        a: "Connect your calendar or paste a meeting link. Lingo will join and start transcribing automatically.",
      },
      {
        q: "Which languages are supported?",
        a: "Lingo currently supports Korean, English, and Japanese for transcription and real-time translation.",
      },
      {
        q: "Is my meeting data secure?",
        a: "Data is encrypted in transit and at rest, and operated with AIP-based organization management.",
      },
      {
        q: "Can I export transcripts?",
        a: "Transcripts, translations, and AI notes can be exported as text or shared via links.",
      },
      {
        q: "Does Lingo work with my video conferencing tool?",
        a: "Lingo works with Zoom, Google Meet, Microsoft Teams, and more.",
      },
    ],
  },
  ja: {
    title: ["どのように", "お手伝いできますか？"],
    description: [
      "Lingoに関するよくある質問を確認できます。",
      "始め方から主要機能まで、必要な回答をまとめました。",
    ],
    faqTitle: "よくある質問",
    faqs: [
      {
        q: "文字起こしはどのように開始しますか？",
        a: "カレンダーを接続するか会議リンクを入力すると、Lingoが参加して自動で文字起こしを開始します。",
      },
      {
        q: "どの言語に対応していますか？",
        a: "現在は韓国語、英語、日本語を中心に、文字起こしとリアルタイム翻訳をサポートしています。",
      },
      {
        q: "会議データは安全ですか？",
        a: "データは転送時と保存時に暗号化され、AIPベースの組織管理とともに運用されます。",
      },
      {
        q: "会議記録をエクスポートできますか？",
        a: "文字起こし、翻訳、AIノートはテキストでエクスポートしたりリンクで共有できます。",
      },
      {
        q: "ビデオ会議ツールと連携できますか？",
        a: "Zoom、Google Meet、Microsoft Teamsなど主要な会議ツールと一緒に利用できます。",
      },
    ],
  },
}

export default function HelpPage() {
  const copy = getLocaleCopy(useLocale(), helpCopy)

  return (
    <main className="min-h-screen bg-[var(--bg)] page-layout-sub">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] overflow-hidden">
        <img
          src="/lingo/images/bg-home.jpg"
          alt=""
          className="size-full object-cover object-bottom"
        />
      </div>

      <div className="w-full page-gutter">
        <div className="container-main relative z-10 w-full">
          <SubHeroSection
            title={
              <>
                {copy.title[0]}
                <br />
                {copy.title[1]}
              </>
            }
            description={
              <>
                {copy.description[0]}
                <br />
                {copy.description[1]}
              </>
            }
          />
        </div>
      </div>

      {/* FAQ 섹션 */}
      <Container className="section-gap">
        <h2 className="text-h2 mb-5 text-[var(--fg)]">
          {copy.faqTitle}
        </h2>
        <div className="flex flex-col gap-4">
          {copy.faqs.map((faq, i) => (
            <div
              key={i}
              className="flex flex-col gap-[10px] rounded-[var(--corner-box)] bg-[var(--card)] p-[30px]"
            >
              <h3 className="text-h3 text-[var(--fg)]">{faq.q}</h3>
              <p className="body-md text-[var(--fg)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </Container>

      <div className="section-gap">
        <CTASection />
      </div>
      <div className="section-gap"><Footer /></div>
    </main>
  )
}
