"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale } from "@/lib/lingo/intl"
import { ChevronDown, PanelLeft } from "lucide-react"
import { cn } from "@/lib/lingo/utils"
import { Button } from "@/components/lingo/common/Button"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"

const LOCALES = [
  { code: "ja" as const, label: "日本語", flagImage: "/lingo/images/icon-Japan.png" },
]

const gnbCopy = {
  ko: {
    features: "기능",
    aiTranscription: "AI 전사",
    translation: "실시간 번역",
    aiNotes: "AI 노트",
    integrations: "연동",
    pricing: "요금",
    resources: "리소스",
    help: "Help / FAQ",
    releaseNote: "Release Note",
    getStarted: "Lingo 시작하기",
    selectLanguage: "언어 선택",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
  },
  en: {
    features: "Features",
    aiTranscription: "AI Transcription",
    translation: "Real-time Translation",
    aiNotes: "AI Notes",
    integrations: "Integrations",
    pricing: "Pricing",
    resources: "Resources",
    help: "Help / FAQ",
    releaseNote: "Release Note",
    getStarted: "Start Lingo",
    selectLanguage: "Select language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  ja: {
    features: "機能",
    aiTranscription: "AI文字起こし",
    translation: "リアルタイム翻訳",
    aiNotes: "AIノート",
    integrations: "連携",
    pricing: "料金",
    resources: "リソース",
    help: "Help / FAQ",
    releaseNote: "Release Note",
    getStarted: "Lingoを始める",
    selectLanguage: "言語を選択",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
  },
}

