/**
 * 목업 전용 theme 유틸
 * — SSR 안전하도록 document/window/localStorage 접근에 가드 추가
 */
export const THEME_CHANGE_EVENT = "lingo-theme-change"

export function applyTheme(theme: "light" | "dark" | "system" | string) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return
  }

  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else if (theme === "light") {
    root.classList.remove("dark")
  } else {
    // system
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    root.classList.toggle("dark", prefersDark)
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }))
}

/** localStorage에 저장된 테마를 읽어 적용합니다. */
export const THEME_STORAGE_KEY = "lingo-theme"

export function initTheme() {
  if (typeof localStorage === "undefined" || typeof window === "undefined") {
    return
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY) || "system"
  applyTheme(stored)
}
