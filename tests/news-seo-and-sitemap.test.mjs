import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("local official news detail pages are indexable and sitemap includes news detail routes", () => {
  const newsDetailPage = read("src/app/news/[id]/[slug]/page.tsx");
  const sitemap = read("src/app/sitemap.ts");

  assert.match(newsDetailPage, /canonical:\s*absoluteUrl\(getNewsPublicationHref\(id, record\.slug\)\)/);
  assert.match(newsDetailPage, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(newsDetailPage, /if \(record\.redirectUrl\) \{\s*return \{\s*robots:\s*\{\s*index: false,\s*follow: false,\s*\},\s*\};\s*\}/s);

  assert.match(sitemap, /newsPublicationRecords/);
  assert.match(sitemap, /filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/);
  assert.match(sitemap, /absoluteUrl\(getNewsPublicationHref\(id, slug\)\)/);
  assert.match(sitemap, /\.\.\.newsDetailRoutes/);
});
