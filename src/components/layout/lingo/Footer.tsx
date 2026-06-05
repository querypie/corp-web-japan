"use client"

import Link from "next/link"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { CookieSettingsButton } from "@/components/layout/lingo/CookieSettingsButton"

type FooterLocale = "en" | "ko" | "ja"

const queryPieLinks = {
  en: {
    about: "https://querypie.ai/about-us",
    contact: "https://querypie.ai/contact-us",
    terms: "https://querypie.ai/terms-of-service",
    privacy: "https://querypie.ai/privacy-policy",
    eula: "https://querypie.ai/eula",
  },
  ko: {
    about: "https://querypie.ai/about-us",
    contact: "https://querypie.ai/contact-us",
    terms: "https://querypie.ai/terms-of-service",
    privacy: "https://querypie.ai/privacy-policy",
    eula: "https://querypie.ai/eula",
  },
  ja: {
    about: "https://querypie.ai/about-us",
    contact: "https://querypie.ai/contact-us",
    terms: "https://querypie.ai/terms-of-service",
    privacy: "https://querypie.ai/privacy-policy",
    eula: "https://querypie.ai/eula",
  },
} satisfies Record<FooterLocale, Record<string, string>>

const footerLabels = {
  en: {
    product: "Product",
    resources: "Resources",
    company: "Company",
    aiTranscription: "AI Transcription",
    translation: "Real-time Translation",
    aiNotes: "AI Notes",
    pricing: "Pricing",
    integrations: "Integrations",
    help: "Help / FAQ",
    releaseNote: "Release Note",
    about: "About",
    contact: "Contact",
    cookie: "Cookie Preference",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    eula: "EULA",
  },
  ko: {
    product: "제품",
    resources: "리소스",
    company: "회사",
    aiTranscription: "AI 전사",
    translation: "실시간 번역",
    aiNotes: "AI 노트",
    pricing: "요금",
    integrations: "연동",
    help: "Help / FAQ",
    releaseNote: "Release Note",
    about: "About",
    contact: "Contact",
    cookie: "Cookie Preference",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    eula: "EULA",
  },
  ja: {
    product: "製品",
    resources: "リソース",
    company: "会社",
    aiTranscription: "AI文字起こし",
    translation: "リアルタイム翻訳",
    aiNotes: "AIノート",
    pricing: "料金",
    integrations: "連携",
    help: "Help / FAQ",
    releaseNote: "Release Note",
    about: "About",
    contact: "Contact",
    cookie: "Cookie Preference",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    eula: "EULA",
  },
} satisfies Record<FooterLocale, Record<string, string>>

export function Footer() {
  const locale = useLocale()
  const footerLocale = (
    ["en", "ko", "ja"].includes(locale) ? locale : "en"
  ) as FooterLocale
  const externalLinks = queryPieLinks[footerLocale]
  const labels = getLocaleCopy(locale, footerLabels)

  const productLinks = [
    { label: labels.aiTranscription, href: "/features/transcription" },
    { label: labels.aiNotes, href: "/features/ai-note" },
    { label: labels.translation, href: "/features/translation" },
    { label: labels.pricing, href: "/pricing" },
    { label: labels.integrations, href: "/integrations" },
  ]

  const resourceLinks = [
    { label: labels.help, href: "/resources/help" },
    { label: labels.releaseNote, href: "/resources/release-note" },
  ]

  const companyLinks = [
    { label: labels.about, href: externalLinks.about },
    { label: labels.contact, href: externalLinks.contact },
  ]

  const legalLinks = [
    { label: labels.terms, href: externalLinks.terms },
    { label: labels.privacy, href: externalLinks.privacy },
    { label: labels.eula, href: externalLinks.eula },
  ]

  return (
    <footer className="w-full bg-[var(--black)]">
      <div className="page-gutter w-full">
        <div className="mx-auto w-full max-w-[1000px]">
          {/* 사이트맵 */}
          <div className="pt-11 pb-8 md:pt-[60px] md:pb-10">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-[60px]">
              {/* Product */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[14px] leading-[20px] font-semibold text-[var(--white)] md:text-[15px]">
                  {labels.product}
                </h3>
                <div className="flex flex-col gap-[10px]">
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={`/lingo${link.href}`}
                      prefetch={false}
                      className="text-[13px] leading-[18px] text-[var(--mute)] transition-colors hover:text-[var(--white)] md:text-[14px] md:leading-[20px]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[14px] leading-[20px] font-semibold text-[var(--white)] md:text-[15px]">
                  {labels.resources}
                </h3>
                <div className="flex flex-col gap-[10px]">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={`/lingo${link.href}`}
                      prefetch={false}
                      className="text-[13px] leading-[18px] text-[var(--mute)] transition-colors hover:text-[var(--white)] md:text-[14px] md:leading-[20px]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[14px] leading-[20px] font-semibold text-[var(--white)] md:text-[15px]">
                  {labels.company}
                </h3>
                <div className="flex flex-col gap-[10px]">
                  {companyLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] leading-[18px] text-[var(--mute)] transition-colors hover:text-[var(--white)] md:text-[14px] md:leading-[20px]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 리걸 바 */}
          <div className="flex flex-col gap-3 pt-4 pb-[44px] md:pb-[60px]">
            <div className="body-sm flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-[20px]">
              <span className="text-[var(--white)]">Powered by AIP</span>
              <CookieSettingsButton className="cursor-pointer text-left text-[var(--mute)] hover:text-[var(--white)] hover:underline">
                {labels.cookie}
              </CookieSettingsButton>
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--mute)] hover:text-[var(--white)] hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="body-sm text-[var(--white)]">
              &copy; 2026 QueryPie, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
