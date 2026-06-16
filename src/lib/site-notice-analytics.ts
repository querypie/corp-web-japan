import type { SiteNoticeSurface } from "@/lib/site-notice-utm";

type SiteNoticeAnalyticsItem = {
  href: string;
  id: string;
  title: string;
};

type SiteNoticeEventName = "view_promotion" | "select_promotion" | "site_notice_dismiss";

type GtagGlobal = typeof globalThis & {
  gtag?: (command: "event", eventName: SiteNoticeEventName, params: Record<string, unknown>) => void;
};

const getGtag = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const candidate = (globalThis as GtagGlobal).gtag;

  return typeof candidate === "function" ? candidate : null;
};

export function createSiteNoticeAnalyticsParams(item: SiteNoticeAnalyticsItem, surface: SiteNoticeSurface) {
  const promotionId = `sn_${item.id}`;
  const sharedParams = {
    promotion_id: promotionId,
    promotion_name: item.id,
    creative_slot: surface,
    creative_name: item.title,
    site_notice_id: item.id,
    site_notice_surface: surface,
    site_notice_title: item.title,
    site_notice_destination: item.href,
  };

  return {
    ...sharedParams,
    items: [
      {
        item_id: item.id,
        item_name: item.title,
        promotion_id: promotionId,
        promotion_name: item.id,
        creative_slot: surface,
        creative_name: item.title,
      },
    ],
  };
}

function sendSiteNoticeAnalyticsEvent(
  eventName: SiteNoticeEventName,
  item: SiteNoticeAnalyticsItem,
  surface: SiteNoticeSurface,
) {
  const gtag = getGtag();

  if (!gtag) {
    return;
  }

  try {
    gtag("event", eventName, createSiteNoticeAnalyticsParams(item, surface));
  } catch {
    // Analytics must never block navigation, dismissal, or visibility persistence.
  }
}

export const sendSiteNoticeViewEvent = (item: SiteNoticeAnalyticsItem, surface: SiteNoticeSurface) => {
  sendSiteNoticeAnalyticsEvent("view_promotion", item, surface);
};

export const sendSiteNoticeClickEvent = (item: SiteNoticeAnalyticsItem, surface: SiteNoticeSurface) => {
  sendSiteNoticeAnalyticsEvent("select_promotion", item, surface);
};

export const sendSiteNoticeDismissEvent = (item: SiteNoticeAnalyticsItem, surface: SiteNoticeSurface) => {
  sendSiteNoticeAnalyticsEvent("site_notice_dismiss", item, surface);
};
