export type SiteNoticeSurface = "bar" | "card";

const queryPieUrlBase = "https://querypie.ai";
const queryPieDomains = new Set(["querypie.ai", "www.querypie.ai", "stage.querypie.ai"]);

const siteNoticeUtmParams = (itemId: string, surface: SiteNoticeSurface) => ({
  utm_campaign: itemId,
  utm_content: surface,
  utm_id: `sn_${itemId}`,
  utm_medium: "notice",
  utm_source: "qp",
});

const parseUrl = (href: string) => {
  try {
    return new URL(href);
  } catch {
    return new URL(href, queryPieUrlBase);
  }
};

const isQueryPieOwnedUrl = (url: URL) => queryPieDomains.has(url.hostname);

export function createSiteNoticeTrackingHref(href: string, itemId: string, surface: SiteNoticeSurface) {
  const url = parseUrl(href);

  if (!isQueryPieOwnedUrl(url)) {
    return href;
  }

  const params = siteNoticeUtmParams(itemId, surface);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return `${url.pathname}${url.search}${url.hash}`;
}
