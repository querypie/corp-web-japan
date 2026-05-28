"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "soft"
  | "destructive"

type ButtonSize = "sm" | "md" | "icon"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
}

const baseClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-[background-color,color,opacity,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:active:scale-100"

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-primary-foreground sm:hover:opacity-90",
  secondary:
    "border border-transparent bg-secondary text-secondary-foreground sm:hover:bg-accent sm:hover:text-accent-foreground",
  ghost:
    "text-muted-foreground sm:hover:bg-accent sm:hover:text-accent-foreground",
  outline:
    "border border-input bg-background text-muted-foreground sm:hover:bg-accent sm:hover:text-accent-foreground",
  soft: "border border-primary-soft-border bg-primary-soft text-primary-soft-foreground sm:hover:opacity-90",
  destructive: "bg-destructive text-destructive-foreground sm:hover:opacity-90",
}

const sizeClassNames: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  icon: "h-8 w-8 p-0",
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const composedClassName = [
    baseClassName,
    variantClassNames[variant],
    sizeClassNames[size],
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button type={type} className={composedClassName} {...props}>
      {children}
    </button>
  )
}
