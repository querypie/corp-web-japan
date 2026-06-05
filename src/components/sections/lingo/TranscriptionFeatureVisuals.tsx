"use client"

import Image from "next/image"
import { ChevronDown, Mic, Pause, X } from "lucide-react"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { cn } from "@/lib/lingo/utils"
import { componentNameDebugProps } from "@/lib/component-name-debug";

export type TranscriptionFeatureVisualType =
  | "speaker"
  | "voice"
  | "terms"
  | "multilingual"

interface TranscriptionFeatureVisualProps {
  type: TranscriptionFeatureVisualType
}

const screenshotByType: Record<TranscriptionFeatureVisualType, string> = {
  speaker: "/lingo/images/transcription/speaker-diarization.png",
  voice: "/lingo/images/transcription/voice-detection.png",
  terms: "/lingo/images/transcription/domain-terminology.png",
  multilingual: "/lingo/images/transcription/multilingual-transcription.png",
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
      className={cn(
        "relative h-full w-full overflow-hidden",
        tone === "blue" ? "bg-[#EEF5FD]" : "bg-[#F1E9F8]"
      )}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}

function ProductFrame({
  type,
  className,
  imageClassName,
}: {
  type: TranscriptionFeatureVisualType
  className: string
  imageClassName?: string
}) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-[22px] border border-[#e8e8e8] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      <Image
        src={screenshotByType[type]}
        alt=""
        fill
        sizes="(min-width: 768px) 520px, 88vw"
        className={cn("object-cover", imageClassName)}
      />
    </div>
  )
}

const transcriptionVisualCopy = {
  ko: {
    sharedSession: "공유 세션",
    meetingTitle: "제품 리뷰 회의",
    ongoing: "진행 중",
    now: "방금",
    pause: "일시정지",
    microphone: "MacBook Pro 마이크",
    quit: "종료",
    nav: ["홈", "회의", "캘린더", "사용자화", "설정"],
    customization: "사용자화",
    myKeywords: "나의 키워드",
    keywordHelp:
      "제품명과 고유명사처럼 자주 쓰는 키워드를 추가해 인식 정확도를 높입니다.",
    add: "추가",
    keywordPending: "1개 키워드가 추가됩니다",
    keywordCount: "4개 키워드 · 96 / 100 남음",
    languages: ["한국어", "English", "日本語"],
    speakerRows: [
      {
        initial: "A",
        name: "Alice",
        color: "bg-[#8aa0bf]",
        text: "이번 분기 온보딩 흐름에서 사용자가 가장 많이 멈추는 지점을 먼저 확인해보겠습니다.",
      },
      {
        initial: "B",
        name: "Bob",
        color: "bg-[#ee5ab9]",
        text: "결제 전환 단계보다 초대 메일을 열고 나서 이탈하는 비율이 더 높았습니다.",
      },
      {
        initial: "C",
        name: "Chris",
        color: "bg-[#4a9af0]",
        text: "워크스페이스가 생성되기 전에 활성화 이벤트가 발생하는지도 같이 확인할 수 있을까요?",
      },
    ],
  },
  en: {
    sharedSession: "Shared Session",
    meetingTitle: "Product Review Sync",
    ongoing: "ONGOING",
    now: "now",
    pause: "Pause",
    microphone: "MacBook Pro microphone",
    quit: "Quit",
    nav: ["Home", "Meetings", "Calendar", "Customization", "Settings"],
    customization: "Customization",
    myKeywords: "My keywords",
    keywordHelp:
      "Add product names and proper nouns to improve recognition accuracy.",
    add: "Add",
    keywordPending: "1 keyword will be added",
    keywordCount: "4 keywords · 96 / 100 remaining",
    languages: ["Korean", "English", "Japanese"],
    speakerRows: [
      {
        initial: "A",
        name: "Alice",
        color: "bg-[#8aa0bf]",
        text: "Let's first review where users most often stop in this quarter's onboarding flow.",
      },
      {
        initial: "B",
        name: "Bob",
        color: "bg-[#ee5ab9]",
        text: "The drop-off after opening the invitation email was higher than the payment conversion step.",
      },
      {
        initial: "C",
        name: "Chris",
        color: "bg-[#4a9af0]",
        text: "Can we also check whether activation happens before the workspace is created?",
      },
    ],
  },
  ja: {
    sharedSession: "共有セッション",
    meetingTitle: "プロダクトレビュー会議",
    ongoing: "進行中",
    now: "たった今",
    pause: "一時停止",
    microphone: "MacBook Proマイク",
    quit: "終了",
    nav: ["ホーム", "会議", "カレンダー", "カスタマイズ", "設定"],
    customization: "カスタマイズ",
    myKeywords: "マイキーワード",
    keywordHelp:
      "製品名や固有名詞など、よく使うキーワードを追加して認識精度を高めます。",
    add: "追加",
    keywordPending: "1件のキーワードが追加されます",
    keywordCount: "4件のキーワード · 残り96 / 100",
    languages: ["韓国語", "English", "日本語"],
    speakerRows: [
      {
        initial: "A",
        name: "Alice",
        color: "bg-[#8aa0bf]",
        text: "今四半期のオンボーディングで、ユーザーが最も止まる箇所を確認します。",
      },
      {
        initial: "B",
        name: "Bob",
        color: "bg-[#ee5ab9]",
        text: "決済転換よりも、招待メールを開いた後の離脱率が高くなっています。",
      },
      {
        initial: "C",
        name: "Chris",
        color: "bg-[#4a9af0]",
        text: "ワークスペース作成前にアクティベーションが発生しているかも確認できますか？",
      },
    ],
  },
}

