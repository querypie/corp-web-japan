"use client";

import { useState } from "react";

type CookiePreferenceItem = {
  id: "necessary" | "performance" | "functional" | "analysis" | "marketing";
  label: string;
  description: string;
  disabled?: boolean;
};

type LegalCookiePreferenceSwitchProps = {
  items: readonly CookiePreferenceItem[];
};

type CookiePreferenceKey = Exclude<CookiePreferenceItem["id"], "necessary">;

type CookiePreferenceState = Record<CookiePreferenceKey, boolean>;

const COOKIE_KEYS = {
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
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function readCheckedState(): CookiePreferenceState {
  return {
    performance: getCookieValue(COOKIE_KEYS.performance) === "1",
    functional: getCookieValue(COOKIE_KEYS.functional) === "1",
    analysis: getCookieValue(COOKIE_KEYS.analysis) === "1",
    marketing: getCookieValue(COOKIE_KEYS.marketing) === "1",
  };
}

function CookiePreferenceToggle({
  checked,
  disabled,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onCheckedChange: (nextValue: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={[
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition",
        disabled ? "cursor-not-allowed border-slate-200 bg-slate-200" : checked ? "cursor-pointer border-sky-600 bg-sky-600" : "cursor-pointer border-slate-300 bg-slate-300",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[2px]",
        ].join(" ")}
      />
    </button>
  );
}

export function LegalCookiePreferenceSwitch({ items }: LegalCookiePreferenceSwitchProps) {
  const [checked, setChecked] = useState<CookiePreferenceState>(() => readCheckedState());

  function updatePreference(id: CookiePreferenceKey, value: boolean) {
    setChecked((prev) => ({ ...prev, [id]: value }));
    setCookieValue(COOKIE_KEYS[id], value ? "1" : "0");
    setCookieValue(COOKIE_KEYS.set, "1");
  }

  return (
    <ul className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item) => {
        const isNecessary = item.id === "necessary";
        const enabled = isNecessary ? true : checked[item.id as CookiePreferenceKey];

        return (
          <li key={item.id} className="py-6 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1 pr-2">
                <h2 className="text-[18px] font-medium leading-7 text-slate-950">{item.label}</h2>
                <p className="mt-3 text-[15px] font-light leading-7 text-slate-600">{item.description}</p>
              </div>
              <CookiePreferenceToggle
                checked={enabled}
                disabled={item.disabled}
                label={item.label}
                onCheckedChange={(nextValue) => {
                  if (!isNecessary) {
                    updatePreference(item.id as CookiePreferenceKey, nextValue);
                  }
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
