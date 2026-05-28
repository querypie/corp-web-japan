"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export function Dialog({
  open,
  onClose,
  children,
  ariaLabelledBy,
  ariaDescribedBy,
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",")
    const focusableElements = () =>
      Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ??
          []
      ).filter((element) => !element.hasAttribute("disabled"))

    const focusFirst = () => {
      const first = focusableElements()[0] ?? overlayRef.current
      first?.focus()
    }
    focusFirst()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }
      if (event.key !== "Tab") return
      const elements = focusableElements()
      if (elements.length === 0) {
        event.preventDefault()
        overlayRef.current?.focus()
        return
      }
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey) {
        if (
          document.activeElement === first ||
          !overlayRef.current?.contains(document.activeElement)
        ) {
          event.preventDefault()
          last.focus()
        }
        return
      }
      if (
        document.activeElement === last ||
        !overlayRef.current?.contains(document.activeElement)
      ) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
      restoreFocusRef.current?.focus()
      restoreFocusRef.current = null
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </div>
  )
}
