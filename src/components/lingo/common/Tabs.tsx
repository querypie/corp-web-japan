"use client"

import { cn } from "@/lib/lingo/utils"

interface Tab {
  label: string
  value: string
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onValueChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-[4px] rounded-[var(--corner-fill)] border border-[var(--border)] p-[4px]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "relative rounded-[var(--corner-fill)] px-5 py-2.5 body-md font-normal transition-colors duration-200 md:px-[24px] md:py-[12px]",
              isActive
                ? "bg-[var(--card)] text-[var(--fg)]"
                : "bg-transparent text-[var(--fg)] hover:bg-[var(--card)]/50"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
