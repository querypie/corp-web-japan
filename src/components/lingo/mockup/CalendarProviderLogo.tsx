import Image from "next/image"

const calendarProviderLogos = {
  google: {
    src: "/lingo/images/integrations/google-calendar.svg",
    label: "Google Calendar",
  },
  microsoft: {
    src: "/lingo/images/integrations/microsoft-outlook.svg",
    label: "Microsoft Outlook",
  },
} as const

export function CalendarProviderLogo({
  provider,
}: {
  provider: "google" | "microsoft"
}) {
  const logo = calendarProviderLogos[provider]

  return (
    <Image
      src={logo.src}
      alt={logo.label}
      width={32}
      height={32}
      className="h-8 w-8 shrink-0"
      unoptimized
    />
  )
}
