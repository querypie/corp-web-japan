"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Container } from "@/components/layout/lingo/Container"

const items = [
  {
    title: "Accuracy-first Voice Detection",
    description:
      "Automatically identifies who is speaking in the meeting. See at a glance who said what, making review faster and easier.",
    image: "/lingo/images/sub-thumb3a.png",
  },
  {
    title: "Speaker Diarization",
    description:
      "Segments audio by individual speakers so every insight is tied to the right person — no guessing, no manual tagging.",
    image: "/lingo/images/sub-thumb3b.png",
  },
  {
    title: "Domain Terminology Recognition",
    description:
      "Learns and accurately transcribes industry-specific vocabulary so technical discussions stay precise from start to finish.",
    image: "/lingo/images/sub-thumb3c.png",
  },
]

export function FeatureShowcaseSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setOpenIndex((prev) => (prev + 1) % items.length)
    }, 3000)
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startAutoPlay])

  const handleClick = (i: number) => {
    setOpenIndex(i)
    startAutoPlay()
  }

  return (
    <Container>
      <div className="flex items-stretch overflow-hidden rounded-[var(--corner-feature)] bg-[var(--card)]">
        {/* 좌측 아코디언 */}
        <div className="flex flex-1 flex-col px-6 md:px-10 py-10 md:py-10">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`border-b border-[var(--border)] last:border-b-0 py-[20px] first:pt-0 last:pb-0`}
              >
                <button
                  onClick={() => handleClick(i)}
                  className="w-full text-left"
                >
                  <h2
                    className={`text-h2 transition-colors duration-200 ${
                      isOpen ? "text-[var(--brand)]" : "text-[var(--fg)]"
                    }`}
                  >
                    {item.title}
                  </h2>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="body-sm pt-[10px] text-[var(--fg)]">
                      {item.description}
                    </p>
                    <div className="mt-4 overflow-hidden rounded-[var(--corner-feature)] md:hidden">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full aspect-[16/10] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 우측 썸네일 */}
        <div className="relative hidden h-[280px] w-full shrink-0 overflow-hidden md:block md:h-[480px] md:w-[600px]">
          {items.map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt=""
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
                openIndex === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
