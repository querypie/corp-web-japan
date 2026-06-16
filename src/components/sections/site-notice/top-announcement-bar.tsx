"use client";

import type { FocusEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import type { ActiveSiteNoticeFeaturedContent } from "@/lib/site-notice";
import {
  getSiteNoticeBrowserLocalStorage,
  writeSiteNoticeSpotlightVisibilityRecord,
} from "@/lib/site-notice-spotlight-storage";
import { sendSiteNoticeClickEvent, sendSiteNoticeViewEvent } from "@/lib/site-notice-analytics";
import { createSiteNoticeTrackingHref } from "@/lib/site-notice-utm";

type TopAnnouncementBarProps = {
  content: ActiveSiteNoticeFeaturedContent | null;
  rotationIntervalMs?: number;
};

type SiteNoticeAnnouncementItem = ActiveSiteNoticeFeaturedContent["items"][number];

const defaultRotationIntervalMs = 4000;
const carouselItemHeightPx = 32;
const visibleAnnouncementBarViewportQuery = "(max-width: 1023px)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isAnnouncementBarInVisibleViewport = () =>
  typeof window === "undefined" ||
  typeof window.matchMedia !== "function" ||
  window.matchMedia(visibleAnnouncementBarViewportQuery).matches;

function recordSiteNoticeItemAsViewed(itemId: string) {
  const storage = getSiteNoticeBrowserLocalStorage();

  if (!storage) {
    return;
  }

  writeSiteNoticeSpotlightVisibilityRecord(storage, itemId, "viewed");
}

export function TopAnnouncementBar({
  content,
  rotationIntervalMs = defaultRotationIntervalMs,
}: TopAnnouncementBarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const viewedItemIdsRef = useRef<Set<string>>(new Set());
  const items = content?.items ?? [];
  const activeItem = items[activeIndex] ?? items[0];
  const canRotate = items.length > 1 && rotationIntervalMs > 0;
  const carouselOffsetPx = activeIndex * carouselItemHeightPx;

  useEffect(() => {
    if (!canRotate || isPaused || prefersReducedMotion()) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, rotationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [canRotate, isPaused, items.length, rotationIntervalMs]);

  useEffect(() => {
    if (!activeItem || !isAnnouncementBarInVisibleViewport() || viewedItemIdsRef.current.has(activeItem.id)) {
      return;
    }

    viewedItemIdsRef.current.add(activeItem.id);
    sendSiteNoticeViewEvent(activeItem, "bar");
  }, [activeItem]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
      setIsPaused(false);
    }
  };

  const handleAnnouncementClick = (item: SiteNoticeAnnouncementItem) => {
    sendSiteNoticeClickEvent(item, "bar");
    recordSiteNoticeItemAsViewed(item.id);
  };

  if (!content || !activeItem) {
    return null;
  }

  return (
    <section
      {...componentNameDebugProps("TopAnnouncementBar")}
      aria-label={content.ariaLabel}
      className="sticky top-[var(--gnb-height)] z-[900] mt-[var(--gnb-height)] block w-full border-y border-slate-200/80 bg-white lg:hidden"
      data-testid="top-announcement-bar"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex h-[72px] w-full items-center justify-between gap-3 overflow-hidden px-4 sm:h-16 sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <span className="inline-flex shrink-0 items-center rounded border border-slate-300 px-2 py-1 text-xs font-medium leading-4 text-slate-950">
            {content.badgeLabel}
          </span>

          <div className="relative h-8 min-w-0 flex-1 overflow-hidden">
            <div
              aria-live="polite"
              className="flex flex-col transition-transform duration-500 ease-out"
              data-testid="top-announcement-bar-track"
              id="top-announcement-bar-carousel"
              style={{ transform: `translateY(-${carouselOffsetPx}px)` }}
            >
              {items.map((item) => (
                <Link
                  aria-hidden={item.id === activeItem.id ? undefined : true}
                  className="flex h-8 min-w-0 items-center gap-3 text-slate-950 no-underline hover:underline hover:underline-offset-4"
                  data-active={item.id === activeItem.id}
                  data-testid={item.id === activeItem.id ? "top-announcement-bar-link" : undefined}
                  href={createSiteNoticeTrackingHref(item.href, item.id, "bar")}
                  key={item.id}
                  onClick={() => handleAnnouncementClick(item)}
                  tabIndex={item.id === activeItem.id ? undefined : -1}
                >
                  <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-6 sm:text-base">
                    {item.title}
                  </span>
                  <span aria-hidden="true" className="hidden h-1 w-1 shrink-0 rounded-full bg-slate-300 sm:block" />
                  <span className="hidden shrink-0 whitespace-nowrap text-sm leading-5 text-slate-600 sm:block">
                    {item.meta}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
