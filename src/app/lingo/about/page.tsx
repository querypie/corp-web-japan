"use client"

import { SubHeroSection } from "@/components/sections/lingo/SubHeroSection"
import { SubPageHeroBackground } from "@/components/sections/lingo/SubPageHeroBackground"
import { FeatureSection } from "@/components/sections/lingo/FeatureSection"
import { CTASection } from "@/components/sections/lingo/CTASection"
import { Footer } from "@/components/layout/lingo/Footer"
import { Container } from "@/components/layout/lingo/Container"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { componentNameDebugProps } from "@/lib/component-name-debug";

const aboutCopy = {
  ko: {
    heroTitle: ["사람을 연결하는", "도구를 만듭니다."],
    heroDescription: [
      "Lingo는 회의 안의 언어 장벽을 낮추기 위해 시작되었습니다.",
      "팀이 국경과 언어를 넘어 더 자연스럽게 협업하도록 돕습니다.",
    ],
    missionTitle: "우리의 미션",
    missionDescription: [
      "언어는 협업의 장벽이 되어서는 안 됩니다.",
      "우리는 맥락과 뉘앙스를 이해하고, 사람들이 대화 자체에 집중하도록 돕는 AI를 만듭니다.",
    ],
    cards: [
      {
        title: "정확도 우선",
        description: "전사와 번역 정확도를 가장 중요한 제품 기준으로 둡니다.",
      },
      {
        title: "처음부터 개인정보 보호",
        description: "사용자 데이터는 초기 설계부터 엔터프라이즈 수준의 보안 기준으로 보호됩니다.",
      },
      {
        title: "글로벌 팀을 위한 설계",
        description: "한국, 일본, 그 밖의 여러 지역에서 협업하는 다국어 팀을 위해 만듭니다.",
      },
    ],
  },
  en: {
    heroTitle: ["We build tools", "that connect people."],
    heroDescription: [
      "Lingo was founded to break language barriers in meetings.",
      "Our mission is to help teams communicate effortlessly across borders.",
    ],
    missionTitle: "Our mission",
    missionDescription: [
      "Language should never be a barrier to collaboration.",
      "We are building AI that understands context, respects nuance, and helps people focus on what matters: the conversation.",
    ],
    cards: [
      {
        title: "Accuracy first",
        description:
          "We prioritize transcription and translation accuracy above everything else.",
      },
      {
        title: "Privacy by design",
        description:
          "User data is protected with enterprise-grade security from day one.",
      },
      {
        title: "Global mindset",
        description:
          "Built for multilingual teams across Korea, Japan, and beyond.",
      },
    ],
  },
  ja: {
    heroTitle: ["人をつなぐ", "ツールをつくります。"],
    heroDescription: [
      "Lingoは会議の言語の壁を低くするために生まれました。",
      "チームが国境と言語を越えて、より自然に協業できるよう支援します。",
    ],
    missionTitle: "私たちのミッション",
    missionDescription: [
      "言語がコラボレーションの壁になってはいけません。",
      "私たちは文脈とニュアンスを理解し、人々が会話そのものに集中できるAIをつくっています。",
    ],
    cards: [
      {
        title: "精度を最優先",
        description: "文字起こしと翻訳の精度を、最も重要な製品基準にしています。",
      },
      {
        title: "プライバシーを前提に設計",
        description:
          "ユーザーデータは初日からエンタープライズレベルのセキュリティ基準で保護されます。",
      },
      {
        title: "グローバルチームのための設計",
        description: "韓国、日本、その他の地域で協業する多言語チームのために構築しています。",
      },
    ],
  },
}

export default function AboutPage() {
  const copy = getLocaleCopy(useLocale(), aboutCopy)

  return (
    <main {...componentNameDebugProps("AboutPage")} className="min-h-screen bg-[var(--bg)] page-layout-sub">
      <SubPageHeroBackground />

      <div className="w-full page-gutter">
        <div className="container-main relative z-10 w-full">
          <SubHeroSection
            title={
              <>
                {copy.heroTitle[0]}
                <br />
                {copy.heroTitle[1]}
              </>
            }
            description={
              <>
                {copy.heroDescription[0]}
                <br />
                {copy.heroDescription[1]}
              </>
            }
          />
        </div>
      </div>

      <FeatureSection
        rows={[
          {
            title: copy.missionTitle,
            description: (
              <>
                {copy.missionDescription[0]}
                <br />
                {copy.missionDescription[1]}
              </>
            ),
            imageSrc: "/lingo/images/sub-thumb1.png",
          },
        ]}
      />

      {/* 회사 소개 카드 */}
      <Container className="section-gap">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {copy.cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col gap-[10px] rounded-[var(--corner-box)] bg-[var(--card)] p-[30px]"
            >
              <h3 className="text-h3 text-[var(--fg)]">{card.title}</h3>
              <p className="body-md text-[var(--fg)]">{card.description}</p>
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
