export function chooseLocale({ jaHtml, enHtml }) {
  if (jaHtml?.trim()) return { locale: "ja", html: jaHtml.trim() };
  if (enHtml?.trim()) return { locale: "en", html: enHtml.trim() };
  throw new Error("missing Japanese and English locale body");
}

function normalizeParsedUrl(url) {
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
}

export function normalizeUrl(value) {
  const url = new URL(value);
  url.search = "";
  return normalizeParsedUrl(url);
}

export function normalizeUrlPreservingQuery(value) {
  return normalizeParsedUrl(new URL(value));
}

export function hasExactProductionEvidence({ sitemapXml, productionListHtml, expectedUrl }) {
  const expected = normalizeUrl(expectedUrl);
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => normalizeUrl(match[1]));
  const listUrls = [...productionListHtml.matchAll(/href=["']([^"']+)["']/g)].map((match) =>
    normalizeUrl(new URL(match[1], "https://www.querypie.com").href));
  return sitemapUrls.includes(expected) && listUrls.includes(expected);
}
