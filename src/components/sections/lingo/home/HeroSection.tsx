"use client"

import { useTranslations } from "@/lib/lingo/intl"
import { Button } from "@/components/lingo/common/Button"
import { Container } from "@/components/layout/lingo/Container"
import { MockupShell } from "@/components/lingo/mockup/MockupShell"
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function HeroSection() {
  const t = useTranslations()

  return (
    <section {...componentNameDebugProps("HeroSection")} className="relative flex w-full flex-col items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-20 z-0 overflow-hidden md:bottom-[120px]">
        <img
          src="/lingo/images/bg-home.jpg"
          alt=""
          className="size-full object-cover object-bottom"
        />
      </div>

      <Container className="relative z-10 flex flex-col items-center gap-8 pt-28 md:gap-[60px] md:pt-[160px]">
        <div className="flex flex-col items-center gap-8 md:gap-[40px]">
          <div className="flex flex-col items-center gap-6 md:gap-[30px]">
            <div className="flex flex-col items-center gap-4 md:gap-[20px]">
              {/* 로고 아이콘 */}
              <div className="flex size-16 items-center justify-center rounded-[20px] bg-white p-3 md:size-[88px] md:rounded-[26px] md:p-[14px]">
                <img
                  src="/lingo/images/logo-symbol.png"
                  alt="Lingo"
                  className="size-10 object-contain md:size-[60px]"
                />
              </div>
              {/* 로고 텍스트 */}
              <img
                src="/lingo/images/logo-text.svg"
                alt="Lingo"
                className="h-11 w-auto md:h-[60px] md:w-[140px]"
              />
            </div>
            <p className="body-md max-w-[29rem] text-center text-[var(--fg)]">
              {t("hero.tagline")}
            </p>
          </div>
          <Button variant="dark">{t("hero.cta")}</Button>
        </div>

        {/* 실제 제품 흐름을 클릭해볼 수 있는 인터랙티브 목업 */}
        <div className="w-full pb-16 md:pb-24">
          <MockupShell initialPage="meeting-active" initialIsSessionRunning />
        </div>
      </Container>
    </section>
  )
}
