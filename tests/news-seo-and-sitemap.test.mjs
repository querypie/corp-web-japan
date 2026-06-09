import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("local official news detail pages are indexable and sitemap includes news detail routes", () => {
  const newsDetailPage = read("src/app/news/[id]/[slug]/page.tsx");
  const sitemap = read("src/app/sitemap.ts");

  assert.match(newsDetailPage, /canonicalUrl = absoluteUrl\(getNewsPublicationHref\(id, record\.slug\)\)/);
  assert.match(newsDetailPage, /canonical:\s*canonicalUrl/);
  assert.match(newsDetailPage, /buildPublicationOpenGraphMetadata/);
  assert.match(newsDetailPage, /imageSrc: resolvePublicationOpenGraphImageSrc\(record\)/);
  assert.match(newsDetailPage, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(newsDetailPage, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(newsDetailPage, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);

  assert.match(sitemap, /newsPublicationRecords/);
  assert.doesNotMatch(sitemap, /newsPublicationRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);
  assert.match(sitemap, /absoluteUrl\(getNewsPublicationHref\(id, slug\)\)/);
  assert.match(sitemap, /\.\.\.newsDetailRoutes/);
});
