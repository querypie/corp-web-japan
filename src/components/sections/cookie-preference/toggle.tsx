"use client";

import { useState } from "react";
import {
  COOKIE_PREFERENCE_COOKIE_KEYS,
  COOKIE_PREFERENCE_MAX_AGE,
  type CookiePreferenceKey,
} from "@/lib/cookie-preferences";

type CookiePreferenceToggleProps = {
  preference: CookiePreferenceKey;
  id: string;
  disabled?: boolean;
  initialChecked?: boolean;
};

function setCookieValue(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_PREFERENCE_MAX_AGE}; SameSite=Lax`;
}

export function CookiePreferenceToggle({
  preference,
  disabled = false,
  id,
  initialChecked = false,
}: CookiePreferenceToggleProps) {
  const isNecessary = preference === "necessary";
  const [checked, setChecked] = useState(isNecessary ? true : initialChecked);

  function handleToggle() {
    if (preference === "necessary" || disabled) {
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
