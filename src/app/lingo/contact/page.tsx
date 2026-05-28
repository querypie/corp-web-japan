"use client"

import { SubHeroSection } from "@/components/sections/lingo/SubHeroSection"
import { CTASection } from "@/components/sections/lingo/CTASection"
import { Footer } from "@/components/layout/lingo/Footer"
import { Container } from "@/components/layout/lingo/Container"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"

const contactCopy = {
  ko: {
    heroTitle: ["문의가 필요하신가요?"],
    heroDescription: [
      "궁금한 점이 있거나 도움이 필요하다면 알려주세요.",
      "Lingo 팀이 필요한 내용을 확인해 도와드리겠습니다.",
    ],
    cards: [
      {
        title: "도입 문의",
        description:
          "팀 또는 엔터프라이즈 환경에서 Lingo 도입을 검토 중이라면 영업팀에 문의하세요.",
        email: "sales@querypie.com",
      },
      {
        title: "지원",
        description:
          "설정, 결제, 기술 이슈에 도움이 필요하다면 지원팀이 안내해드립니다.",
        email: "support@querypie.com",
      },
      {
        title: "파트너십",
        description:
          "Lingo와의 연동 또는 파트너십을 논의하고 싶다면 연락해주세요.",
        email: "partners@querypie.com",
      },
      {
        title: "언론 문의",
        description: "보도자료, 미디어 키트, 인터뷰 문의를 위한 연락처입니다.",
        email: "press@querypie.com",
      },
    ],
  },
  en: {
    heroTitle: ["Get in", "touch."],
    heroDescription: [
      "Have questions or need help?",
      "We are here to support you.",
    ],
    cards: [
      {
        title: "Sales inquiries",
        description:
          "Interested in Lingo for your team or enterprise? Reach out to our sales team.",
        email: "sales@querypie.com",
      },
      {
        title: "Support",
        description:
          "Need help with setup, billing, or technical issues? Our support team is standing by.",
        email: "support@querypie.com",
      },
      {
        title: "Partnerships",
        description:
          "Looking to integrate or partner with Lingo? We would love to hear from you.",
        email: "partners@querypie.com",
      },
      {
        title: "Press & media",
        description:
          "For press inquiries, media kits, and interview requests.",
        email: "press@querypie.com",
      },
    ],
  },
  ja: {
    heroTitle: ["お問い合わせ"],
    heroDescription: [
      "ご質問やサポートが必要な場合はお知らせください。",
      "Lingoチームが内容を確認してサポートします。",
    ],
    cards: [
      {
        title: "導入に関するお問い合わせ",
        description:
          "チームまたはエンタープライズ環境でLingoの導入を検討している場合は、営業チームにご連絡ください。",
        email: "sales@querypie.com",
      },
      {
        title: "サポート",
        description:
          "設定、請求、技術的な問題について支援が必要な場合は、サポートチームがご案内します。",
        email: "support@querypie.com",
      },
      {
        title: "パートナーシップ",
        description:
          "Lingoとの連携やパートナーシップについて相談したい場合はご連絡ください。",
        email: "partners@querypie.com",
      },
      {
        title: "報道関係のお問い合わせ",
        description: "プレス、メディアキット、インタビュー依頼に関する連絡先です。",
        email: "press@querypie.com",
      },
    ],
  },
}

export default function ContactPage() {
  const copy = getLocaleCopy(useLocale(), contactCopy)

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
                {copy.heroTitle[0]}
                {copy.heroTitle[1] && (
                  <>
                    <br />
                    {copy.heroTitle[1]}
                  </>
                )}
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

      {/* 연락처 섹션 */}
      <Container className="section-gap">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {copy.cards.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-[10px] rounded-[var(--corner-box)] bg-[var(--card)] p-[30px]"
            >
              <h3 className="text-h3 text-[var(--fg)]">{item.title}</h3>
              <p className="body-md text-[var(--fg)]">{item.description}</p>
              <a
                href={`mailto:${item.email}`}
                className="body-md text-[var(--brand)] hover:underline"
              >
                {item.email}
              </a>
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
