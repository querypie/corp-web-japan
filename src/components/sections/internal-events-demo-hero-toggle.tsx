"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type InternalEventsDemoHeroToggleProps = {
  showUpcomingEvent: boolean;
  disabled?: boolean;
};

type HeroModeOption = {
  value: "show" | "none";
  label: string;
};

const heroModeOptions: readonly HeroModeOption[] = [
  { value: "show", label: "Show Upcoming Event" },
  { value: "none", label: "No Upcoming Event" },
];

export function InternalEventsDemoHeroToggle({
  showUpcomingEvent,
  disabled = false,
}: InternalEventsDemoHeroToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSelect(nextMode: HeroModeOption["value"]) {
    if (disabled) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("upcoming", nextMode);
    const nextQueryString = nextSearchParams.toString();

    startTransition(() => {
      router.replace(`${pathname}?${nextQueryString}`, { scroll: false });
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <span className="text-[13px] font-medium leading-none text-slate-500">Hero state</span>
      <div
        className={`inline-flex flex-wrap gap-2 ${disabled ? "opacity-60" : ""}`}
        role="group"
        aria-label="Internal events demo hero state"
      >
        {heroModeOptions.map((option) => {
          const selected = option.value === (showUpcomingEvent ? "show" : "none");

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={disabled || isPending}
              aria-pressed={selected}
              className={`min-h-11 rounded-[14px] border px-4 py-2 text-sm font-medium transition ${
                disabled
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : selected
                    ? "cursor-pointer border-slate-950 bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)]"
                    : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
