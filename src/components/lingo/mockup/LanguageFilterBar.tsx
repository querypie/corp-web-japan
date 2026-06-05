"use client"

import { useTranslations } from "@/lib/lingo/intl"
import { SUPPORTED_LANGUAGES, LANGUAGE_FLAGS } from "@/components/lingo/mockup/types"
import { getVisibleFilterLanguages } from "@/components/lingo/mockup/utils/languageFilter"

interface LanguageFilterBarProps {
  languages: string[]
  selected: string
  onSelect: (lang: string) => void
}

export function LanguageFilterBar({
  languages,
  selected,
  onSelect,
}: LanguageFilterBarProps) {
  const t = useTranslations("mockup.session")
  const visibleLanguages = getVisibleFilterLanguages(languages)

  if (visibleLanguages.length <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs transition-[background-color,color,transform] active:scale-[0.98] sm:active:scale-100 ${
          selected === ""
            ? "border-primary-soft-border bg-primary-soft text-primary-soft-foreground"
            : "border-border bg-card text-muted-foreground sm:hover:bg-accent sm:hover:text-accent-foreground"
        }`}
      >
        {t("filter.allLanguages")}
      </button>
      {visibleLanguages.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onSelect(code)}
          className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs transition-[background-color,color,transform] active:scale-[0.98] sm:active:scale-100 ${
            selected === code
              ? "border-primary-soft-border bg-primary-soft text-primary-soft-foreground"
              : "border-border bg-card text-muted-foreground sm:hover:bg-accent sm:hover:text-accent-foreground"
          }`}
        >
          {LANGUAGE_FLAGS[code] ?? ""} {SUPPORTED_LANGUAGES[code] ?? code}
        </button>
      ))}
    </div>
  )
}
