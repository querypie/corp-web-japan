"use client"

import { useTranslations } from "@/lib/lingo/intl"
import { Button } from "@/components/lingo/common/Button"
import { Container } from "@/components/layout/lingo/Container"
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function CTASection() {
  const t = useTranslations()

  return (
    <Container {...componentNameDebugProps("CTASection")}>
      <div className="flex flex-col items-center gap-6 text-center md:gap-[30px]">
        <div className="flex flex-col items-center gap-4 text-[var(--fg)] md:gap-[20px]">
          <h2 className="text-h1">{t("cta.title")}</h2>
          <p className="body-md w-full">{t("cta.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="dark">{t("cta.button")}</Button>
        </div>
      </div>
    </Container>
  )
}
