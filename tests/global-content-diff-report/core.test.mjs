import assert from "node:assert/strict";
import test from "node:test";

import { chooseLocale, hasExactProductionEvidence, normalizeUrl, normalizeUrlPreservingQuery } from "../../scripts/global-content-diff-report/lib.mjs";
import { SOURCE_FAMILIES, canonicalContentUrl, sourceFamily, targetFamily } from "../../scripts/global-content-diff-report/source-family-map.mjs";

test("source-family manifest maps every Global public content menu family", () => {
  assert.deepEqual(SOURCE_FAMILIES.map(({ sourceCategory, sourceSection, targetFamily: family, optionalRoot = false }) => ({ sourceCategory, sourceSection, targetFamily: family, optionalRoot })), [
    { sourceCategory: "use-cases", sourceSection: "demo", targetFamily: "use-cases", optionalRoot: false },
    { sourceCategory: "aip-features", sourceSection: "demo", targetFamily: "demo/aip", optionalRoot: true },
    { sourceCategory: "acp-features", sourceSection: "demo", targetFamily: "demo/acp", optionalRoot: false },
    { sourceCategory: "blogs", sourceSection: "documentation", targetFamily: "blog", optionalRoot: false },
    { sourceCategory: "white-papers", sourceSection: "documentation", targetFamily: "whitepapers", optionalRoot: false },
    { sourceCategory: "voc", sourceSection: "documentation", targetFamily: "use-cases", optionalRoot: false },
    { sourceCategory: "manuals", sourceSection: "documentation", targetFamily: "manuals", optionalRoot: false },
    { sourceCategory: "events", sourceSection: "documentation", targetFamily: "events", optionalRoot: false },
    { sourceCategory: "glossary", sourceSection: "documentation", targetFamily: "glossary", optionalRoot: false },
    { sourceCategory: "introduction", sourceSection: "documentation", targetFamily: "introduction-deck", optionalRoot: false },
    { sourceCategory: "news", sourceSection: "news", targetFamily: "news", optionalRoot: false },
  ]);
  assert.equal(sourceFamily("news").relativeRoot, "src/content/news");
  assert.equal(targetFamily("news"), "news");
  assert.equal(canonicalContentUrl("news", "example"), "https://www.querypie.com/en/news/example");
  assert.equal(canonicalContentUrl("use-cases", "example"), "https://www.querypie.com/en/demo/use-cases/example");
  assert.equal(canonicalContentUrl("acp-features", "example"), "https://www.querypie.com/en/demo/acp/example");
});

test("chooses locale and normalizes production URLs", () => {
  assert.deepEqual(chooseLocale({ jaHtml: " <p>日本語</p> ", enHtml: "<p>English</p>" }), { locale: "ja", html: "<p>日本語</p>" });
  assert.deepEqual(chooseLocale({ jaHtml: "", enHtml: " <p>English</p> " }), { locale: "en", html: "<p>English</p>" });
  assert.throws(() => chooseLocale({ jaHtml: "", enHtml: "" }), /locale body/);
  assert.equal(normalizeUrl("https://WWW.QueryPie.com/en/blog/example/?utm=x#top"), "https://www.querypie.com/en/blog/example");
  assert.equal(normalizeUrlPreservingQuery("https://EXAMPLE.com/story/?a=1#top"), "https://example.com/story?a=1");
});

test("requires exact canonical URL in both production surfaces", () => {
  const expectedUrl = "https://www.querypie.com/en/blog/example";
  const valid = { sitemapXml: `<url><loc>${expectedUrl}/</loc></url>`, productionListHtml: '<a href="/en/blog/example?x=1">Example</a>', expectedUrl };
  assert.equal(hasExactProductionEvidence(valid), true);
  assert.equal(hasExactProductionEvidence({ ...valid, sitemapXml: "<loc>https://www.querypie.com/en/blog/example-extra</loc>" }), false);
});
