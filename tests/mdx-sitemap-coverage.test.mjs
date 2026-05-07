import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("sitemap covers implemented MDX-backed public detail routes including redirect-backed local content pages", () => {
  const sitemap = read("src/app/sitemap.ts");

  assert.match(sitemap, /blogPostRecords/);
  assert.match(sitemap, /getBlogPublicationHref/);
  assert.match(sitemap, /\.\.\.blogDetailRoutes/);
  assert.doesNotMatch(sitemap, /blogPostRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);

  assert.match(sitemap, /whitepaperPublicationRecords/);
  assert.match(sitemap, /getWhitepaperPublicationHref/);
  assert.match(sitemap, /\.\.\.whitepaperDetailRoutes/);
  assert.doesNotMatch(sitemap, /whitepaperPublicationRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);

  assert.match(sitemap, /eventPostRecords/);
  assert.match(sitemap, /getEventPostHref/);
  assert.doesNotMatch(sitemap, /eventPostRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);

  assert.match(sitemap, /newsPublicationRecords/);
  assert.match(sitemap, /getNewsPublicationHref/);
  assert.doesNotMatch(sitemap, /newsPublicationRecords\s*\.filter\(\(\{ redirectUrl \}\) => !redirectUrl\)/s);

  assert.match(sitemap, /getUseCasePublicationHref/);
  assert.match(sitemap, /getAipDemoPublicationHref/);
  assert.match(sitemap, /getAcpDemoPublicationHref/);
  assert.match(sitemap, /\/introduction-deck\/\$\{id\}\/\$\{slug\}/);
  assert.match(sitemap, /\/glossary\/\$\{id\}\/\$\{slug\}/);
  assert.match(sitemap, /\/manuals\/\$\{id\}\/\$\{slug\}/);
});