function SpeakerRow({
  row,
  now,
}: {
  row: (typeof transcriptionVisualCopy)["ko"]["speakerRows"][number]
  now: string
}) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={cn(
            "grid size-5 place-items-center rounded-full text-[11px] font-bold text-white",
            row.color
          )}
        >
          {row.initial}
        </span>
        <span className="text-[14px] font-bold text-[#171717]">{row.name}</span>
        <span className="text-[11px] font-medium text-[#a3a3a3]">{now}</span>
      </div>
      <p className="truncate text-[13px] leading-[1.35] text-[#5f5f5f]">
        {row.text}
      </p>
    </div>
  )
}

function SpeakerVisual() {
  const copy = getLocaleCopy(useLocale(), transcriptionVisualCopy)

  return (
    <VisualStage tone="blue">
      <div className="absolute top-[8%] left-[8%] h-[84%] w-[88%] overflow-hidden rounded-[22px] border border-[#e8e8e8] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.12)] max-md:top-[30px] max-md:left-[40px] max-md:h-[140%] max-md:w-[150%] max-md:origin-top-left max-md:scale-[0.8] md:top-[60px] md:left-[80px] md:h-[112%] md:w-[100%]">
        <div className="border-b border-[#eeeeee] px-5 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-[17px] font-bold text-[#111111]">
                Lingo
              </span>
            </div>
            <span className="rounded-full border border-[#e5e5e5] px-3 py-1 text-[11px] font-semibold text-[#777777]">
              {copy.sharedSession}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h4 className="text-[17px] font-bold text-[#111111]">
              {copy.meetingTitle}
            </h4>
            <span className="rounded-full bg-[#ffebef] px-2 py-1 text-[10px] font-bold text-[#ff244b]">
              {copy.ongoing}
            </span>
          </div>
        </div>
        <div className="grid gap-2.5 bg-[#fbfbfb] p-4">
          {copy.speakerRows.map((row) => (
            <SpeakerRow key={row.name} row={row} now={copy.now} />
          ))}
        </div>
      </div>
    </VisualStage>
  )
}

