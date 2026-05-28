"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { useLocale } from "@/lib/lingo/intl"
import { Button } from "@/components/lingo/common/Button"
import { Container } from "@/components/layout/lingo/Container"
import { Footer } from "@/components/layout/lingo/Footer"
import {
  TranslationFeatureVisual,
  type TranslationFeatureVisualType,
} from "@/components/sections/lingo/TranslationFeatureVisuals"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { cn } from "@/lib/lingo/utils"

type TranslationFeatureCard = {
  title: string
  description: string
  visualType: TranslationFeatureVisualType
}

const translationPageCopy = {
  ko: {
    heroTitle: ["대화를 따라가는", "실시간 번역."],
    heroDescription: [
      "번역을 켜고 언어를 선택하면, Lingo가 회의 속 대화를 실시간으로 전사하고 번역합니다.",
      "한국어, 영어, 일본어가 오가는 회의에서도 모두가 같은 맥락을 놓치지 않습니다.",
    ],
    primaryCta: "Lingo 시작하기",
    secondaryCta: "실시간 번역 보기",
    valueTitle: ["언어 장벽 없이,", "서로를 이해하는 데만 집중하세요."],
    sourceExample: "来週のリリース前に、韓国チームとレビューしたいです。",
    translatedExample: "다음 주 릴리스 전에 한국 팀과 함께 검토하고 싶습니다.",
    valueSteps: [
      {
        title: "STEP1. 사용할 언어 선택",
        description:
          "회의 참여자가 사용하는 언어를 선택합니다. 여러 언어를 설정하면 Lingo가 회의 시작과 동시에 전사와 번역을 준비합니다.",
        previewTitle: "회의 언어",
        previewBody: "한국어 · English · 日本語",
      },
      {
        title: "STEP2. 번역 활성화",
        description:
          "번역 토글을 켜면 선택한 언어 간 실시간 번역이 시작됩니다. 발화 내용은 원문으로 기록되고 필요한 언어로 함께 번역됩니다.",
        previewTitle: "실시간 번역",
        previewBody: "선택한 언어 간 실시간 번역 제공",
      },
      {
        title: "STEP3. 실시간으로 함께 확인",
        description:
          "언어가 달라도 같은 속도로 회의를 따라갈 수 있습니다. 공유 링크로 참여자와 같은 내용을 실시간으로 확인할 수 있습니다.",
        previewTitle: "공유 링크",
        previewBody: "참여자가 브라우저에서 번역 확인",
      },
    ],
    featureCards: [
      {
        title: "최대 3개 언어까지 동시 번역",
        description:
          "여러 언어가 함께 쓰이는 회의에서 최대 3개 언어를 동시에 처리합니다. 참여자는 각자의 언어로 말하고 필요한 언어로 내용을 확인할 수 있습니다.",
        visualType: "languages",
      },
      {
        title: "가장 빠른 번역, 가장 정확한 번역",
        description:
          "말이 끝나기 전에도 먼저 보여주고, 문장이 완성될수록 문맥을 반영해 더 정확하게 다듬습니다. 회의 흐름을 놓치지 않으면서도 다시 읽기 쉬운 번역을 제공합니다.",
        visualType: "fast",
      },
      {
        title: "원격 회의에 초대되는 통역사",
        description:
          "Zoom, Google Meet, Teams 링크를 넣고 언어를 선택하면 회의 속 통역사처럼 함께합니다. 온라인 회의에서 오가는 발화를 전사하고 번역해 참여자가 같은 맥락을 따라가게 합니다.",
        visualType: "remote",
      },
      {
        title: "실시간 번역 링크 공유",
        description:
          "번역 화면 링크를 회의 참여자에게 공유하면, 각자가 브라우저에서 원문과 번역을 확인하며 자유롭게 소통할 수 있습니다.",
        visualType: "share",
      },
    ] satisfies TranslationFeatureCard[],
    faqTitle: "자주 묻는 질문",
    faqs: [
      {
        question: "번역은 어떻게 켜나요?",
        answer:
          "소스 언어를 2개 이상 선택한 뒤 실시간 번역 토글을 켜면 됩니다. 선택한 언어 간 양방향 번역이 동작합니다.",
      },
      {
        question: "대면 회의에서도 번역이 되나요?",
        answer: "네. 대면 모드와 원격 모드 모두 실시간 번역을 지원합니다.",
      },
      {
        question: "어떤 언어를 중심으로 사용할 수 있나요?",
        answer:
          "현재 페이지에서는 한국어, 영어, 일본어가 오가는 회의 경험을 중심으로 설명합니다. 지원 언어 목록은 제품 정책에 맞춰 별도 안내하는 것이 좋습니다.",
      },
      {
        question: "번역 결과만 볼 수 있나요?",
        answer:
          "원문과 번역을 함께 확인하는 구성을 권장합니다. 중요한 표현이나 결정 사항은 원문 기준으로도 다시 검토할 수 있습니다.",
      },
    ],
    ctaTitle: "다국어 팀을 하나의 회의 흐름으로 연결하세요.",
    ctaDescription:
      "Lingo는 언어가 다른 참여자도 같은 맥락에서 말하고 이해할 수 있도록, 회의가 진행되는 순간부터 전사와 번역을 함께 제공합니다.",
  },
  en: {
    heroTitle: ["Real-time translation", "that follows the conversation."],
    heroDescription: [
      "Choose your languages and Lingo transcribes and translates the meeting in real time.",
      "Even when Korean, English, and Japanese move through the same meeting, everyone keeps the same context.",
    ],
    primaryCta: "Start Lingo",
    secondaryCta: "View real-time translation",
    valueTitle: ["Focus on understanding,", "not the language barrier."],
    sourceExample: "来週のリリース前に、韓国チームとレビューしたいです。",
    translatedExample:
      "I would like to review it with the Korean team before next week's release.",
    valueSteps: [
      {
        title: "STEP 1. Select languages",
        description:
          "Select the languages your meeting participants use. Once multiple languages are configured, Lingo prepares transcription and translation as the meeting begins.",
        previewTitle: "Meeting languages",
        previewBody: "Korean · English · Japanese",
      },
      {
        title: "STEP 2. Turn on translation",
        description:
          "Enable translation to start real-time translation between selected languages. Speech is recorded in the source language and translated into the languages you need.",
        previewTitle: "Real-time translation",
        previewBody: "Live translation across selected languages",
      },
      {
        title: "STEP 3. Follow together live",
        description:
          "Even across languages, participants can follow the meeting at the same pace. Share a link so everyone can view the same context in real time.",
        previewTitle: "Sharing link",
        previewBody: "Participants view translations in the browser",
      },
    ],
    featureCards: [
      {
        title: "Translate up to three languages at once",
        description:
          "Handle up to three languages in multilingual meetings. Participants can speak in their own language and review the content in the language they need.",
        visualType: "languages",
      },
      {
        title: "Fast translation with context-aware accuracy",
        description:
          "Lingo shows early translation before a speaker finishes, then refines it as the sentence completes. You keep up with the meeting while getting translations that are easy to reread.",
        visualType: "fast",
      },
      {
        title: "An interpreter invited to remote meetings",
        description:
          "Add a Zoom, Google Meet, or Teams link and select languages. Lingo joins like an interpreter, transcribing and translating remote conversations so everyone follows the same context.",
        visualType: "remote",
      },
      {
        title: "Share a live translation link",
        description:
          "Share the translation screen link with participants so they can view the source text and translation in their browser and communicate freely.",
        visualType: "share",
      },
    ] satisfies TranslationFeatureCard[],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        question: "How do I turn on translation?",
        answer:
          "Select two or more source languages, then turn on real-time translation. Lingo translates both ways between the selected languages.",
      },
      {
        question: "Does translation work for in-person meetings?",
        answer:
          "Yes. Lingo supports real-time translation for both in-person and remote meeting modes.",
      },
      {
        question: "Which languages can I use?",
        answer:
          "This page focuses on meetings that move between Korean, English, and Japanese. Supported language details should follow the product policy.",
      },
      {
        question: "Can I view only the translated result?",
        answer:
          "We recommend reviewing the source and translation together so important expressions and decisions can still be checked against the original.",
      },
    ],
    ctaTitle: "Bring multilingual teams into one meeting flow.",
    ctaDescription:
      "Lingo provides transcription and translation from the moment the meeting starts so participants can speak and understand in the same context.",
  },
  ja: {
    heroTitle: ["会話に追いつく", "リアルタイム翻訳。"],
    heroDescription: [
      "翻訳をオンにして言語を選ぶと、Lingoが会議の会話をリアルタイムで文字起こしして翻訳します。",
      "韓国語、英語、日本語が行き交う会議でも、全員が同じ文脈を見失いません。",
    ],
    primaryCta: "Lingoを始める",
    secondaryCta: "リアルタイム翻訳を見る",
    valueTitle: ["言語の壁を越えて、", "理解することだけに集中できます。"],
    sourceExample: "来週のリリース前に、韓国チームとレビューしたいです。",
    translatedExample: "来週のリリース前に、韓国チームと一緒に確認したいです。",
    valueSteps: [
      {
        title: "STEP1. 使用する言語を選択",
        description:
          "会議参加者が使用する言語を選択します。複数の言語を設定すると、Lingoが会議開始と同時に文字起こしと翻訳を準備します。",
        previewTitle: "会議言語",
        previewBody: "韓国語 · English · 日本語",
      },
      {
        title: "STEP2. 翻訳を有効化",
        description:
          "翻訳トグルをオンにすると、選択した言語間のリアルタイム翻訳が始まります。発話は原文で記録され、必要な言語にも翻訳されます。",
        previewTitle: "リアルタイム翻訳",
        previewBody: "選択した言語間でリアルタイム翻訳",
      },
      {
        title: "STEP3. リアルタイムで一緒に確認",
        description:
          "言語が違っても同じペースで会議を追えます。共有リンクで参加者が同じ内容をリアルタイムに確認できます。",
        previewTitle: "共有リンク",
        previewBody: "参加者がブラウザで翻訳を確認",
      },
    ],
    featureCards: [
      {
        title: "最大3言語まで同時翻訳",
        description:
          "複数の言語が使われる会議で、最大3言語を同時に処理します。参加者は自分の言語で話し、必要な言語で内容を確認できます。",
        visualType: "languages",
      },
      {
        title: "速く、文脈に強い翻訳",
        description:
          "話し終わる前から先に表示し、文が完成するにつれて文脈を反映してより正確に整えます。会議の流れを逃さず、読み返しやすい翻訳を提供します。",
        visualType: "fast",
      },
      {
        title: "リモート会議に招待できる通訳者",
        description:
          "Zoom、Google Meet、Teamsのリンクを入れて言語を選ぶと、会議内の通訳者のように参加します。オンライン会議の発話を文字起こしして翻訳し、参加者が同じ文脈を追えるようにします。",
        visualType: "remote",
      },
      {
        title: "リアルタイム翻訳リンクを共有",
        description:
          "翻訳画面のリンクを参加者に共有すると、各自がブラウザで原文と翻訳を確認しながら自由にコミュニケーションできます。",
        visualType: "share",
      },
    ] satisfies TranslationFeatureCard[],
    faqTitle: "よくある質問",
    faqs: [
      {
        question: "翻訳はどのようにオンにしますか？",
        answer:
          "ソース言語を2つ以上選択した後、リアルタイム翻訳トグルをオンにします。選択した言語間で双方向翻訳が動作します。",
      },
      {
        question: "対面会議でも翻訳できますか？",
        answer:
          "はい。対面モードとリモートモードのどちらでもリアルタイム翻訳をサポートします。",
      },
      {
        question: "どの言語を中心に使えますか？",
        answer:
          "このページでは、韓国語、英語、日本語が行き交う会議体験を中心に説明しています。対応言語の詳細は製品ポリシーに合わせて案内するのがよいです。",
      },
      {
        question: "翻訳結果だけを見ることはできますか？",
        answer:
          "原文と翻訳を一緒に確認する構成をおすすめします。重要な表現や決定事項は原文基準でも再確認できます。",
      },
    ],
    ctaTitle: "多言語チームをひとつの会議フローにつなげましょう。",
    ctaDescription:
      "Lingoは言語が異なる参加者も同じ文脈で話し、理解できるように、会議が始まる瞬間から文字起こしと翻訳を一緒に提供します。",
  },
}

