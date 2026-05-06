import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../helpers/source-readers.mjs";

test("news public page and canonical routes are driven by news MDX publication records", () => {
  const publicPage = readSource("src/app/news/page.tsx");
  const listPage = readSource("src/components/sections/news-list-page.tsx");
  const sectionComponents = readSource("src/components/sections/news-page-section.tsx");
  const canonicalRoute = readSource("src/app/news/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/news/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-news-publication-post.ts");
  const records = readSource("src/lib/publications/news-publication-records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const types = readSource("src/lib/publications/types.ts");

  assert.equal(existsSync(new URL("../../src/app/news/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/app/t/news/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../../src/app/news/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/lib/publications/news-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/lib/publications/get-news-publication-post.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../src/components/sections/news-page-section.tsx", import.meta.url)), true);

  assert.match(publicPage, /listNewsPublicationItems\(\)/);
  assert.match(publicPage, /canonical: "\/news"/);
  assert.doesNotMatch(publicPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);
  assert.match(publicPage, /NewsArticleList/);
  assert.match(publicPage, /NewsPageSection/);
  assert.match(publicPage, />\s*News\s*</);
  assert.match(publicPage, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(publicPage, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.match(publicPage, /https:\/\/app\.querypie\.com\//);
  assert.doesNotMatch(publicPage, /プレビュー一覧/);
  assert.doesNotMatch(publicPage, /ローカル MDX/);
  assert.doesNotMatch(publicPage, /description=\{|description:\s*</);

  assert.match(listPage, /function NewsCard/);
  assert.match(listPage, /export function NewsArticleList/);
  assert.doesNotMatch(listPage, /まずは小さく、失敗しないAXを始めよう/);
  assert.doesNotMatch(listPage, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.doesNotMatch(listPage, />\s*News\s*</);

  assert.match(sectionComponents, /export function NewsPageSection/);
  assert.match(sectionComponents, /export function NewsPageNavItem/);
  assert.match(sectionComponents, /export function NewsFinalCtaSection/);
  assert.match(sectionComponents, /export function NewsFinalCtaAction/);

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
  assert.match(records, /sourceLabel\?: string;/);
  assert.match(records, /redirectUrl:\s*typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
  assert.match(records, /sourceLabel:\s*typeof sourceLabelValue === "string" \? sourceLabelValue : undefined/);
  assert.match(records, /href: getPublicationHref\("news", record\.id, record\.slug\)/);
  assert.match(records, /sourceLabel: record\.sourceLabel \?\? \(record\.redirectUrl \? "メディア掲載" : "公式発表"\)/);
  assert.match(records, /opensExternal: false/);
  assert.match(hrefs, /news: "\/news"/);
  assert.match(types, /"news"/);
});
