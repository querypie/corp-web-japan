"use client"

import { cn } from "@/lib/lingo/utils"

type BadgeVariant = "brand" | "outline"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: "bg-[var(--brand)] text-[var(--white)]",
  outline: "border border-[var(--border)] text-[var(--fg)] bg-transparent",
}

export function Badge({ children, className, variant = "brand" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--corner-fill)] px-[10px] py-[4px] body-sm",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