const translationValueVisualCopy = {
  ko: {
    languageLabel: "언어",
    selectedKoEn: "🇰🇷 한국어, 🇯🇵 日本語",
    selectedKoJa: "🇰🇷 한국어, 🇯🇵 日本語",
    languageOptions: [
      { flag: "🇰🇷", label: "한국어", selected: true },
      { flag: "🇺🇸", label: "English", selected: false },
      { flag: "🇯🇵", label: "日本語", selected: true },
      { flag: "🇹🇭", label: "ภาษาไทย", selected: false, beta: "BETA" },
      { flag: "🇻🇳", label: "Tiếng Việt", selected: false, beta: "BETA" },
    ],
    activationTitle: "실시간 번역 활성화",
    activationDescription: "선택한 언어의 실시간 번역을 표시합니다",
    create: "만들기",
    cancel: "취소",
    speakerName: "Emma",
    speakerInitial: "E",
    transcriptRows: [
      {
        source: "우선 이번 주에는 베타 환경에서 먼저 테스트해보겠습니다.",
        middle: "まず今週はベータ環境で先にテストしてみます。",
        target: "First, this week we’ll test it in the beta environment.",
      },
      {
        source: "완료되는 대로 공유드리겠습니다.",
        middle: "完了し次第、共有します。",
        target: "I’ll share it as soon as it’s complete.",
      },
    ],
    activeSpeaker: "Sophia",
    activeSpeakerInitial: "S",
    activeTime: "01:03",
    activeSource: "좋습니다. 다음 고객사 미팅 전에 최종 점검 진행하시죠.",
  },
  en: {
    languageLabel: "Language",
    selectedKoEn: "🇰🇷 Korean, 🇯🇵 Japanese",
    selectedKoJa: "🇰🇷 Korean, 🇯🇵 Japanese",
    languageOptions: [
      { flag: "🇰🇷", label: "Korean", selected: true },
      { flag: "🇺🇸", label: "English", selected: false },
      { flag: "🇯🇵", label: "Japanese", selected: true },
      { flag: "🇹🇭", label: "Thai", selected: false, beta: "BETA" },
      { flag: "🇻🇳", label: "Vietnamese", selected: false, beta: "BETA" },
    ],
    activationTitle: "Enable real-time translation",
    activationDescription: "Show real-time translations for selected languages",
    create: "Create",
    cancel: "Cancel",
    speakerName: "Emma",
    speakerInitial: "E",
    transcriptRows: [
      {
        source: "우선 이번 주에는 베타 환경에서 먼저 테스트해보겠습니다.",
        middle: "まず今週はベータ環境で先にテストしてみます。",
        target: "First, this week we’ll test it in the beta environment.",
      },
      {
        source: "완료되는 대로 공유드리겠습니다.",
        middle: "完了し次第、共有します。",
        target: "I’ll share it as soon as it’s complete.",
      },
    ],
    activeSpeaker: "Sophia",
    activeSpeakerInitial: "S",
    activeTime: "01:03",
    activeSource: "좋습니다. 다음 고객사 미팅 전에 최종 점검 진행하시죠.",
  },
  ja: {
    languageLabel: "言語",
    selectedKoEn: "🇰🇷 韓国語, 🇯🇵 日本語",
    selectedKoJa: "🇰🇷 韓国語, 🇯🇵 日本語",
    languageOptions: [
      { flag: "🇰🇷", label: "韓国語", selected: true },
      { flag: "🇺🇸", label: "English", selected: false },
      { flag: "🇯🇵", label: "日本語", selected: true },
      { flag: "🇹🇭", label: "ภาษาไทย", selected: false, beta: "BETA" },
      { flag: "🇻🇳", label: "Tiếng Việt", selected: false, beta: "BETA" },
    ],
    activationTitle: "リアルタイム翻訳を有効化",
    activationDescription: "選択した言語のリアルタイム翻訳を表示します",
    create: "作成",
    cancel: "キャンセル",
    speakerName: "Emma",
    speakerInitial: "E",
    transcriptRows: [
      {
        source: "우선 이번 주에는 베타 환경에서 먼저 테스트해보겠습니다.",
        middle: "まず今週はベータ環境で先にテストしてみます。",
        target: "First, this week we’ll test it in the beta environment.",
      },
      {
        source: "완료되는 대로 공유드리겠습니다.",
        middle: "完了し次第、共有します。",
        target: "I’ll share it as soon as it’s complete.",
      },
    ],
    activeSpeaker: "Sophia",
    activeSpeakerInitial: "S",
    activeTime: "01:03",
    activeSource: "좋습니다. 다음 고객사 미팅 전에 최종 점검 진행하시죠.",
  },
}

