const querypieContentRootSegments = [
  "company",
  "cookie-preference",
  "eula",
  "features",
  "plans",
  "sales-deck",
  "search",
  "solutions",
] as const;

const querypieContentFilePaths = [
  "/rss.xml",
  "/rss-en-blog.xml",
  "/rss-en-learn.xml",
  "/rss-en-webinar.xml",
  "/rss-ja-blog.xml",
  "/rss-ja-learn.xml",
  "/rss-ja-webinar.xml",
  "/rss-ko-blog.xml",
  "/rss-ko-learn.xml",
  "/rss-ko-webinar.xml",
] as const;

const querypieLocales = ["en", "ja", "ko"] as const;

const querypieOrigin = "https://www.querypie.com";

function normalizePathname(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export function getQueryPieContentRedirectPath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (querypieContentFilePaths.includes(normalizedPathname as (typeof querypieContentFilePaths)[number])) {
    return normalizedPathname;
  }

  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const [firstSegment, secondSegment] = segments;

  if (
    querypieContentRootSegments.includes(
      firstSegment as (typeof querypieContentRootSegments)[number],
    )
  ) {
    return normalizedPathname;
  }

  if (
    querypieLocales.includes(firstSegment as (typeof querypieLocales)[number]) &&
    secondSegment &&
    querypieContentRootSegments.includes(
      secondSegment as (typeof querypieContentRootSegments)[number],
    )
  ) {
    return normalizedPathname;
  }

  return null;
}

export function buildQueryPieContentRedirectUrl(pathname: string, search = "") {
  const redirectPath = getQueryPieContentRedirectPath(pathname);

  if (!redirectPath) {
    return null;
  }

  const targetUrl = new URL(redirectPath, querypieOrigin);

  targetUrl.search = search;

  return targetUrl;
}
