"use client"

import { useSyncExternalStore } from "react"
import { useLocale } from "@/lib/lingo/intl"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"
import {
  cookieConsentSettingsEvent,
  cookieConsentStorageKey,
  type CookieConsentValue,
} from "@/lib/lingo/cookieConsent"

type CookieConsentLocale = "en" | "ko" | "ja"

const privacyPolicyLinks = {
  en: "https://www.querypie.com/privacy-policy",
  ko: "https://www.querypie.com/ko/privacy-policy-ko",
  ja: "https://www.querypie.com/ja/privacy-policy-ja",
} satisfies Record<CookieConsentLocale, string>

const cookieConsentCopy = {
  en: {
    ariaLabel: "Cookie consent",
    descriptionBeforePrivacy:
      "We use cookies to improve your experience. To learn how we use cookies, please review our ",
    privacyPolicy: "Privacy Policy",
    descriptionAfterPrivacy: ".",
    settingsBefore:
      "If you decline, we respect your choice and will not track you. You can change your preferences anytime in ",
    cookieSettings: "Cookie settings",
    settingsAfter: ".",
    accept: "Yes, I agree",
    reject: "Decline",
  },
  ko: {
    ariaLabel: "쿠키 동의",
    descriptionBeforePrivacy:
      "고객님의 사용 경험을 향상시키기 위해 쿠키를 사용합니다. 쿠키 사용 방법 대해 알아보려면 ",
    privacyPolicy: "개인정보 처리방침",
    descriptionAfterPrivacy: "을 살펴봐주세요.",
    settingsBefore:
      "거부하셔도 고객님의 선택을 존중하며 추적은 하지 않습니다. 언제든 원하실 때 ",
    cookieSettings: "쿠키 설정",
    settingsAfter: "을 통해 설정을 변경하실 수 있습니다.",
    accept: "예, 동의합니다",
    reject: "거부",
  },
  ja: {
    ariaLabel: "Cookie同意",
    descriptionBeforePrivacy:
      "お客様の利用体験を向上させるためにCookieを使用します。Cookieの使用方法については、",
    privacyPolicy: "プライバシーポリシー",
    descriptionAfterPrivacy: "をご確認ください。",
    settingsBefore:
      "拒否された場合もお客様の選択を尊重し、追跡は行いません。いつでも",
    cookieSettings: "Cookie設定",
    settingsAfter: "から変更できます。",
    accept: "同意します",
    reject: "拒否",
  },
} satisfies Record<CookieConsentLocale, Record<string, string>>

let isCookieSettingsOpen = false

function getCookieConsentSnapshot() {
  if (typeof window === "undefined") return false

  return (
    isCookieSettingsOpen ||
    window.localStorage.getItem(cookieConsentStorageKey) === null
  )
}

function subscribeCookieConsentStore(onStoreChange: () => void) {
  const openCookieSettings = () => {
    isCookieSettingsOpen = true
    onStoreChange()
  }

  window.addEventListener(cookieConsentSettingsEvent, openCookieSettings)
  window.addEventListener("lingo-cookie-consent-change", onStoreChange)
  window.addEventListener("storage", onStoreChange)

  return () => {
    window.removeEventListener(cookieConsentSettingsEvent, openCookieSettings)
    window.removeEventListener("lingo-cookie-consent-change", onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

export function CookieConsent() {
  const locale = useLocale()
  const copy = getLocaleCopy(locale, cookieConsentCopy)
  const privacyPolicyHref =
    privacyPolicyLinks[
      (locale as CookieConsentLocale) in privacyPolicyLinks
        ? (locale as CookieConsentLocale)
        : "en"
    ]

  const isVisible = useSyncExternalStore(
    subscribeCookieConsentStore,
    getCookieConsentSnapshot,
    () => false
  )

  const saveConsent = (value: CookieConsentValue) => {
    isCookieSettingsOpen = false
    window.localStorage.setItem(cookieConsentStorageKey, value)
    window.dispatchEvent(
      new CustomEvent("lingo-cookie-consent-change", { detail: { value } })
    )
  }

  if (!isVisible) return null

  return (
    <section
      aria-label={copy.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#d8dde7] bg-[#f4f7fb] px-5 py-5 shadow-[0_-10px_30px_rgba(14,25,52,0.08)] md:px-10 md:py-6"
    >
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-[1120px] text-[14px] leading-[1.7] text-[#3f4752] md:text-[16px] md:leading-[1.75]">
          <p>
            {copy.descriptionBeforePrivacy}
            <a
              href={privacyPolicyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1368d8] underline underline-offset-2"
            >
              {copy.privacyPolicy}
            </a>
            {copy.descriptionAfterPrivacy}
          </p>
          <p>
            {copy.settingsBefore}
            <button
              type="button"
              className="cursor-pointer font-medium text-[#1368d8] underline underline-offset-2"
              onClick={() => {
                isCookieSettingsOpen = true
                window.dispatchEvent(new Event("lingo-cookie-consent-change"))
              }}
            >
              {copy.cookieSettings}
            </button>
            {copy.settingsAfter}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:gap-3">
          <button
            type="button"
            className="h-[48px] min-w-[156px] cursor-pointer rounded-[12px] bg-[#1266d6] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#0f58bc] md:h-[58px] md:min-w-[178px] md:text-[16px]"
            onClick={() => saveConsent("accepted")}
          >
            {copy.accept}
          </button>
          <button
            type="button"
            className="h-[48px] min-w-[112px] cursor-pointer rounded-[12px] border border-[#aeb8c7] bg-white px-6 text-[15px] font-semibold text-[#39424e] transition-colors hover:border-[#7f8da1] hover:bg-[#f8fafc] md:h-[58px] md:min-w-[118px] md:text-[16px]"
            onClick={() => saveConsent("rejected")}
          >
            {copy.reject}
          </button>
        </div>
      </div>
    </section>
  )
}
