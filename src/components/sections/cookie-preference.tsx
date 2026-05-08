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

function CookiePreferenceSwitch({ checked, disabled, onToggle }: { checked: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled ? "true" : undefined}
      disabled={disabled}
      onClick={onToggle}
      className={[
        "relative inline-flex h-[24px] w-[42px] shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-[#0969DA]" : "bg-[#D0D7DE]",
        disabled ? "cursor-not-allowed opacity-100" : "cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969DA] focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute left-[2px] top-[2px] h-[20px] w-[20px] rounded-full bg-white shadow-[0_1px_2px_rgba(9,30,66,0.2)] transition-transform duration-200",
          checked ? "translate-x-[18px]" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

export function CookiePreferenceList({ children }: CookiePreferenceListProps) {
  return <ul className="space-y-[31.5px]">{children}</ul>;
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

  return (
    <li className="border-b border-[#D0D7DE] pb-[31.5px] last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-[18px] font-medium leading-[27px] tracking-[0.2px] text-slate-950">{label}</h2>
        <CookiePreferenceSwitch checked={checked} disabled={disabled || isNecessary} onToggle={handleToggle} />
      </div>
      <div className="mt-[14px] max-w-[920px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-slate-600">
        {description}
      </div>
    </li>
  );
}
