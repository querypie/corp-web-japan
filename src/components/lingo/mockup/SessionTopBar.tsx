import type { ReactNode } from "react"
import { shouldShowLanguageFilter } from "@/components/lingo/mockup/utils/languageFilter"
import { LanguageFilterBar } from "@/components/lingo/mockup/LanguageFilterBar"
import { SessionStatusBadge } from "@/components/lingo/mockup/SessionStatusBadge"

interface SessionTopBarProps {
  title: string
  languages: string[]
  selectedLanguage: string
  onSelectLanguage: (language: string) => void
  actions?: ReactNode
  isLive?: boolean
  // Overrides the live badge with a paused indicator. Mutually exclusive
  // with the live state visually; if isPaused is true the live badge is
  // replaced by a gray "Paused" badge.
  isPaused?: boolean
  hidden?: boolean
}

export function SessionTopBar({
  title,
  languages,
  selectedLanguage,
  onSelectLanguage,
  actions,
  isLive = true,
  isPaused = false,
  hidden = false,
}: SessionTopBarProps) {
  const showLanguageFilter = shouldShowLanguageFilter(languages)

  return (
    <header
      className={`border-b border-border bg-card px-4 py-2.5 sm:px-5 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-lg font-semibold whitespace-nowrap text-foreground">
              {title}
            </h1>
            {isLive && (
              <SessionStatusBadge
                status={isPaused ? "paused" : "active"}
                className="shrink-0"
              />
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-nowrap items-center gap-2 self-start">
            {actions}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex min-h-[30px] flex-wrap items-center gap-3">
        {showLanguageFilter && (
          <LanguageFilterBar
            languages={languages}
            selected={selectedLanguage}
            onSelect={onSelectLanguage}
          />
        )}
      </div>
    </header>
  )
}
