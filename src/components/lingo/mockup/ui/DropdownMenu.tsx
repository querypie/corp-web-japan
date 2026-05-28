"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

interface DropdownMenuProps {
  trigger: (args: { open: boolean; toggle: () => void }) => ReactNode
  children: (args: { close: () => void }) => ReactNode
  menuClassName?: string
  className?: string
}

export function DropdownMenu({
  trigger,
  children,
  menuClassName,
  className,
}: DropdownMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const close = () => setOpen(false)
  const toggle = () => setOpen((value) => !value)

  return (
    <div ref={rootRef} className={className}>
      {trigger({ open, toggle })}
      {open && <div className={menuClassName}>{children({ close })}</div>}
    </div>
  )
}
