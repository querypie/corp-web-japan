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

const querypieExactRedirectPaths = [
  "/api/og/ja",
  "/privacy-policy-en/26-01-15",
  "/privacy-policy-ko",
] as const;

const querypieLocales = ["en", "ja", "ko"] as const;

const querypieOrigin = "https://www.querypie.com";

type QueryPieContentRootSegment = (typeof querypieContentRootSegments)[number];
type QueryPieExactRedirectPath = (typeof querypieExactRedirectPaths)[number];
type QueryPieLocale = (typeof querypieLocales)[number];

function normalizePathname(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

function splitPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function isQueryPieContentFilePath(pathname: string): boolean {
  return querypieContentFilePaths.includes(pathname as (typeof querypieContentFilePaths)[number]);
}

function isQueryPieExactRedirectPath(pathname: string): pathname is QueryPieExactRedirectPath {
  return querypieExactRedirectPaths.includes(pathname as QueryPieExactRedirectPath);
}

function isQueryPieContentRootSegment(value: string | undefined): value is QueryPieContentRootSegment {
  if (!value) {
    return false;
  }

  return querypieContentRootSegments.includes(value as QueryPieContentRootSegment);
}

function isQueryPieLocale(value: string | undefined): value is QueryPieLocale {
  if (!value) {
    return false;
  }

  return querypieLocales.includes(value as QueryPieLocale);
}

function matchesDirectQueryPieContentPath(pathname: string): boolean {
  const [firstSegment] = splitPathSegments(pathname);

  return isQueryPieContentRootSegment(firstSegment);
}

function matchesLocalizedQueryPieContentPath(pathname: string): boolean {
  const [localeSegment, contentRootSegment] = splitPathSegments(pathname);

  return isQueryPieLocale(localeSegment) && isQueryPieContentRootSegment(contentRootSegment);
}

/**
 * querypie.com redirect 대상은 아래 세 패턴만 허용한다.
 * 1) runtime log에서 확인된 exact path 중 querypie.com에서 200이 검증된 경로
 * 2) sitemap에 직접 노출되는 file-like path (`/rss.xml` 등)
 * 3) sitemap의 주요 content namespace 경로
 *    - direct: `/{contentRoot}/...`
 *    - localized: `/{lang}/{contentRoot}/...`
 */
export function getQueryPieContentRedirectPath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (isQueryPieExactRedirectPath(normalizedPathname)) {
    return normalizedPathname;
  }

  if (isQueryPieContentFilePath(normalizedPathname)) {
    return normalizedPathname;
  }

  if (matchesDirectQueryPieContentPath(normalizedPathname)) {
    return normalizedPathname;
  }

  if (matchesLocalizedQueryPieContentPath(normalizedPathname)) {
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
