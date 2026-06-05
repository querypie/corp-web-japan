"use client"

import { cn } from "@/lib/lingo/utils"
import { ArrowRight, PartyPopper, Sparkles, X } from "lucide-react"
import { useLocale } from "@/lib/lingo/intl"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import { componentNameDebugProps } from "@/lib/component-name-debug";

type ButtonVariant = "primary" | "dark" | "outline" | "text"
type ButtonSize = "lg" | "md" | "sm"

interface ButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  variant?: ButtonVariant
  size?: ButtonSize
}

const contactUrl = "/contact-us"

const readyModalCopy = {
  ko: {
    badge: "오픈 준비 중",
    title: "Lingo를 곧 만날 수 있어요.",
    description:
      "더 완성도 높은 경험으로 열기 위해 마지막 준비를 하고 있어요. 관심 있으신 분은 문의를 남겨주시면 출시 소식과 도입 상담을 가장 먼저 안내드릴게요.",
    cta: "Lingo 문의하기",
    close: "닫기",
  },
  en: {
    badge: "Getting ready",
    title: "Lingo is almost ready to open.",
    description:
      "We are putting the finishing touches on a smoother launch experience. Leave us a note and we will follow up with launch updates and adoption guidance.",
    cta: "Contact Lingo",
    close: "Close",
  },
  ja: {
    badge: "公開準備中",
    title: "Lingoはまもなく公開予定です。",
    description:
      "より完成度の高い体験でお届けするため、最後の準備を進めています。ご関心のある方はお問い合わせください。公開情報と導入相談をご案内します。",
    cta: "Lingoに問い合わせる",
    close: "閉じる",
  },
}

export function Button({
  children,
  className,
  href,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const locale = useLocale()
  const copy = getLocaleCopy(locale, readyModalCopy)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isText = variant === "text"
  const isOutline = variant === "outline"
  const isExternalHref =
    href?.startsWith("http://") || href?.startsWith("https://")

  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  const buttonClassName = cn(
    // 텍스트 버튼은 별도 베이스 없음
    !isText && [
      "inline-flex items-center justify-center rounded-[var(--corner-fill)] font-normal transition-[transform,background-color,box-shadow,border-color,color] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
      size === "lg" &&
        "min-h-12 px-6 py-3 body-lg md:min-h-[52px] md:px-7 md:py-3.5",
      size === "md" && "min-h-11 px-5 py-2.5 body-md md:px-[24px] md:py-[12px]",
      size === "sm" && "h-8 px-3 py-1.5 body-sm md:h-9 md:px-4 md:py-2",
    ],

    // variant별 색상/배경 (토큰 직접 사용)
    variant === "primary" &&
      "bg-[var(--brand)] text-[var(--white)] hover:bg-[#f2743d]",
    variant === "dark" &&
      "bg-[var(--black)] text-[var(--white)] hover:bg-[#333333]",
    variant === "outline" &&
      "bg-[var(--white)] text-[var(--fg)] hover:bg-[var(--hover)]",
    isOutline && "border border-[var(--border)]",
    variant === "text" &&
      "inline-flex items-center gap-[4px] body-sm text-[var(--fg)] transition-opacity duration-200 hover:opacity-70 group",

    className,
  )

  const content = (
    <>
      {children}
      {isText && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  )

  if (href) {
    return (
      <a {...componentNameDebugProps("Button")}
        href={href}
        target={isExternalHref ? "_blank" : undefined}
        rel={isExternalHref ? "noopener noreferrer" : undefined}
        className={buttonClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setIsModalOpen(true)}
      >
        {content}
      </button>

      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lingo-ready-modal-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsModalOpen(false)
              }
            }}
          >
            <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] bg-white p-6 text-center text-[var(--fg)] shadow-[0_28px_80px_rgba(0,0,0,0.18)] md:p-7">
              <button
                type="button"
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--fg)]"
                aria-label={copy.close}
                onClick={() => setIsModalOpen(false)}
              >
                <X className="size-5" />
              </button>

              <div className="mx-auto mb-6 flex size-10 items-center justify-center text-[var(--brand)]">
                <PartyPopper className="size-7" />
              </div>

              <div className="mb-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#fff3ec] px-3 py-1 text-[13px] font-medium text-[var(--brand)]">
                <Sparkles className="size-3.5" />
                {copy.badge}
              </div>

              <div className="flex flex-col items-center gap-3">
                <h2 id="lingo-ready-modal-title" className="text-h2">
                  {copy.title}
                </h2>
                <p className="body-sm max-w-[22rem] text-[var(--muted-foreground)]">
                  {copy.description}
                </p>
              </div>

              <div className="mt-7 flex justify-center">
                <a
                  href={contactUrl}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--corner-fill)] bg-[var(--brand)] px-5 py-2.5 body-md text-white transition-colors hover:bg-[#f2743d]"
                >
                  {copy.cta}
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
