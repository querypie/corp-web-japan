import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../helpers/source-readers.mjs";

test("news preview page and canonical routes are driven by news MDX publication records", () => {
  const previewPage = readSource("src/app/t/news/page.tsx");
  const listPage = readSource("src/components/sections/news-list-page.tsx");
  const canonicalRoute = readSource("src/app/news/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/news/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-news-publication-post.ts");
  const records = readSource("src/content/publications/news-publication-records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const types = readSource("src/lib/publications/types.ts");

  assert.equal(existsSync(new URL("../../src/app/t/news/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/app/news/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/content/publications/news-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/lib/publications/get-news-publication-post.ts", import.meta.url)), true);

  assert.match(previewPage, /listNewsPublicationItems\(\)/);
  assert.match(previewPage, /canonical: "\/t\/news"/);
  assert.match(previewPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);
  assert.match(previewPage, /NewsListPage/);
  assert.doesNotMatch(previewPage, /プレビュー一覧/);
  assert.doesNotMatch(previewPage, /ローカル MDX/);
  assert.match(listPage, /QueryPie AI の公式発表はローカル詳細ページで確認でき、外部メディア掲載は掲載元の記事へ直接移動します。/);
  assert.match(listPage, /target="_blank"/);

  assert.match(canonicalRoute, /getNewsPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getNewsPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getNewsPublicationPost\(id\);/);

  assert.match(idRoute, /listNewsPublicationIds\(\)/);
  assert.match(idRoute, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(idRoute, /redirect\(getNewsPublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /stripLeadingNewsTitleHeading/);
  assert.match(loader, /renderPublicationMdx/);
  assert.match(loader, /extractHeadingsFromMdx\(renderedSource\)/);
  assert.match(loader, /record\.redirectUrl \?\? getNewsPublicationHref\(record\.id, record\.slug\)/);
  assert.match(records, /src\/content\/news/);
  assert.match(records, /redirectUrl\?: string;/);
  assert.match(records, /redirectUrl:\s*typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
  assert.match(records, /href: record\.redirectUrl \?\? getPublicationHref\("news", record\.id, record\.slug\)/);
  assert.match(records, /sourceLabel: record\.redirectUrl \? "メディア掲載" : "公式発表"/);
  assert.match(records, /opensExternal: Boolean\(record\.redirectUrl\)/);
  assert.match(hrefs, /news: "\/news"/);
  assert.match(types, /"news"/);
});
