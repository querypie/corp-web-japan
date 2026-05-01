import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("news preview page and canonical routes are driven by news MDX publication records", () => {
  const previewPage = readSource("src/app/t/news/page.tsx");
  const canonicalRoute = readSource("src/app/news/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/news/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-news-publication-post.ts");
  const records = readSource("src/content/publications/news-publication-records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const types = readSource("src/lib/publications/types.ts");

  assert.equal(existsSync(new URL("../src/app/t/news/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/news/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/content/publications/news-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/get-news-publication-post.ts", import.meta.url)), true);

  assert.match(previewPage, /listNewsPublicationItems\(\)/);
  assert.match(previewPage, /canonical: "\/t\/news"/);
  assert.match(previewPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);

  assert.match(canonicalRoute, /getNewsPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getNewsPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getNewsPublicationPost\(id\);/);

  assert.match(idRoute, /listNewsPublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getNewsPublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /renderPublicationMdx/);
  assert.match(loader, /extractHeadingsFromMdx/);
  assert.match(records, /src\/content\/news/);
  assert.match(records, /badge: "ニュース"/);
  assert.match(hrefs, /news: "\/news"/);
  assert.match(types, /"news"/);
});
