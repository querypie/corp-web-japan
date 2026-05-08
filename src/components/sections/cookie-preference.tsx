"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type CookiePreferenceKey = "necessary" | "performance" | "functional" | "analysis" | "marketing";

type MutableCookiePreferenceKey = Exclude<CookiePreferenceKey, "necessary">;

type CookiePreferenceListProps = {
  children: ReactNode;
};

type CookiePreferenceItemProps = {
  id: CookiePreferenceKey;
  label: string;
  description: ReactNode;
  disabled?: boolean;
};

type CookiePreferenceState = Record<MutableCookiePreferenceKey, boolean>;

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

function readCheckedState(): CookiePreferenceState {
  return {
    performance: getCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS.performance) === "1",
    functional: getCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS.functional) === "1",
    analysis: getCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS.analysis) === "1",
    marketing: getCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS.marketing) === "1",
  };
}

function CookiePreferenceSwitch({ checked, disabled, onToggle, id }: { checked: boolean; disabled?: boolean; onToggle: () => void; id: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled ? "true" : undefined}
      disabled={disabled}
      onClick={onToggle}
      className={[
        "relative inline-flex h-[25px] w-[42px] shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-[#0969DA]" : "bg-[#91959A]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
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

export function CookiePreferenceList({ children }: CookiePreferenceListProps) {
  return <ul className="flex flex-col gap-[40px]">{children}</ul>;
}

export function CookiePreferenceItem({ id, label, description, disabled = false }: CookiePreferenceItemProps) {
  const [checkedState, setCheckedState] = useState<CookiePreferenceState>(() => readCheckedState());

  const isNecessary = id === "necessary";
  const checked = isNecessary ? true : checkedState[id];

  function handleToggle() {
    if (isNecessary || disabled) {
      return;
    }

    setCheckedState((prev) => {
      const nextValue = !prev[id];

      setCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS[id], nextValue ? "1" : "0");
      setCookieValue(COOKIE_PREFERENCE_COOKIE_KEYS.set, "1");

      return {
        ...prev,
        [id]: nextValue,
      };
    });
  }

  const switchId = `cookie-preference-${id}`;

  return (
    <li className="flex flex-col gap-[20px]">
      <div className="flex items-center gap-[15px]">
        <CookiePreferenceSwitch checked={checked} disabled={disabled || isNecessary} onToggle={handleToggle} id={switchId} />
        <label htmlFor={switchId} className="text-[18.75px] font-medium leading-[26.25px] text-[#24292F]">
          {label}
        </label>
      </div>
      <div className="text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-[#57606A]">
        {description}
      </div>
    </li>
  );
}
