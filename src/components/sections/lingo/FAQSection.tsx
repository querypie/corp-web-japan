"use client"

import { useState } from "react"
import { useTranslations } from "@/lib/lingo/intl"
import { cn } from "@/lib/lingo/utils"
import { Container } from "@/components/layout/lingo/Container"

interface FAQSectionProps {
  namespace?: string
}

export function FAQSection({ namespace = "faq" }: FAQSectionProps) {
  const t = useTranslations(namespace)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [pressedIndex, setPressedIndex] = useState<number | null>(null)

  const faqs = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-4 md:gap-[20px]">
        <h2 className="text-h1 text-[var(--fg)]">{t("title")}</h2>
        <div className="flex flex-col gap-[10px]">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="group rounded-[var(--corner-box)] bg-[var(--card)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex((current) => (current === i ? null : i))}
                onPointerDown={() => setPressedIndex(i)}
                onPointerUp={() => setPressedIndex(null)}
                onPointerLeave={() => setPressedIndex(null)}
                onPointerCancel={() => setPressedIndex(null)}
                aria-expanded={openIndex === i}
                className={cn(
                  "flex w-full transform-gpu cursor-pointer items-center justify-between gap-4 p-5 text-left will-change-transform transition-transform duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-[30px]",
                  pressedIndex === i && "scale-[0.985]"
                )}
              >
                <span className="body-md text-[var(--fg)]">{faq.question}</span>
                <div className="relative size-[14px] shrink-0 md:size-[16px]">
                  {/* 수직선 */}
                  <div
                    className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-[var(--fg)] transition-transform duration-360 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      openIndex === i ? "rotate-90" : ""
                    }`}
                  />
                  {/* 가로선 */}
                  <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[var(--fg)]" />
                </div>
              </button>
              <div
                className={`grid px-5 transition-[grid-template-rows] duration-420 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-[30px] ${
                  openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`body-md text-[var(--mute)] transition-[transform,opacity,padding] duration-320 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      openIndex === i
                        ? "translate-y-0 pb-5 opacity-100 md:pb-[30px]"
                        : "-translate-y-2 pb-0 opacity-0"
                    }`}
                  >
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
