"use client"

import { ReactNode } from "react"
import { useTranslations } from "@/lib/lingo/intl"
import { Button } from "@/components/lingo/common/Button"

interface SubHeroSectionProps {
  title: ReactNode
  description: ReactNode
  descriptionClassName?: string
  showButtons?: boolean
}

export function SubHeroSection({
  title,
  description,
  descriptionClassName = "body-sm",
  showButtons = false,
}: SubHeroSectionProps) {
  const t = useTranslations("cta")

  return (
    <div className="flex flex-col gap-5 md:gap-[20px]">
      <h1 className="text-h1 text-[var(--fg)]">{title}</h1>
      <p className={`${descriptionClassName} text-[var(--fg)]`}>{description}</p>
      {showButtons && (
        <div className="flex flex-wrap items-center gap-3">
          <Button>{t("button")}</Button>
          <Button variant="dark">{t("button")}</Button>
          <Button variant="outline">{t("button")}</Button>
        </div>
      )}
    </div>
  )
}
