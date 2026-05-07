import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("sitemap covers implemented MDX-backed public detail routes and excludes redirect shadow records", () => {
  const sitemap = read("src/app/sitemap.ts");

  assert.match(sitemap, /blogPostRecords/);
  assert.match(sitemap, /getBlogPublicationHref/);
  assert.match(sitemap, /\.\.\.blogDetailRoutes/);

  assert.match(sitemap, /whitepaperPublicationRecords/);
  assert.match(sitemap, /getWhitepaperPublicationHref/);
  assert.match(sitemap, /\.\.\.whitepaperDetailRoutes/);

  assert.match(sitemap, /eventPostRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);
  assert.match(sitemap, /newsPublicationRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);

  assert.match(sitemap, /getUseCasePublicationHref/);
  assert.match(sitemap, /getAipDemoPublicationHref/);
  assert.match(sitemap, /getAcpDemoPublicationHref/);
  assert.match(sitemap, /\/introduction-deck\/\$\{id\}\/\$\{slug\}/);
  assert.match(sitemap, /\/glossary\/\$\{id\}\/\$\{slug\}/);
  assert.match(sitemap, /\/manuals\/\$\{id\}\/\$\{slug\}/);
});
