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

  useEffect(() => {
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      return;
    }

    const gtag = (window as WindowWithGtag).gtag;

    if (!gtag) {
      return;
    }

    const search = searchParams.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
      send_to: measurementId,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}
