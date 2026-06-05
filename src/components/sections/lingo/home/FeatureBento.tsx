"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "@/lib/lingo/intl"
import { Container } from "@/components/layout/lingo/Container"
import { cn } from "@/lib/lingo/utils"
import {
  splitIntoUnits,
  splitIntoChunks,
  splitIntoSentences,
  joinUnits,
} from "@/lib/lingo/textSplitter"


export function LiveTranslationLines({
  source,
  sourceLocale,
  target,
  targetLocale,
  className = "",
  sourceDelay = 0,
  sourceInterval = 180,
  targetInterval = 170,
  sourceChunkSize,
  targetChunkSize,
  onTargetComplete,
}: {
  source: string
  sourceLocale: string
  target: string
  targetLocale: string
  className?: string
  sourceDelay?: number
  sourceInterval?: number
  targetInterval?: number
  sourceChunkSize?: number
  targetChunkSize?: number
  onTargetComplete?: () => void
}) {
  const sourceUnits = useMemo(
    () =>
      sourceChunkSize && sourceLocale === "ja"
        ? splitIntoChunks(source, sourceChunkSize)
        : splitIntoUnits(source, sourceLocale),
    [source, sourceLocale, sourceChunkSize]
  )
  const targetSentences = useMemo(() => splitIntoSentences(target), [target])

  const [sourceIndex, setSourceIndex] = useState(0)
  const [targetIndex, setTargetIndex] = useState(0)
  const [showTargetLoader, setShowTargetLoader] = useState(false)

  useEffect(() => {
    let sourceTimer: ReturnType<typeof setInterval> | undefined
    let targetTimer: ReturnType<typeof setInterval> | undefined

    /* eslint-disable react-hooks/set-state-in-effect */
    setSourceIndex(0)
    setTargetIndex(0)
    setShowTargetLoader(false)
    /* eslint-enable react-hooks/set-state-in-effect */

    const sourceTimeout = setTimeout(() => {
      let current = 0
      sourceTimer = setInterval(() => {
        current += 1
        setSourceIndex(current)

        if (current >= sourceUnits.length && sourceTimer) {
          clearInterval(sourceTimer)
        }
      }, sourceInterval)
    }, sourceDelay)

    const targetStartDelay = sourceDelay + sourceUnits.length * sourceInterval

    const targetLoaderTimeout = setTimeout(() => {
      setShowTargetLoader(true)
    }, sourceDelay)

    const targetTimeout = setTimeout(() => {
      setShowTargetLoader(false)
      let current = 0
      targetTimer = setInterval(() => {
        current += 1
        setTargetIndex(current)

        if (current >= targetSentences.length) {
          if (targetTimer) {
            clearInterval(targetTimer)
          }
          onTargetComplete?.()
        }
      }, targetInterval)
    }, targetStartDelay)

    return () => {
      clearTimeout(sourceTimeout)
      clearTimeout(targetTimeout)
      clearTimeout(targetLoaderTimeout)
      if (sourceTimer) clearInterval(sourceTimer)
      if (targetTimer) clearInterval(targetTimer)
    }
  }, [
    sourceUnits,
    targetSentences,
    sourceDelay,
    sourceInterval,
    targetInterval,
    onTargetComplete,
  ])

  return (
    <div className={`flex flex-col gap-[8px] ${className}`}>
      <p className="feature-typed-text feature-typed-text-source text-[11px] leading-[16px] text-[var(--fg)] md:text-[14px] md:leading-[20px]">
        {sourceUnits.slice(0, sourceIndex).map((unit, index) => (
          <span
            key={`source-${index}-${unit}`}
            className={cn(
              "feature-typed-unit",
              index === sourceIndex - 1 && "feature-typed-unit-new"
            )}
          >
            {index > 0 && sourceLocale !== "ja" ? " " : ""}
            {unit}
          </span>
        ))}
      </p>
      <div className="feature-typed-text feature-typed-text-target body-md text-[var(--fg)]">
        {showTargetLoader ? (
          <span className="feature-translation-loader" aria-hidden="true">
            ✦
          </span>
        ) : (
          <span>
            {targetSentences.slice(0, targetIndex).map((unit, index) => (
              <span
                key={`target-${index}-${unit}`}
                className={cn(
                  "feature-typed-unit",
                  index === targetIndex - 1 && "feature-typed-unit-new"
                )}
              >
                {index > 0 ? "\n" : ""}
                {unit}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  )
}

export function FeatureBento() {
  const t = useTranslations()
  const locale = useLocale()
  const [animationCycle, setAnimationCycle] = useState(0)
  const [isFirstBubbleVisible, setIsFirstBubbleVisible] = useState(false)
  const [isSecondBubbleVisible, setIsSecondBubbleVisible] = useState(false)
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const [card1Visible, setCard1Visible] = useState(false)
  const card2Ref = useRef<HTMLDivElement>(null)
  const [card2Visible, setCard2Visible] = useState(false)
  const card3Ref = useRef<HTMLDivElement>(null)
  const [card3Visible, setCard3Visible] = useState(false)
  const card4Ref = useRef<HTMLDivElement>(null)
  const [card4Visible, setCard4Visible] = useState(false)
  const card5Ref = useRef<HTMLDivElement>(null)
  const [card5Visible, setCard5Visible] = useState(false)
  const card6Ref = useRef<HTMLDivElement>(null)
  const [card6Visible, setCard6Visible] = useState(false)
  const card7Ref = useRef<HTMLDivElement>(null)
  const [card7Visible, setCard7Visible] = useState(false)
  const [r1Visible, setR1Visible] = useState(false)
  const [r2Visible, setR2Visible] = useState(false)
  const [r3Visible, setR3Visible] = useState(false)
  const [r2Bounce, setR2Bounce] = useState(false)
  const handleFirstTargetComplete = useCallback(() => {
    setIsSecondBubbleVisible(true)
  }, [])
  const handleSecondTargetComplete = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
    }
    restartTimerRef.current = setTimeout(() => {
      setIsFirstBubbleVisible(false)
      setIsSecondBubbleVisible(false)
      restartTimerRef.current = setTimeout(() => {
        setAnimationCycle((prev) => prev + 1)
      }, 100)
    }, 3000)
  }, [])

  useEffect(() => {
    if (!card1Visible) return
    const firstTimer = setTimeout(() => setIsFirstBubbleVisible(true), 120)

    return () => {
      clearTimeout(firstTimer)
    }
  }, [animationCycle, card1Visible])

  useEffect(() => {
    return () => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const el1 = card1Ref.current
    const el2 = card2Ref.current
    const el3 = card3Ref.current
    const el4 = card4Ref.current
    const el5 = card5Ref.current
    const el6 = card6Ref.current
    const el7 = card7Ref.current
    if (!el1 && !el2 && !el3 && !el4 && !el5 && !el6 && !el7) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === el1) setCard1Visible(true)
            if (entry.target === el2) setCard2Visible(true)
            if (entry.target === el3) setCard3Visible(true)
            if (entry.target === el4) setCard4Visible(true)
            if (entry.target === el5) setCard5Visible(true)
            if (entry.target === el6) setCard6Visible(true)
            if (entry.target === el7) setCard7Visible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (el1) observer.observe(el1)
    if (el2) observer.observe(el2)
    if (el3) observer.observe(el3)
    if (el4) observer.observe(el4)
    if (el5) observer.observe(el5)
    if (el6) observer.observe(el6)
    if (el7) observer.observe(el7)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!card5Visible) return

    const t1 = setTimeout(() => setR1Visible(true), 0)
    const t3 = setTimeout(() => setR3Visible(true), 200)
    const t2 = setTimeout(() => setR2Visible(true), 400)
    const tb = setTimeout(() => setR2Bounce(true), 950)

    return () => {
      clearTimeout(t1)
      clearTimeout(t3)
      clearTimeout(t2)
      clearTimeout(tb)
    }
  }, [card5Visible])

  const revealClass = (visible: boolean) =>
    cn(
      "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )

  const featureHref = (href: string) => `/${locale}${href}`

  return (
    <Container>
      <h1 className="text-h1 mb-[60px] text-center text-[var(--fg)]">
        {t("feature.headingLine1")}
        <br />
        {t("feature.headingLine2")}
      </h1>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-[20px]">
        {/* 왼쪽 컬럼 */}
        <div className="flex min-w-0 w-full flex-col gap-4 md:gap-[20px]">
          {/* 카드1 */}
          <div ref={card1Ref} className={cn("relative flex min-w-0 min-h-[28rem] flex-col overflow-hidden rounded-[28px] p-[30px] md:h-[720px] md:min-h-[31rem] md:rounded-[var(--corner-feature)] md:p-[clamp(1.5rem,4vw,2.5rem)]", revealClass(card1Visible))}>
            <img
              src="/lingo/images/feature-01.jpg"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="relative z-10 flex flex-col gap-[10px] text-[var(--fg)]">
              <h3 className="text-h2">{t("feature.title01")}</h3>
              <p className="body-md">
                {t("feature.desc01")}{" "}
                <Link
                  href={featureHref("/features/translation")}
                  prefetch={false}
                  className="font-medium text-[var(--fg)] underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {t("feature.detailLink")} &gt;
                </Link>
              </p>
            </div>
            <div className="relative z-10 mt-10 flex flex-1 flex-col justify-center gap-3 md:mt-20 md:gap-[20px]">
              {/* 첫 번째 코멘트 */}
              {isFirstBubbleVisible && (
                <div key={`first-${animationCycle}`} className="feature-chat-entry flex items-end gap-[10px] md:gap-[12px]">
                  <div className="relative shrink-0 self-start">
                    <div className="size-[44px] overflow-hidden rounded-full md:size-[56px]">
                      <img
                        src="/lingo/images/profile1.png"
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 items-start self-start">
                    {/* 말풍선 꼬리 */}
                    <div className="relative z-10 -mr-[10px] h-[40px] w-[24px] shrink-0">
                      <svg
                        width="24"
                        height="40"
                        viewBox="0 0 24 40"
                        fill="none"
                        preserveAspectRatio="none"
                        overflow="visible"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.1766 39.8977C11.69 35.6581 6.70272 31.7179 0.330665 25.151C-0.568258 24.2246 0.510727 22.759 1.82928 23.0367C7.73991 24.2815 13.0198 23.2796 21.121 16.3389C21.9692 15.6123 23.3867 16.1271 23.4155 17.1903L23.9996 38.7705C24.0233 39.6456 23.0494 40.2506 22.1766 39.8977Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex min-h-[8.75rem] w-full flex-1 self-start overflow-hidden rounded-[22px] bg-white px-4 py-3 text-[var(--fg)] md:min-h-[10rem] md:rounded-[30px] md:px-[28px] md:py-[20px]">
                      <LiveTranslationLines
                        source={t("feature.demoFirstSource")}
                        sourceLocale={t("feature.demoFirstSourceLocale")}
                      target={t("feature.demoFirstTarget")}
                      targetLocale={t("feature.demoFirstTargetLocale")}
                      sourceDelay={260}
                      sourceInterval={170}
                      sourceChunkSize={4}
                      onTargetComplete={handleFirstTargetComplete}
                    />
                    </div>
                  </div>
                </div>
              )}
              {/* 두 번째 코멘트 */}
              {isSecondBubbleVisible && (
                <div key={`second-${animationCycle}`} className="feature-chat-entry flex items-end gap-[10px] md:gap-[12px]">
                  <div className="relative shrink-0 self-start">
                    <div className="size-[44px] overflow-hidden rounded-full md:size-[56px]">
                      <img
                        src="/lingo/images/profile2.png"
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 items-start self-start">
                    {/* 말풍선 꼬리 */}
                    <div className="relative z-10 -mr-[10px] h-[40px] w-[24px] shrink-0">
                      <svg
                        width="24"
                        height="40"
                        viewBox="0 0 24 40"
                        fill="none"
                        preserveAspectRatio="none"
                        overflow="visible"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.1766 39.8977C11.69 35.6581 6.70272 31.7179 0.330665 25.151C-0.568258 24.2246 0.510727 22.759 1.82928 23.0367C7.73991 24.2815 13.0198 23.2796 21.121 16.3389C21.9692 15.6123 23.3867 16.1271 23.4155 17.1903L23.9996 38.7705C24.0233 39.6456 23.0494 40.2506 22.1766 39.8977Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex min-h-[8.75rem] w-full flex-1 self-start overflow-hidden rounded-[22px] bg-white px-4 py-3 text-[var(--fg)] md:min-h-[10rem] md:rounded-[30px] md:px-[28px] md:py-[20px]">
                      <LiveTranslationLines
                        source={t("feature.demoSecondSource")}
                        sourceLocale={t("feature.demoSecondSourceLocale")}
                        target={t("feature.demoSecondTarget")}
                        targetLocale={t("feature.demoSecondTargetLocale")}
                        sourceDelay={180}
                        targetInterval={165}
                        targetChunkSize={4}
                        onTargetComplete={handleSecondTargetComplete}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 카드2 */}
          <div ref={card2Ref} className={cn("relative flex min-w-0 min-h-[18rem] flex-col overflow-hidden rounded-[28px] p-[30px] md:h-[520px] md:rounded-[var(--corner-feature)] md:p-[clamp(1.5rem,4vw,2.5rem)]", revealClass(card2Visible))}>
            <img
              src="/lingo/images/feature-06.jpg"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            {/* 상단 텍스트 */}
            <div className="relative z-10 flex flex-col gap-[10px] text-[var(--fg)]">
              <h3 className="text-h2">{t("feature.title02")}</h3>
              <p className="body-md">{t("feature.desc02")}</p>
            </div>
            {/* 회의 카드 이미지들 */}
            <div className="relative z-10 mt-auto flex w-full flex-col gap-[10px] overflow-visible pt-10 md:pt-10">
              <img
                src="/lingo/images/calendar1.png"
                alt=""
                className={cn(
                  "max-w-none max-md:-ml-5 max-md:w-[calc(100%+20px)] md:-ml-[60px] md:w-[calc(100%+60px)]",
                  card2Visible ? "opacity-100" : "opacity-0"
                )}
                style={{
                  transform: card2Visible
                    ? "translateX(-60px)"
                    : "translateX(-100%)",
                  transition:
                    "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                }}
              />
              <img
                src="/lingo/images/calendar2.png"
                alt=""
                className={cn(
                  "max-w-none max-md:-ml-5 max-md:w-[calc(100%+20px)] md:-ml-[60px] md:w-[calc(100%+60px)]",
                  card2Visible ? "opacity-100" : "opacity-0"
                )}
                style={{
                  transform: card2Visible
                    ? "translateX(-60px)"
                    : "translateX(-100%)",
                  transition:
                    "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, opacity 0.5s ease 0.15s",
                }}
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="flex min-w-0 w-full flex-col gap-4 md:gap-[20px]">
          {/* 카드3 */}
          <div ref={card3Ref} className={cn("feature-card-03 relative flex min-w-0 min-h-[18rem] flex-col justify-end overflow-hidden rounded-[28px] p-[30px] md:h-[520px] md:rounded-[var(--corner-feature)] md:p-[clamp(1.5rem,4vw,2.5rem)]", revealClass(card3Visible))}>
            <img
              src="/lingo/images/feature-03.jpg"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            {/* AI Transcription 이미지 */}
            <div
              className={cn(
                "relative z-10 mb-auto flex flex-1 items-center justify-center transition-all duration-700 max-md:items-end max-md:pt-5",
                card3Visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              <div className="relative">
                <img
                  src="/lingo/images/ai-transcription.png"
                  alt=""
                  className="h-[144px] w-full max-w-[320px] object-contain md:max-w-[380px]"
                />
                {/* 둥둥 떠다니는 태그 이미지들 */}
                <img
                  src="/lingo/images/ai-transcription1.png"
                  alt=""
                  className="absolute top-2.5 left-[56px] h-[44px] w-[72px] animate-[feature-float-sm_3s_ease-in-out_infinite] md:-top-2.5 md:left-[74px] md:h-[56px] md:w-[91px]"
                />
                <img
                  src="/lingo/images/ai-transcription2.png"
                  alt=""
                  className="absolute top-2.5 right-[20px] h-[44px] w-[60px] animate-[feature-float-md_3.5s_ease-in-out_0.5s_infinite] md:-top-2.5 md:right-[28px] md:h-[56px] md:w-[75px]"
                />
              </div>
            </div>
            <div className="relative z-10 mt-5 flex flex-col gap-2 text-[var(--fg)] md:mt-0 md:gap-[10px]">
              <h3 className="text-h2">{t("feature.title03")}</h3>
              <p className="body-md">
                {t("feature.desc03")}{" "}
                <Link
                  href={featureHref("/features/transcription")}
                  prefetch={false}
                  className="font-medium text-[var(--fg)] underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {t("feature.detailLink")} &gt;
                </Link>
              </p>
            </div>
          </div>

          {/* 카드4 */}
          <div ref={card4Ref} className={cn("relative flex min-w-0 min-h-[27.25rem] flex-col items-start overflow-hidden rounded-[28px] p-[30px] md:h-[720px] md:rounded-[var(--corner-feature)] md:p-[clamp(1.5rem,4vw,2.5rem)]", revealClass(card4Visible))}>
            <img
              src="/lingo/images/feature-05.jpg"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="relative z-10 mb-10 flex w-full flex-col gap-2 text-[var(--white)] md:mb-0 md:gap-[10px]">
              <h3 className="text-h2">{t("feature.title04")}</h3>
              <p className="body-md">
                {t("feature.desc04")}{" "}
                <Link
                  href={featureHref("/features/ai-note")}
                  prefetch={false}
                  className="font-medium text-[var(--white)] underline underline-offset-4 transition-opacity hover:opacity-75"
                >
                  {t("feature.detailLink")} &gt;
                </Link>
              </p>
            </div>
            {/* AI Note 목업 */}
            <img
              src="/lingo/images/ai-note.png"
              alt=""
              className={cn(
                "absolute z-0 w-[81.02%] max-w-none rounded-[20px] shadow-[0px_40px_40px_rgba(0,0,0,0.15)] max-md:top-[calc(38%+60px)] md:top-[calc(27.92%+20px)]",
                card4Visible
                  ? "animate-[feature-calendar-reveal_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                  : "translate-x-full"
              )}
              style={{
                left: "26.12%",
              }}
            />
          </div>
        </div>
      </div>

      {/* 카드5 — 전체 너비 */}
      <div
        ref={card5Ref}
        className={cn(
          "relative mt-4 flex min-w-0 min-h-[26rem] flex-col overflow-hidden rounded-[28px] bg-[#131314] p-[30px] md:mt-[20px] md:h-[380px] md:flex-row md:items-start md:justify-between md:rounded-[var(--corner-feature)] md:p-[40px]",
          revealClass(card5Visible)
        )}
      >
        {/* 왼쪽 텍스트 */}
        <div className="relative z-10 flex flex-col gap-[10px] text-[var(--white)] md:w-[360px]">
          <h3 className="text-h2">{t("feature.title05")}</h3>
          <p className="body-md">{t("feature.desc05")}</p>
        </div>
        {/* 오른쪽 이미지들 */}
        <div className="relative z-10 mt-auto flex shrink-0 flex-col items-center gap-[20px] md:mt-0 md:h-full md:justify-end">
          <div className="flex gap-[10px] max-md:scale-[0.90] max-md:origin-bottom">
            {/* remote1 */}
            <div
              className="relative h-[120px] w-[92px] overflow-hidden rounded-[16px] md:h-[180px] md:w-[138px]"
              style={{
                transform: r1Visible ? 'scale(1)' : 'scale(0.6)',
                opacity: r1Visible ? 1 : 0,
                transition:
                  'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
              }}
            >
              <img
                src="/lingo/images/remote1.png"
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            {/* remote2 */}
            <div
              className="relative h-[120px] w-[92px] overflow-hidden rounded-[16px] md:h-[180px] md:w-[138px]"
              style={{
                transform: r2Visible ? 'scale(1)' : 'scale(0.6)',
                opacity: r2Visible ? 1 : 0,
                transition:
                  'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
              }}
            >
              <img
                src="/lingo/images/remote2.png"
                alt=""
                className={cn(
                  'absolute inset-0 size-full object-cover',
                  r2Bounce &&
                    'animate-[feature-remote-bounce_1.5s_ease-in-out_infinite]'
                )}
              />
            </div>
            {/* remote3 */}
            <div
              className="relative h-[120px] w-[92px] overflow-hidden rounded-[16px] md:h-[180px] md:w-[138px]"
              style={{
                transform: r3Visible ? 'scale(1)' : 'scale(0.6)',
                opacity: r3Visible ? 1 : 0,
                transition:
                  'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
              }}
            >
              <img
                src="/lingo/images/remote3.png"
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          </div>
          {/* remote4 — 항상 노출 */}
          <div className="relative h-[36px] w-full overflow-hidden md:w-[375px]">
            <img
              src="/lingo/images/remote4.png"
              alt=""
              className="absolute inset-0 size-full object-contain md:object-cover"
            />
          </div>
        </div>
      </div>

      {/* 카드6, 카드7 */}
      <div className="mt-4 flex flex-col gap-4 md:mt-[20px] md:flex-row md:gap-[20px]">
        {/* 카드6 */}
        <div ref={card6Ref} className={cn("relative flex min-w-0 min-h-[26rem] w-full flex-col items-start overflow-hidden rounded-[28px] p-[30px] md:h-[600px] md:w-[calc(50%-10px)] md:rounded-[var(--corner-feature)] md:p-[40px]", revealClass(card6Visible))}>
          <img
            src="/lingo/images/feature-02.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="relative z-10 flex flex-col gap-[10px] text-[var(--white)]">
            <h3 className="text-h2">{t("feature.title06")}</h3>
            <div className="body-md">
              <p>{t("feature.desc06")}</p>
            </div>
          </div>
          {/* 둥둥 떠있는 프로필 이미지들 */}
          <div className="absolute inset-0 z-0">
            {/* b-1 (모자 쓴 남자, 왼쪽 중간) */}
            <div
              className="absolute drop-shadow-[0px_8px_20px_rgba(0,0,0,0.35)] max-md:left-[18%] max-md:top-[60%] max-md:h-[60px] max-md:w-[64px] md:left-[66px] md:top-[331px] md:h-[95px] md:w-[100px]"
              style={{
                animation: 'feature-float-md 3s ease-in-out 0.5s infinite',
              }}
            >
              <img
                src="/lingo/images/b-1.png"
                alt=""
                className="size-full object-cover"
              />
            </div>
            {/* b-2 (여자, 하단 중간) */}
            <div
              className="absolute drop-shadow-[0px_10px_24px_rgba(0,0,0,0.35)] max-md:left-[34%] max-md:top-[76%] max-md:h-[72px] max-md:w-[80px] md:left-[133px] md:top-[405px] md:h-[115px] md:w-[128px]"
              style={{
                animation: 'feature-float-lg 3.5s ease-in-out 1s infinite',
              }}
            >
              <img
                src="/lingo/images/b-2.png"
                alt=""
                className="size-full object-cover"
              />
            </div>
            {/* b-3 (안경, 가장 작음, 상단 중간) */}
            <div
              className="absolute drop-shadow-[0px_8px_20px_rgba(0,0,0,0.35)] max-md:left-[52%] max-md:top-[54%] max-md:h-[50px] max-md:w-[56px] md:left-[230px] md:top-[272px] md:h-[85px] md:w-[96px]"
              style={{
                animation: 'feature-float-sm 2.5s ease-in-out infinite',
              }}
            >
              <img
                src="/lingo/images/b-3.png"
                alt=""
                className="size-full object-cover"
              />
            </div>
            {/* b-4 (수염남자, 가장 큼, 오른쪽 중간) */}
            <div
              className="absolute drop-shadow-[0px_10px_24px_rgba(0,0,0,0.35)] max-md:left-[64%] max-md:top-[68%] max-md:h-[84px] max-md:w-[90px] md:left-[302px] md:top-[353px] md:h-[130px] md:w-[140px]"
              style={{
                animation: 'feature-float-xl 4s ease-in-out 1.5s infinite',
              }}
            >
              <img
                src="/lingo/images/b-4.png"
                alt=""
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 카드7 */}
        <div ref={card7Ref} className={cn("relative flex min-w-0 min-h-[31.75rem] w-full flex-col justify-end overflow-hidden rounded-[28px] md:h-[600px] md:w-[calc(50%-10px)] md:rounded-[var(--corner-feature)]", revealClass(card7Visible))}>
          {/* 배경 + 원형 그라데이션 컨테이너 */}
          <div className="absolute inset-0 overflow-hidden rounded-[28px] md:rounded-[var(--corner-feature)]">
            <img
              src="/lingo/images/feature-03.jpg"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            {/* 원형 그라데이션들 */}
            <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
              <div
                className="relative size-[200px] rounded-full opacity-0 md:size-[360px]"
                style={{
                  background:
                    'radial-gradient(circle, transparent 83.854%, rgba(61,61,61,1) 100%)',
                }}
              />
              <div
                className="absolute inset-0 m-auto size-[165px] rounded-full md:size-[295px]"
                style={{
                  background:
                    'radial-gradient(circle, transparent 83.854%, rgba(255,255,255,1) 100%)',
                  opacity: 0.3,
                }}
              />
              <div
                className="absolute inset-0 m-auto size-[130px] rounded-full md:size-[230px]"
                style={{
                  background:
                    'radial-gradient(circle, transparent 83.854%, rgba(255,255,255,1) 100%)',
                  opacity: 0.35,
                }}
              />
              <div
                className="absolute inset-0 m-auto size-[90px] rounded-full md:size-[165px]"
                style={{
                  background:
                    'radial-gradient(circle, transparent 83.854%, rgba(255,255,255,1) 100%)',
                  opacity: 0.45,
                }}
              />
            </div>
          </div>

          {/* integration 로고 이미지 */}
          <img
            src="/lingo/images/integration.png"
            alt=""
            className="absolute z-10 max-w-none object-contain pointer-events-none max-md:right-[-160px] max-md:top-[-200px] max-md:h-[500px] max-md:w-[500px] md:left-[40px] md:top-[-265px] md:h-[711px] md:w-[711px]"
          />

          {/* 하단 텍스트 */}
          <div className="relative z-10 flex flex-col gap-[10px] p-[30px] text-[var(--fg)] md:p-[40px]">
            <h3 className="text-h2">{t("feature.title07")}</h3>
            <p className="body-md">
              {t("feature.desc07")}{" "}
              <Link
                href={featureHref("/integrations")}
                prefetch={false}
                className="font-medium text-[var(--fg)] underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {t("feature.detailLink")} &gt;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
