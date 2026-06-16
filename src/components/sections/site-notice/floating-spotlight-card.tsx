"use client";

import type { FocusEvent } from "react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import type { ActiveSiteNoticeFeaturedContent } from "@/lib/site-notice";
import {
  getSiteNoticeBrowserLocalStorage,
  readSiteNoticeSpotlightVisibilityState,
  SITE_NOTICE_SPOTLIGHT_STORAGE_KEY,
  type SiteNoticeSpotlightVisibilityState,
  writeSiteNoticeSpotlightVisibilityRecord,
  type SiteNoticeSpotlightDisposition,
} from "@/lib/site-notice-spotlight-storage";
import {
  sendSiteNoticeClickEvent,
  sendSiteNoticeDismissEvent,
  sendSiteNoticeViewEvent,
} from "@/lib/site-notice-analytics";
import { createSiteNoticeTrackingHref } from "@/lib/site-notice-utm";

type FloatingSpotlightCardProps = Pick<
  ActiveSiteNoticeFeaturedContent,
  "items" | "nextLabel" | "previousLabel" | "spotlightCtaLabel" | "spotlightDismissLabel" | "spotlightLabel"
> & {
  rotationIntervalMs?: number;
};

const defaultRotationIntervalMs = 4000;
const hiddenSpotlightCardViewportQuery = "(max-width: 1023px)";
const emptyVisibilityState: SiteNoticeSpotlightVisibilityState = {};

let cachedVisibilityRawValue: string | null = null;
let cachedVisibilityState: SiteNoticeSpotlightVisibilityState = emptyVisibilityState;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isSpotlightCardInVisibleViewport = () =>
  typeof window === "undefined" ||
  typeof window.matchMedia !== "function" ||
  !window.matchMedia(hiddenSpotlightCardViewportQuery).matches;

function subscribeToSiteNoticeVisibilityStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);

  return () => window.removeEventListener("storage", onStoreChange);
}

function getSiteNoticeVisibilitySnapshot() {
  const storage = getSiteNoticeBrowserLocalStorage();

  if (!storage) {
    return emptyVisibilityState;
  }

  let rawValue: string | null = null;

  try {
    rawValue = storage.getItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);
  } catch {
    return emptyVisibilityState;
  }

  if (rawValue === cachedVisibilityRawValue) {
    return cachedVisibilityState;
  }

  cachedVisibilityRawValue = rawValue;
  cachedVisibilityState = readSiteNoticeSpotlightVisibilityState(storage);

  return cachedVisibilityState;
}

function getServerSiteNoticeVisibilitySnapshot() {
  return emptyVisibilityState;
}

export function FloatingSpotlightCard({
  items,
  nextLabel,
  previousLabel,
  spotlightCtaLabel,
  spotlightDismissLabel,
  spotlightLabel,
  rotationIntervalMs = defaultRotationIntervalMs,
}: FloatingSpotlightCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const viewedItemIdsRef = useRef<Set<string>>(new Set());
  const visibilityState = useSyncExternalStore(
    subscribeToSiteNoticeVisibilityStore,
    getSiteNoticeVisibilitySnapshot,
    getServerSiteNoticeVisibilitySnapshot,
  );
  const renderableItems = useMemo(
    () => items.filter((item) => !visibilityState[item.id]),
    [items, visibilityState],
  );
  const normalizedActiveIndex = renderableItems.length > 0 ? activeIndex % renderableItems.length : 0;
  const activeItem = renderableItems[normalizedActiveIndex] ?? renderableItems[0];
  const canRotate = renderableItems.length > 1 && rotationIntervalMs > 0;

  useEffect(() => {
    if (!canRotate || isPaused || prefersReducedMotion()) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % renderableItems.length);
    }, rotationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [canRotate, isPaused, renderableItems.length, rotationIntervalMs]);

  useEffect(() => {
    if (
      !activeItem ||
      !isVisible ||
      !isSpotlightCardInVisibleViewport() ||
      viewedItemIdsRef.current.has(activeItem.id)
    ) {
      return;
    }

    viewedItemIdsRef.current.add(activeItem.id);
    sendSiteNoticeViewEvent(activeItem, "card");
  }, [activeItem, isVisible]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
      setIsPaused(false);
    }
  };

  const showPreviousItem = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + renderableItems.length) % renderableItems.length);
  };

  const showNextItem = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % renderableItems.length);
  };

  const recordDisposition = (disposition: SiteNoticeSpotlightDisposition) => {
    if (!activeItem) {
      return;
    }

    const storage = getSiteNoticeBrowserLocalStorage();

    if (!storage) {
      return;
    }

    writeSiteNoticeSpotlightVisibilityRecord(storage, activeItem.id, disposition);
  };

  if (!activeItem || !isVisible) {
    return null;
  }

  return (
    <aside
      {...componentNameDebugProps("FloatingSpotlightCard")}
      aria-label={spotlightLabel}
      className="fixed right-6 top-1/4 z-[900] hidden w-72 lg:block"
      data-testid="floating-spotlight-card"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-lg border border-slate-300 bg-white p-4 shadow-[0_18px_40px_rgba(13,28,47,0.16)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium leading-[18px] text-slate-600">{spotlightLabel}</span>
          <button
            aria-label={spotlightDismissLabel}
            className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-600 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-300"
            onClick={() => {
              sendSiteNoticeDismissEvent(activeItem, "card");
              recordDisposition("dismissed");
              setIsVisible(false);
            }}
            type="button"
          >
            <X aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
        </div>

        <Link
          className="group grid gap-3 text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-300"
          href={createSiteNoticeTrackingHref(activeItem.href, activeItem.id, "card")}
          onClick={() => {
            sendSiteNoticeClickEvent(activeItem, "card");
            recordDisposition("viewed");
          }}
        >
          <span className="relative block h-32 overflow-hidden rounded border border-slate-200/80 bg-slate-100">
            <Image
              alt={activeItem.imageAlt}
              className="object-cover transition duration-200 group-hover:scale-[1.02]"
              fill
              sizes="288px"
              src={activeItem.imageSrc}
            />
          </span>
          <span className="grid gap-1">
            <span className="line-clamp-2 text-base font-medium leading-[22px] text-slate-950">
              {activeItem.title}
            </span>
            <span className="text-xs leading-[17px] text-slate-600">{activeItem.spotlightMeta}</span>
          </span>
          <span className="flex min-h-9 items-center justify-center rounded border border-slate-950 px-3 text-sm font-medium leading-[18px] text-slate-950 transition group-hover:bg-slate-950 group-hover:text-white">
            {spotlightCtaLabel}
          </span>
        </Link>

        <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3">
          <div aria-hidden="true" className="flex items-center gap-1">
            {renderableItems.map((item, index) => (
              <span
                className={`h-1.5 w-1.5 rounded-full ${index === normalizedActiveIndex ? "bg-slate-950" : "bg-slate-300"}`}
                key={item.id}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label={previousLabel}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-300"
              onClick={showPreviousItem}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
            <button
              aria-label={nextLabel}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-300"
              onClick={showNextItem}
              type="button"
            >
              <ChevronRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
