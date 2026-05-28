"use client"

import { cookieConsentSettingsEvent } from "@/lib/lingo/cookieConsent"

type CookieSettingsButtonProps = {
  children: React.ReactNode
  className?: string
}

export function CookieSettingsButton({
  children,
  className,
}: CookieSettingsButtonProps) {
  const openCookieSettings = () => {
    window.dispatchEvent(new Event(cookieConsentSettingsEvent))
  }

  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      {children}
    </button>
  )
}
