interface SessionStatusBadgeProps {
  status: "active" | "paused"
  className?: string
}

export function SessionStatusBadge({
  status,
  className = "",
}: SessionStatusBadgeProps) {
  if (status === "paused") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase ${className}`.trim()}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        Paused
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-destructive uppercase ${className}`.trim()}
    >
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      Ongoing
    </span>
  )
}
