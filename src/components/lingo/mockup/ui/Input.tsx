"use client"

import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  const composedClassName = [
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return <input ref={ref} className={composedClassName} {...props} />
})