function VoiceVisual() {
  const copy = getLocaleCopy(useLocale(), transcriptionVisualCopy)

  return (
    <VisualStage tone="lavender">
      <div className="absolute top-[20%] left-[7%] h-[60%] w-[86%] overflow-hidden rounded-[22px] border border-[#e8e8e8] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.12)] max-md:top-[30px] max-md:left-[40px] max-md:h-[120%] max-md:w-[150%] max-md:origin-top-left max-md:scale-[0.8]">
        <div className="flex h-full flex-col justify-center border-y border-[#eeeeee] px-5">
          <div className="grid min-w-0 grid-cols-[0.92fr_2fr_0.92fr] items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="grid size-[92px] place-items-center rounded-full border-4 border-[#31dc75] bg-[#f7fff9] shadow-[0_0_0_10px_rgba(49,220,117,0.16)]">
                <Pause className="size-10 fill-[#111111] text-[#111111]" />
              </div>
              <span className="mt-4 text-[20px] font-semibold text-[#777777]">
                {copy.pause}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-[92px] w-full items-center justify-center gap-4 rounded-full border border-[#e0e0e0] bg-white px-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
                <Mic className="size-9 text-[#111111]" />
                <ChevronDown className="size-5 text-[#777777]" />
                <div className="flex h-11 items-center gap-1.5">
                  {[28, 32, 36, 38, 40, 38, 34, 28, 22, 18].map(
                    (height, index) => (
                      <span
                        key={index}
                        className={cn(
                          "w-1.5 rounded-full",
                          index < 7 ? "bg-[#20d968]" : "bg-[#d8d8d8]"
                        )}
                        style={{ height }}
                      />
                    )
                  )}
                </div>
              </div>
              <span className="mt-4 text-center text-[20px] font-semibold text-[#777777]">
                {copy.microphone}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="grid size-[92px] place-items-center rounded-full bg-[#ef0010] shadow-[0_18px_48px_rgba(239,0,16,0.24)]">
                <X className="size-11 text-white" strokeWidth={2.8} />
              </div>
              <span className="mt-4 text-[20px] font-semibold text-[#777777]">
                {copy.quit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </VisualStage>
  )
}

function LogoMark() {
  return (
    <div className="relative h-[22px] w-[30px] shrink-0">
      <span className="absolute top-[2px] left-0 h-[18px] w-[18px] rounded-full bg-[#e25a25]" />
      <span className="absolute top-0 right-[2px] h-[20px] w-[18px] rounded-full bg-[#9478c7]" />
      <span className="absolute top-[2px] left-[12px] h-[18px] w-[8px] rounded-full bg-[#7b352d]" />
    </div>
  )
}

function CustomizationScreenshot() {
  const copy = getLocaleCopy(useLocale(), transcriptionVisualCopy)

  return (
    <div className="absolute top-[7%] left-[8%] grid h-[82%] w-[88%] overflow-hidden rounded-[22px] border border-[#e8e8e8] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.12)] max-md:top-[30px] max-md:left-[40px] max-md:h-[140%] max-md:w-[150%] max-md:origin-top-left max-md:scale-[0.8] md:top-[60px] md:left-[80px] md:h-[112%] md:w-[100%] md:grid-cols-[31%_69%]">
      <aside className="hidden border-r border-[#e5e5e5] bg-[#fbfbfb] md:block">
        <div className="flex h-[56px] items-center gap-2 border-b border-[#e5e5e5] px-4">
          <LogoMark />
          <span className="text-[22px] font-bold tracking-[-0.02em] text-[#111111]">
            Lingo
          </span>
        </div>
        <nav className="grid gap-1 p-3 text-[13px] font-bold text-[#222222]">
          {copy.nav.map(
            (item) => (
              <div
                key={item}
                className={cn(
                  "rounded-[12px] px-3 py-2",
                  item === copy.customization && "bg-[#f3f3f3]"
                )}
              >
                {item}
              </div>
            )
          )}
        </nav>
      </aside>
      <section className="min-w-0 p-4">
        <h4 className="mb-2.5 text-[20px] leading-none font-bold tracking-[-0.02em] text-[#111111]">
          {copy.customization}
        </h4>
        <div className="mb-2.5 rounded-[12px] border border-[#e5e5e5] bg-white p-1.5">
          <div className="rounded-[10px] bg-[#e95b00] py-1.5 text-center text-[12px] font-bold text-white">
            {copy.myKeywords}
          </div>
        </div>
        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-3">
          <p className="mb-2 text-[10px] leading-[1.25] font-semibold text-[#777777]">
            {copy.keywordHelp}
          </p>
          <div className="mb-2 flex gap-2">
            <div className="flex h-7 flex-1 items-center rounded-[9px] border-2 border-[#9e9e9e] px-3 text-[12px] text-[#111111]">
              Lingo
            </div>
            <div className="grid h-7 w-11 place-items-center rounded-[9px] bg-[#111111] text-[11px] font-bold text-white">
              {copy.add}
            </div>
          </div>
          <p className="mb-1 text-[9px] font-semibold text-[#777777]">
            {copy.keywordPending}
          </p>
          <span className="inline-flex rounded-full border border-dashed border-[#999999] px-2 py-0.5 text-[9px] font-semibold text-[#111111]">
            Lingo
          </span>
          <p className="mt-2 mb-1.5 text-[12px] font-extrabold text-[#555555]">
            {copy.keywordCount}
          </p>
          <div className="flex flex-wrap gap-1.5 rounded-[14px] bg-[#fff7ef] p-2 ring-1 ring-[#e95b00]/12">
            {["AIP", "QueryPie", "MCP", "Brant"].map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[#e95b00]/18 bg-white px-2.5 py-1 text-[11px] font-medium text-[#111111] shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
              >
                {keyword}
                <span className="ml-2 text-[#e95b00]">×</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function TermsVisual() {
  return (
    <VisualStage tone="blue">
      <CustomizationScreenshot />
    </VisualStage>
  )
}

function MultilingualVisual() {
  const copy = getLocaleCopy(useLocale(), transcriptionVisualCopy)

  return (
    <VisualStage tone="lavender">
      <ProductFrame
        type="multilingual"
        className="top-[8%] left-[11%] h-[82%] w-[78%] max-md:top-[30px] max-md:left-[40px] max-md:h-[140%] max-md:w-[140%] md:top-[60px] md:left-[80px] md:h-[112%] md:w-[96%]"
        imageClassName="object-left-top"
      />
      <div className="absolute bottom-[9%] left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/94 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
        {copy.languages.map((language) => (
          <span
            key={language}
            className="rounded-full border border-[#e25a25]/20 bg-[#e25a25]/10 px-3 py-1.5 text-[12px] font-semibold text-[#c94d1e]"
          >
            {language}
          </span>
        ))}
      </div>
    </VisualStage>
  )
}

export function TranscriptionFeatureVisual({
  type,
}: TranscriptionFeatureVisualProps) {
  if (type === "speaker") return <SpeakerVisual {...componentNameDebugProps("TranscriptionFeatureVisual")} />
  if (type === "voice") return <VoiceVisual {...componentNameDebugProps("TranscriptionFeatureVisual")} />
  if (type === "terms") return <TermsVisual {...componentNameDebugProps("TranscriptionFeatureVisual")} />
  return <MultilingualVisual {...componentNameDebugProps("TranscriptionFeatureVisual")} />
}
