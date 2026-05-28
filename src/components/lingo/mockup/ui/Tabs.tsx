"use client"

interface TabItem<T extends string> {
  id: T
  label: string
}

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onValueChange: (value: T) => void
  className?: string
  fit?: "equal" | "content"
}

export function Tabs<T extends string>({
  items,
  value,
  onValueChange,
  className,
  fit = "equal",
}: TabsProps<T>) {
  const wrapperClassName = [
    "inline-flex gap-1 rounded-lg border border-border bg-card p-1",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={wrapperClassName} role="tablist">
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onValueChange(item.id)}
            className={[
              "cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-[background-color,color,transform] active:scale-[0.98] sm:active:scale-100",
              fit === "equal" ? "flex-1" : "",
              selected
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground sm:hover:bg-accent sm:hover:text-accent-foreground",
            ].join(" ")}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
