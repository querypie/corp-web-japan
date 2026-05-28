"use client"

import { CTASection } from "@/components/sections/lingo/CTASection"
import { Container } from "@/components/layout/lingo/Container"
import { Footer } from "@/components/layout/lingo/Footer"
import { SubHeroSection } from "@/components/sections/lingo/SubHeroSection"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"

const releaseNoteCopy = {
  ko: {
    description: "2026년 5월 27일, Lingo 1.0.0을 프로덕션에 최초 공개합니다.",
    highlights: [
      {
        title: "실시간 전사와 번역",
        items: [
          "대면 회의와 원격 회의를 모두 지원하는 고정확도 AI 전사",
          "회의 흐름을 따라가는 다국어 실시간 번역",
          "참석자별 발화를 구분하는 화자 분리",
        ],
      },
      {
        title: "회의 기록과 AI 노트",
        items: [
          "회의 내용을 요약하고 핵심 논의와 액션 아이템을 정리하는 Lingo AI 노트",
          "회의 후 바로 공유할 수 있는 기록 내보내기",
          "QR 및 링크 기반 회의 기록 공유",
        ],
      },
      {
        title: "캘린더와 자동 참여",
        items: [
          "캘린더 연동을 통한 회의 일정 확인",
          "원격 회의 자동 참여 지원",
          "반복 회의에서도 일관된 기록 워크플로우 제공",
        ],
      },
      {
        title: "AIP 기반 운영",
        items: ["AIP 계정 기반 로그인", "조직 단위 관리", "AIP 크레딧 사용량 기록 확인"],
      },
    ],
  },
  en: {
    description: "On May 27, 2026, Lingo 1.0.0 launches as the first production release.",
    highlights: [
      {
        title: "Real-time transcription and translation",
        items: [
          "High-accuracy AI transcription for in-person and remote meetings",
          "Real-time multilingual translation that follows meeting flow",
          "Speaker diarization that separates each participant's speech",
        ],
      },
      {
        title: "Meeting records and AI notes",
        items: [
          "Lingo AI Notes that summarize key discussions and action items",
          "Meeting record export after the session",
          "QR and link-based sharing for meeting records",
        ],
      },
      {
        title: "Calendar and auto-join",
        items: [
          "Meeting schedule detection through calendar integration",
          "Auto-join support for remote meetings",
          "Consistent recording workflows for recurring meetings",
        ],
      },
      {
        title: "AIP-based operations",
        items: ["AIP account-based login", "Organization-level management", "AIP credit usage history"],
      },
    ],
  },
  ja: {
    description: "2026年5月27日、Lingo 1.0.0をプロダクションに初公開します。",
    highlights: [
      {
        title: "リアルタイム文字起こしと翻訳",
        items: [
          "対面会議とリモート会議に対応する高精度AI文字起こし",
          "会議の流れに沿った多言語リアルタイム翻訳",
          "参加者ごとの発話を区別する話者分離",
        ],
      },
      {
        title: "会議記録とAIノート",
        items: [
          "主要な議論とアクションアイテムを整理するLingo AIノート",
          "会議後すぐに共有できる記録エクスポート",
          "QRとリンクによる会議記録共有",
        ],
      },
      {
        title: "カレンダーと自動参加",
        items: [
          "カレンダー連携による会議予定の確認",
          "リモート会議への自動参加サポート",
          "定例会議でも一貫した記録ワークフローを提供",
        ],
      },
      {
        title: "AIPベースの運用",
        items: ["AIPアカウントベースのログイン", "組織単位の管理", "AIPクレジット利用履歴の確認"],
      },
    ],
  },
}

export default function ReleaseNotePage() {
  const copy = getLocaleCopy(useLocale(), releaseNoteCopy)

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
            title="Release Note"
            description={copy.description}
          />
        </div>
      </div>

      {/* 릴리스 노트 */}
      <Container className="section-gap">
        <article className="rounded-[var(--corner-box)] bg-[var(--card)] p-6 md:p-[34px]">
          <div className="border-b border-[var(--line)] pb-7">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-h2 text-[var(--fg)]">v1.0.0</h2>
              <span className="body-md text-[var(--mute)]">2026.05.27</span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {copy.highlights.map((section) => (
              <section key={section.title} className="flex flex-col gap-4">
                <h3 className="text-h3 text-[var(--fg)]">{section.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="body-md flex items-start gap-2.5 text-[var(--fg)]"
                    >
                      <span className="mt-[2px] text-[var(--brand)]">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </Container>

      <div className="section-gap">
        <CTASection />
      </div>
      <div className="section-gap">
        <Footer />
      </div>
    </main>
  )
}
