"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type GoogleAnalyticsPageViewTrackerProps = {
  measurementId: string;
};

type WindowWithGtag = Window & {
  gtag?: (...args: [string, ...unknown[]]) => void;
};

export function GoogleAnalyticsPageViewTracker({
  measurementId,
}: GoogleAnalyticsPageViewTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialPageView = useRef(false);
  const previousPageLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      previousPageLocation.current = window.location.href;
      return;
    }

    const currentPageLocation = window.location.href;
    const gtag = (window as WindowWithGtag).gtag;

    if (!gtag) {
      previousPageLocation.current = currentPageLocation;
      return;
    }

    const search = searchParams.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    try {
      gtag("event", "page_view", {
        page_title: document.title,
        page_location: currentPageLocation,
        page_path: pagePath,
        page_referrer: previousPageLocation.current,
        send_to: measurementId,
      });
    } catch {
      // Analytics must never block App Router navigation.
    } finally {
      previousPageLocation.current = currentPageLocation;
    }
  }, [measurementId, pathname, searchParams]);

  return null;
}
