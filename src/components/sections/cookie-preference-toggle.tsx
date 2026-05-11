"use client";

import { useState } from "react";
import type { CookiePreferenceKey } from "./cookie-preference";

type MutableCookiePreferenceKey = Exclude<CookiePreferenceKey, "necessary">;

type CookiePreferenceToggleProps = {
  preference: CookiePreferenceKey;
  id: string;
  disabled?: boolean;
};

const COOKIE_PREFERENCE_COOKIE_KEYS = {
  set: "cookie-preference-set",
  performance: "cookie-preference-performance",
  functional: "cookie-preference-functional",
  analysis: "cookie-preference-event",
  marketing: "cookie-preference-marketing",
} as const;

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(name.length + 1));
}

function setCookieValue(name: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function readCheckedState(preference: MutableCookiePreferenceKey) {
  return getCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS[preference]) === "1";
}

export function CookiePreferenceToggle({ preference, disabled = false, id }: CookiePreferenceToggleProps) {
  const isNecessary = preference === "necessary";
  const [checked, setChecked] = useState(() => (isNecessary ? true : readCheckedState(preference)));

  function handleToggle() {
    if (isNecessary || disabled) {
      return;
    }

    setChecked((previous) => {
      const nextValue = !previous;

      setCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS[preference], nextValue ? "1" : "0");
      setCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS.set, "1");

      return nextValue;
    });
  }

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || isNecessary ? "true" : undefined}
      disabled={disabled || isNecessary}
      onClick={handleToggle}
      className={[
        "relative inline-flex h-[25px] w-[42px] shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-[#0969DA]" : "bg-[#91959A]",
        disabled || isNecessary ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969DA] focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute left-[2px] top-[2px] h-[21px] w-[21px] rounded-full bg-white shadow-[0_2px_2px_rgba(9,30,66,0.24)] transition-transform duration-200",
          checked ? "translate-x-[19px]" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
