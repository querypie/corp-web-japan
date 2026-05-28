import { LANGUAGE_FLAGS, SUPPORTED_LANGUAGES } from "@/components/lingo/mockup/types"

interface LanguageTagProps {
  lang: string
  size?: "sm" | "md"
}

export function LanguageTag({ lang, size = "sm" }: LanguageTagProps) {
  const flag = LANGUAGE_FLAGS[lang] ?? "🌐"
  const name = SUPPORTED_LANGUAGES[lang] ?? lang

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-secondary font-medium text-secondary-foreground ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      <span>{flag}</span>
      <span>{name}</span>
    </span>
  )
}