export function GNB() {
  const locale = useLocale()
  const copy = getLocaleCopy(locale, gnbCopy)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileClosing, setMobileClosing] = useState(false)
  const [mobileReady, setMobileReady] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
      if (
        featuresRef.current &&
        !featuresRef.current.contains(e.target as Node)
      ) {
        setFeaturesOpen(false)
      }
      if (
        resourcesRef.current &&
        !resourcesRef.current.contains(e.target as Node)
      ) {
        setResourcesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  const handleLocaleSwitch = () => {
    router.push("/lingo")
    setIsOpen(false)
  }

  const closeMobileMenu = () => {
    if (mobileClosing) return
    setMobileReady(false)
    setMobileClosing(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setMobileClosing(false)
      setMobileExpanded(null)
    }, 260)
  }

  const toggleMobileMenu = () => {
    if (mobileClosing) return
    if (mobileMenuOpen) {
      setMobileReady(false)
      setMobileClosing(true)
      setTimeout(() => {
        setMobileMenuOpen(false)
        setMobileClosing(false)
      }, 260)
    } else {
      setMobileMenuOpen(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMobileReady(true))
      })
    }
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 md:top-5">
      <div className="w-full px-[10px] md:px-[20px]">
        <nav className="gnb-surface mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between rounded-[var(--corner-fill)] px-4 py-2 md:h-16 md:px-[12px] md:py-[10px]">
          {/* 로고 */}
          <Link
            href="/lingo"
            prefetch={false}
            className="flex items-center gap-2 pl-1 md:gap-[10px] md:pl-[10px]"
          >
            <div className="relative size-6 overflow-hidden md:size-[28px]">
              <img
                src="/lingo/images/logo-symbol.png"
                alt="Lingo"
                className="size-full object-contain"
              />
            </div>
            <img
              src="/lingo/images/logo-text.svg"
              alt="Lingo"
              className="hidden h-6 w-auto md:block md:h-[28px] md:w-[66px]"
            />
          </Link>

          {/* 메뉴 */}
          <div className="hidden items-center gap-[30px] md:flex">
            {/* Features 드롭다운 */}
            <div
              className="relative"
              ref={featuresRef}
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={cn(
                  "gnb-menu-trigger body-sm flex cursor-pointer items-center gap-1 text-[var(--fg)]",
                  featuresOpen && "is-open"
                )}
              >
                {copy.features}
                <ChevronDown
                  className={cn(
                    "gnb-menu-chevron transition-transform duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    featuresOpen && "rotate-180"
                  )}
                />
              </button>
              {featuresOpen && (
                <div
                  className="gnb-popover-bridge absolute top-full left-0 origin-top-left pt-3"
                  style={{
                    animation:
                      "popover-in 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div className="gnb-popover flex w-fit flex-col gap-px rounded-[12px] p-2">
                    {[
                      {
                        label: copy.aiTranscription,
                        href: "/features/transcription",
                      },
                      { label: copy.aiNotes, href: "/features/ai-note" },
                      {
                        label: copy.translation,
                        href: "/features/translation",
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={`/lingo${item.href}`}
                        prefetch={false}
                        onClick={() => setFeaturesOpen(false)}
                        className="gnb-popover-item rounded-[12px] px-3 py-1 text-left"
                      >
                        <span className="body-sm whitespace-nowrap">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/lingo/integrations"
              prefetch={false}
              className="body-sm text-[var(--fg)]"
            >
              {copy.integrations}
            </Link>
            <Link
              href="/lingo/pricing"
              prefetch={false}
              className="body-sm text-[var(--fg)]"
            >
              {copy.pricing}
            </Link>

            {/* Resources 드롭다운 */}
            <div
              className="relative"
              ref={resourcesRef}
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={cn(
                  "gnb-menu-trigger body-sm flex cursor-pointer items-center gap-1 text-[var(--fg)]",
                  resourcesOpen && "is-open"
                )}
              >
                {copy.resources}
                <ChevronDown
                  className={cn(
                    "gnb-menu-chevron transition-transform duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    resourcesOpen && "rotate-180"
                  )}
                />
              </button>
              {resourcesOpen && (
                <div
                  className="gnb-popover-bridge absolute top-full left-0 origin-top-left pt-3"
                  style={{
                    animation:
                      "popover-in 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div className="gnb-popover flex w-fit flex-col gap-px rounded-[12px] p-2">
                    {[
                      { label: copy.help, href: "/resources/help" },
                      { label: copy.releaseNote, href: "/resources/release-note" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={`/lingo${item.href}`}
                        prefetch={false}
                        onClick={() => setResourcesOpen(false)}
                        className="gnb-popover-item rounded-[12px] px-3 py-1 text-left"
                      >
                        <span className="body-sm whitespace-nowrap">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            <Button variant="primary" size="sm">
              {copy.getStarted}
            </Button>

            {/* 언어 선택 (PC) */}
            <div
              className="relative hidden md:block"
              ref={popoverRef}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "gnb-locale-trigger flex cursor-pointer items-center gap-1 rounded-[var(--corner-fill)] px-2 py-2 text-[var(--fg)]",
                  isOpen && "is-open"
                )}
                aria-label={copy.selectLanguage}
              >
                <span className="size-5 overflow-hidden rounded-full">
                  <img
                    src={LOCALES.find((l) => l.code === locale)?.flagImage || ""}
                    alt=""
                    className="size-full object-cover"
                  />
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div
                  className="gnb-popover-bridge absolute top-full right-0 origin-top-right pt-2"
                  style={{
                    animation:
                      "popover-in 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div className="gnb-popover flex w-fit flex-col gap-px rounded-[12px] p-2">
                    {LOCALES.map((l) => (
                      <div
                        key={l.code}
                        className={cn(
                          "contents",
                          locale === l.code && "cursor-default"
                        )}
                      >
                        <button
                          onClick={() => handleLocaleSwitch()}
                          disabled={locale === l.code}
                          aria-current={locale === l.code ? "true" : undefined}
                          className={cn(
                            "gnb-popover-item flex items-center gap-2 rounded-[12px] px-3 py-1.5 text-left",
                            locale === l.code
                              ? "cursor-default bg-[var(--hover)]"
                              : "cursor-pointer"
                          )}
                        >
                          <span className="size-5 shrink-0 overflow-hidden rounded-full">
                            <img
                              src={l.flagImage}
                              alt=""
                              className="size-full object-cover"
                            />
                          </span>
                          <span className="body-sm whitespace-nowrap">
                            {l.label}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 모바일: 사이트맵 열기/닫기 */}
            <button
              className={cn(
                "md:hidden p-2 text-[var(--fg)] transition-colors",
                mobileMenuOpen && "bg-[var(--hover)] rounded-[var(--corner-fill)]"
              )}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? copy.closeMenu : copy.openMenu}
            >
              <PanelLeft className="size-5" />
            </button>
          </div>
        </nav>

        {/* 모바일 사이트맵 팝오버 */}
        {(mobileMenuOpen || mobileClosing) && (
          <div
            className={cn(
              "md:hidden relative z-50 mt-2 h-[calc(100dvh-5rem)] overflow-y-auto rounded-[16px] bg-[var(--white)] py-10 px-2.5 shadow-[var(--shadow-popover)] transition-transform duration-[260ms]",
              mobileClosing
                ? "translate-x-full ease-[cubic-bezier(0.22,1,0.36,1)]"
                : !mobileReady
                  ? "translate-x-full"
                  : "translate-x-0 ease-[cubic-bezier(0.22,1,0.36,1)]"
            )}
          >
            <div className="flex min-h-full flex-col">
              <div className="flex flex-col gap-8">
                {[
                  {
                    label: copy.features,
                    type: "group" as const,
                    items: [
                      { label: copy.aiTranscription, href: "/features/transcription" },
                      { label: copy.aiNotes, href: "/features/ai-note" },
                      { label: copy.translation, href: "/features/translation" },
                    ],
                  },
                  { label: copy.integrations, type: "link" as const, href: "/integrations" },
                  { label: copy.pricing, type: "link" as const, href: "/pricing" },
                  {
                    label: copy.resources,
                    type: "group" as const,
                    items: [
                      { label: copy.help, href: "/resources/help" },
                      { label: copy.releaseNote, href: "/resources/release-note" },
                    ],
                  },
                ].map((menu) => {
                  const isExpanded = mobileExpanded === menu.label
                  const hasSub = menu.type === "group"
                  return (
                    <div key={menu.label} className="flex flex-col items-start px-5">
                      {hasSub ? (
                        <button
                          className="inline-flex items-center gap-2 text-left text-h1 text-[var(--fg)]"
                          onClick={() =>
                            setMobileExpanded(isExpanded ? null : menu.label)
                          }
                        >
                          {menu.label}
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={`/lingo${menu.href}`}
                          prefetch={false}
                          className="inline-flex items-center text-h1 text-[var(--fg)]"
                          onClick={closeMobileMenu}
                        >
                          {menu.label}
                        </Link>
                      )}

                      {hasSub && (
                        <div
                          className="grid overflow-hidden transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                        >
                          <div className={cn("flex min-h-0 flex-col gap-[12px]", isExpanded && "pt-[16px] pb-4")}>
                            {menu.items!.map((item) => (
                              <Link
                                key={item.href}
                                href={`/lingo${item.href}`}
                                prefetch={false}
                                className="text-h3 text-[var(--fg)] transition-opacity duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                                style={{
                                  opacity: isExpanded ? 1 : 0,
                                }}
                                onClick={closeMobileMenu}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* 모바일: 하단 언어 선택 (아이콘 버튼 3개) */}
              <div className="mt-auto flex items-center justify-end gap-2 px-5 pb-5">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLocaleSwitch()}
                    className={cn(
                      "flex size-14 items-center justify-center transition-all",
                      locale === l.code
                        ? "rounded-[var(--corner-fill)] bg-[var(--hover)]"
                        : "rounded-full opacity-60 hover:opacity-100"
                    )}
                    aria-label={l.label}
                  >
                    <img src={l.flagImage} alt={l.label} className="size-8 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
