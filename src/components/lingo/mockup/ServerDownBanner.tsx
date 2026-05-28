"use client"

export function ServerDownBanner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <svg
        className="mb-4 h-12 w-12 text-muted-foreground/60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <p className="mb-2 text-lg">Server is restarting</p>
      <p className="mb-4 text-sm">Please wait a moment and try again.</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-[opacity,transform] active:scale-[0.98] sm:hover:opacity-90 sm:active:scale-100"
      >
        Retry
      </button>
    </div>
  )
}