type TranslationValueVisualCopy = (typeof translationValueVisualCopy)["ko"]

function TranslationSetupModal({
  copy,
  mode,
}: {
  copy: TranslationValueVisualCopy
  mode: "language" | "activation"
}) {
  const isLanguageMode = mode === "language"

  return (
    <div className="absolute left-1/2 top-[-36px] w-[74%] max-w-[460px] -translate-x-1/2 rounded-b-[38px] bg-white px-6 pb-7 pt-[72px] shadow-[0_24px_70px_rgba(0,0,0,0.30)] md:px-8 md:pb-8">
      <div className="mb-5">
        <p className="mb-3 text-[17px] font-bold text-[#111111] md:text-[20px]">
          {copy.languageLabel}
        </p>
        <div className="flex items-center justify-between rounded-[16px] border border-[#dddddd] px-4 py-3.5 text-[17px] font-semibold text-[#111111] md:text-[20px]">
          <span>{isLanguageMode ? copy.selectedKoEn : copy.selectedKoJa}</span>
          <ChevronDown
            className={cn(
              "size-5 text-[#777777] transition-transform",
              isLanguageMode && "rotate-180"
            )}
          />
        </div>
      </div>

      {isLanguageMode ? (
        <div className="overflow-hidden rounded-[18px] border border-[#dddddd] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
          {copy.languageOptions.map((option) => (
            <div
              key={option.label}
              className="flex items-center justify-between px-4 py-3.5 text-[17px] font-semibold text-[#111111] md:text-[20px]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span>{option.flag}</span>
                <span className="truncate">{option.label}</span>
                {option.beta && (
                  <span className="rounded-full border border-[#ffb04a] bg-[#fff5e8] px-2 py-0.5 text-[12px] font-bold text-[#f27600]">
                    {option.beta}
                  </span>
                )}
              </span>
              {option.selected && <Check className="size-5 text-[#111111]" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5">
          <div className="flex items-center justify-between rounded-[18px] border border-[#dddddd] px-5 py-4">
            <div>
              <p className="text-[17px] font-bold text-[#111111] md:text-[20px]">
                {copy.activationTitle}
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#777777] md:text-[15px]">
                {copy.activationDescription}
              </p>
            </div>
            <div className="h-9 w-[68px] rounded-full bg-[var(--brand)] p-1">
              <div className="ml-auto size-7 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.16)]" />
            </div>
          </div>
          <button className="rounded-[16px] bg-[#111111] px-5 py-3.5 text-[18px] font-bold text-white">
            {copy.create}
          </button>
          <button className="px-5 py-2 text-[16px] font-bold text-[#888888]">
            {copy.cancel}
          </button>
        </div>
      )}
    </div>
  )
}

function TranslationLivePreview({ copy }: { copy: TranslationValueVisualCopy }) {
  return (
    <div className="absolute inset-x-12 top-10 bottom-10 overflow-hidden rounded-[26px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
      <div className="h-full overflow-hidden px-5 py-5 text-[#111111]">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-[#ff8200] text-[18px] font-bold text-white">
            {copy.speakerInitial}
          </span>
          <span className="text-[18px] font-bold">{copy.speakerName}</span>
        </div>
        <div className="space-y-5">
          {copy.transcriptRows.map((row) => (
            <div key={row.target}>
              <p className="text-[14px] font-semibold text-[#777777]">
                {row.source}
              </p>
              <p className="mt-1 text-[19px] font-semibold leading-[1.25]">
                {row.middle}
              </p>
              <p className="mt-1 text-[19px] font-semibold leading-[1.25]">
                {row.target}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-[#5aa5ff] text-[16px] font-bold text-white">
            {copy.activeSpeakerInitial}
          </span>
          <span className="text-[16px] font-bold">{copy.activeSpeaker}</span>
          <span className="text-[14px] font-semibold text-[#777777]">
            {copy.activeTime}
          </span>
        </div>
        <div className="mt-3 rounded-[16px] bg-[#f3f3f3] p-4">
          <p className="text-[15px] font-semibold text-[#777777]">
            {copy.activeSource}
          </p>
        </div>
      </div>
    </div>
  )
}

function TranslationValuePreview({
  stepIndex,
  copy,
}: {
  stepIndex: number
  copy: TranslationValueVisualCopy
}) {
  return (
    <div className="relative min-h-[520px] overflow-hidden bg-[#777777] md:min-h-0">
      {stepIndex === 0 && <TranslationSetupModal copy={copy} mode="language" />}
      {stepIndex === 1 && <TranslationSetupModal copy={copy} mode="activation" />}
      {stepIndex === 2 && <TranslationLivePreview copy={copy} />}
    </div>
  )
}

function TranslationValueSection() {
  const locale = useLocale()
  const copy = getLocaleCopy(locale, translationPageCopy)
  const visualCopy = getLocaleCopy(locale, translationValueVisualCopy)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <Container className="section-gap">
      <div className="mb-6 max-w-[720px] md:mb-[30px]">
        <h2 className="text-h1 text-[var(--fg)]">
          {copy.valueTitle[0]}
          <br />
          {copy.valueTitle[1]}
        </h2>
      </div>
      <div className="overflow-hidden rounded-[var(--corner-feature)] bg-[var(--card)] md:grid md:min-h-[520px] md:grid-cols-[40%_60%]">
        <div className="flex flex-col p-6 md:justify-start md:p-10 md:pt-[68px]">
          <div className="flex flex-col">
            {copy.valueSteps.map((step, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="border-b border-[var(--border)] py-5 text-left last:border-b-0"
                >
                  <span
                    className={cn(
                      "text-[24px] font-bold leading-[1.25] transition-colors duration-200",
                      isActive ? "text-[var(--brand)]" : "text-[var(--fg)]"
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "grid text-[16px] leading-[1.55] transition-[grid-template-rows,opacity] duration-300",
                      isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <span className="overflow-hidden pt-3 text-[var(--fg)]">
                      {step.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <TranslationValuePreview stepIndex={activeIndex} copy={visualCopy} />
      </div>
    </Container>
  )
}

function FeatureCardsSection() {
  const copy = getLocaleCopy(useLocale(), translationPageCopy)

  return (
    <Container className="section-gap">
      <div className="flex flex-col" style={{ gap: "120px" }}>
        {copy.featureCards.map((card, index) => {
          const isEven = index % 2 === 0
          return (
            <article
              key={card.title}
              className="flex flex-col gap-[30px] md:flex-row md:items-end md:gap-[60px]"
            >
              <div
                className={cn(
                  "flex flex-1 flex-col gap-[10px] md:pb-8",
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
                <TranslationFeatureVisual type={card.visualType} />
              </div>
            </article>
          )
        })}
      </div>
    </Container>
  )
}

function TranslationFAQSection() {
  const copy = getLocaleCopy(useLocale(), translationPageCopy)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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

function TranslationCTASection() {
  const copy = getLocaleCopy(useLocale(), translationPageCopy)

  return (
    <Container>
      <div className="flex flex-col items-center gap-6 text-center md:gap-[30px]">
        <div className="flex max-w-[660px] flex-col items-center gap-4 text-[var(--fg)] md:gap-[20px]">
          <h2 className="text-h1">{copy.ctaTitle}</h2>
          <p className="text-[16px] leading-[24px]">{copy.ctaDescription}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="dark">{copy.primaryCta}</Button>
        </div>
      </div>
    </Container>
  )
}

export default function TranslationPage() {
  const copy = getLocaleCopy(useLocale(), translationPageCopy)

  return (
    <main className="page-layout-sub min-h-screen bg-[var(--bg)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] overflow-hidden">
        <Image
          src="/lingo/images/bg-home.jpg"
          alt=""
          fill
          sizes="100vw"
          className="size-full object-cover object-bottom"
        />
      </div>
      <div className="page-gutter w-full">
        <div className="container-main relative z-10 w-full">
          <div className="flex flex-col gap-5 md:gap-[20px]">
            <h1 className="text-h1 text-[var(--fg)]">
              {copy.heroTitle[0]}
              <br />
              {copy.heroTitle[1]}
            </h1>
          </div>
          <p className="body-md mt-5 max-w-[640px] text-[var(--fg)]">
            {copy.heroDescription[0]}
            <br />
            {copy.heroDescription[1]}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="outline">{copy.secondaryCta}</Button>
          </div>
        </div>
      </div>
      <TranslationValueSection />
      <FeatureCardsSection />
      <div className="section-gap">
        <TranslationFAQSection />
      </div>
      <div className="section-gap">
        <TranslationCTASection />
      </div>
      <div className="section-gap">
        <Footer />
      </div>
    </main>
  )
}
