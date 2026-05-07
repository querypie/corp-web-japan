"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type InternalEventsDemoHeroToggleProps = {
  showUpcomingEvent: boolean;
  disabled?: boolean;
};

export function InternalEventsDemoHeroToggle({
  showUpcomingEvent,
  disabled = false,
}: InternalEventsDemoHeroToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (disabled) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    const nextShowUpcomingEvent = !showUpcomingEvent;

    if (nextShowUpcomingEvent) {
      nextSearchParams.delete("upcoming");
    } else {
      nextSearchParams.set("upcoming", "none");
    }

    const nextQueryString = nextSearchParams.toString();

    startTransition(() => {
      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, { scroll: false });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      aria-pressed={showUpcomingEvent}
      aria-label={showUpcomingEvent ? "Switch to no upcoming event state" : "Switch to show upcoming event state"}
      className={`inline-flex min-h-12 items-center gap-3 rounded-full border px-3 py-2 text-left transition ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : "cursor-pointer border-slate-200 bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-300"
      }`}
    >
      <span className="text-[13px] font-medium leading-none text-slate-500">Hero mode</span>
      <span
        className={`relative flex h-7 w-[52px] items-center rounded-full p-1 transition ${
          showUpcomingEvent ? "bg-slate-950" : "bg-slate-300"
        }`}
        aria-hidden="true"
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            showUpcomingEvent ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      <span className="text-sm font-medium leading-none text-slate-950">
        {showUpcomingEvent ? "Show Upcoming Event" : "No Upcoming Event"}
      </span>
    </button>
  );
}
