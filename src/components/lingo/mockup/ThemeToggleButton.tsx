"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"
import { useOrganizationContext } from "@/components/lingo/mockup/contexts/OrganizationContext"
import { useAuthFetch } from "@/components/lingo/mockup/hooks/useAuthFetch"
import { orgApiPath } from "@/components/lingo/mockup/utils/orgApi"
import {
  applyTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
} from "@/components/lingo/mockup/utils/theme"

interface ThemeToggleButtonProps {
  iconWeight?: "regular" | "duotone"
  scope?: "global" | "local"
}

export function ThemeToggleButton({
  iconWeight = "duotone",
  scope = "global",
}: ThemeToggleButtonProps) {
  const authFetch = useAuthFetch()
  const { currentOrg } = useOrganizationContext()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "light"
    if (scope === "local") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
    }
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  })

  useEffect(() => {
    if (scope === "local") {
      // Sync theme from ownerDocument (may differ from main document in iframes/popouts).
      // MutationObserver subscribes to external DOM changes rather than calling setState
      // synchronously inside the effect body.
      const targetDocument = buttonRef.current?.ownerDocument
      if (!targetDocument) return
      const readTheme = (): "dark" | "light" =>
        targetDocument.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
      const observer = new MutationObserver(() => setThemeMode(readTheme()))
      observer.observe(targetDocument.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      return () => observer.disconnect()
    }

    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<string>).detail
      if (nextTheme === "light" || nextTheme === "dark") {
        setThemeMode(nextTheme)
        return
      }
      setThemeMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      )
    }

    window.addEventListener(THEME_CHANGE_EVENT, syncTheme)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme)
  }, [scope])

  const toggleTheme = () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark"
    setThemeMode(nextTheme)
    if (scope === "local") {
      const targetDocument = buttonRef.current?.ownerDocument
      if (!targetDocument) return
      targetDocument.documentElement.classList.toggle(
        "dark",
        nextTheme === "dark"
      )
      return
    }
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
    if (currentOrg) {
      void authFetch(orgApiPath(currentOrg.slug, "/settings"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: nextTheme }),
      }).catch((err) => console.error("Failed to sync theme to server:", err))
    }
  }

  const label = themeMode === "dark" ? "Light" : "Dark"

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={label}
      title={label}
    >
      {themeMode === "dark" ? (
        <Sun className="h-4 w-4" weight={iconWeight} />
      ) : (
        <Moon className="h-4 w-4" weight={iconWeight} />
      )}
    </button>
  )
}
