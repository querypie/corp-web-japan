"use client"

import type { ButtonHTMLAttributes } from "react"

interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  checked: boolean
}

export function Switch({
  checked,
  className,
  type = "button",
  children,
  ...props
}: SwitchProps) {
  const composedClassName = [
    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
    checked ? "bg-brand" : "bg-input",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      className={composedClassName}
      {...props}
    >
      <span
        className={[
          "pointer-events-none absolute top-0.5 left-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
      {children}
    </button>
  )
}
