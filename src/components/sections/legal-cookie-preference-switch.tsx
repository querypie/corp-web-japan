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

export function LegalCookiePreferenceSwitch({ items }: LegalCookiePreferenceSwitchProps) {
  const [checked, setChecked] = useState<CookiePreferenceState>(() => readCheckedState());

  function updatePreference(id: CookiePreferenceKey, value: boolean) {
    setChecked((prev) => ({ ...prev, [id]: value }));
    setCookieValue(COOKIE_KEYS[id], value ? "1" : "0");
    setCookieValue(COOKIE_KEYS.set, "1");
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const isNecessary = item.id === "necessary";
        const enabled = isNecessary
          ? true
          : checked[item.id as Exclude<CookiePreferenceItem["id"], "necessary">];

        return (
          <li key={item.id} className="rounded-[12px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <label className="flex cursor-pointer items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-medium text-slate-950">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-[#cbd5e1]"
                checked={enabled}
                disabled={item.disabled}
                onChange={(event) => {
                  if (!isNecessary) {
                    updatePreference(
                      item.id as Exclude<CookiePreferenceItem["id"], "necessary">,
                      event.target.checked,
                    );
                  }
                }}
              />
            </label>
          </li>
        );
      })}
    </ul>
  );
}
