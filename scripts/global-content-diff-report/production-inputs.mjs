import { enumerateSources, productionSets } from "./discovery.mjs";
import { normalizeUrl } from "./lib.mjs";
import { SOURCE_FAMILIES } from "./source-family-map.mjs";

export async function loadProductionInputs(fetchText) {
  const listUrls = [...new Set(SOURCE_FAMILIES.map(({ productionListUrl }) => productionListUrl))];
  const [sitemapXml, ...listBodies] = await Promise.all([
    fetchText("https://www.querypie.com/sitemap.xml"),
    ...listUrls.map((url) => fetchText(url)),
  ]);

  return {
    sitemapXml,
    productionListHtmlByUrl: Object.fromEntries(listUrls.map((url, index) => [url, listBodies[index]])),
  };
}

export async function validateProductionInputs(globalRepo, { sitemapXml, productionListHtmlByUrl }) {
  const sources = await enumerateSources(globalRepo, { preserveQuery: true });
  const recognizedByListUrl = new Map();
  const sitemapRequiredByListUrl = new Map();
  for (const source of sources) {
    if (!source.sourceCanonicalUrl) continue;
    const listUrl = normalizeUrl(source.descriptor.productionListUrl);
    const urls = recognizedByListUrl.get(listUrl) || new Set();
    urls.add(source.sourceCanonicalUrl);
    recognizedByListUrl.set(listUrl, urls);
    if (source.meta.contentType !== "outlink") {
      const sitemapRequiredUrls = sitemapRequiredByListUrl.get(listUrl) || new Set();
      sitemapRequiredUrls.add(source.sourceCanonicalUrl);
      sitemapRequiredByListUrl.set(listUrl, sitemapRequiredUrls);
    }
  }
  const production = productionSets(sitemapXml, productionListHtmlByUrl, { preserveQuery: true });
  const intersects = (urls, recognized) => [...urls].some((url) => recognized.has(url));

  const listUrls = [...new Set(SOURCE_FAMILIES.map(({ productionListUrl }) => normalizeUrl(productionListUrl)))];
  for (const listUrl of listUrls) {
    const sitemapRequiredUrls = sitemapRequiredByListUrl.get(listUrl) || new Set();
    if (sitemapRequiredUrls.size > 0 && !intersects(production.sitemap, sitemapRequiredUrls)) {
      throw new Error(`production sitemap evidence does not contain a recognized Global source URL: ${listUrl}`);
    }
    if (!intersects(production.listByUrl.get(listUrl) || new Set(), recognizedByListUrl.get(listUrl) || new Set())) {
      throw new Error(`production list evidence does not contain a recognized Global source URL: ${listUrl}`);
    }
  }
}
