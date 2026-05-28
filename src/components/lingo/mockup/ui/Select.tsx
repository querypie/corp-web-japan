"use client"

import type { ReactNode, SelectHTMLAttributes } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string
  children: ReactNode
}

export function Select({
  className,
  containerClassName,
  children,
  ...props
}: SelectProps) {
  const wrapperClassName = ["relative", containerClassName ?? ""]
    .filter(Boolean)
    .join(" ")
  const selectClassName = [
    "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={wrapperClassName}>
      <select className={selectClassName} {...props}>
        {children}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}
