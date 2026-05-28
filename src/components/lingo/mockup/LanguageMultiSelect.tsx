"use client"

import { useEffect, useRef, useState } from "react"
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_FLAGS,
  BETA_LANGUAGES,
} from "@/components/lingo/mockup/types"

interface LanguageMultiSelectProps {
  selected: Set<string>
  onChange: (next: Set<string>) => void
  max?: number
  label?: string
  error?: boolean
  errorToken?: number
}

export function LanguageMultiSelect({
  selected,
  onChange,
  max = 3,
  label,
  error,
  errorToken,
}: LanguageMultiSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (error && triggerRef.current) {
      const el = triggerRef.current
      // Force reflow to restart CSS animation on consecutive errors
      el.style.animation = "none"
      void el.offsetHeight
      el.style.animation = ""
    }
  }, [error, errorToken])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const toggleLanguage = (code: string) => {
    const next = new Set(selected)
    if (next.has(code)) {
      next.delete(code)
    } else {
      next.add(code)
    }
    onChange(next)
  }

  const isMaxReached = selected.size >= max

  return (
    <div ref={rootRef} className="relative">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-invalid={error || undefined}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-foreground transition-[border-color,box-shadow] focus:ring-1 focus:outline-none ${error ? "animate-shake border-destructive focus:border-destructive focus:ring-destructive" : "border-input focus:border-ring focus:ring-ring"}`}
      >
        <span className="truncate">
          {selected.size === 0
            ? "Select languages"
            : Array.from(selected)
                .map(
                  (code) =>
                    `${LANGUAGE_FLAGS[code] ?? "🌐"} ${SUPPORTED_LANGUAGES[code] ?? code}`
                )
                .join(selected.size === 2 ? " ↔ " : ", ")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-lg">
          <div className="max-h-60 overflow-y-auto">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => {
              const isSelected = selected.has(code)
              const isDisabled = !isSelected && isMaxReached
              return (
                <button
                  key={code}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  disabled={isDisabled}
                  onClick={() => toggleLanguage(code)}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:active:scale-100 ${
                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "sm:hover:bg-accent sm:hover:text-accent-foreground"
                  } ${isSelected ? "bg-accent/50 text-accent-foreground" : ""}`}
                >
                  <span className="text-base">
                    {LANGUAGE_FLAGS[code] ?? "🌐"}
                  </span>
                  <span>{name}</span>
                  {BETA_LANGUAGES.has(code) && (
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                      BETA
                    </span>
                  )}
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-auto h-4 w-4 shrink-0 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
          {isMaxReached && (
            <div className="px-3 py-1.5 text-xs text-muted-foreground">
              Maximum {max} languages
            </div>
          )}
        </div>
      )}
    </div>
  )
}
