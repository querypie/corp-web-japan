import assert from "node:assert/strict";
import test from "node:test";
import { readSource } from "../../../../../helpers/source-readers.mjs";
import { existsSync } from "node:fs";

const pageSource = readSource("src/app/platforms/aip/integrations/page.tsx");
const sectionSource = readSource("src/components/sections/aip/integrations-page.tsx");
const cssSource = readSource("src/components/sections/aip/integrations-page.module.css");

test("AIP integrations page exports indexable metadata for the canonical /platforms/aip/integrations route", () => {
  assert.match(pageSource, /canonical:\s*"\/platforms\/aip\/integrations"/);
  assert.match(pageSource, /index:\s*true/);
  assert.match(pageSource, /follow:\s*true/);
  assert.match(pageSource, /title:\s*"QueryPie AI: インテグレーション"/);
  assert.doesNotMatch(pageSource, /AipIntegrationsPreviewPage/);
  assert.doesNotMatch(pageSource, /preview ページ/);
});

test("AIP integrations platform public page keeps authored hero copy and CTA in page.tsx", () => {
  assert.match(pageSource, /AIPインテグレーション/);
  assert.match(pageSource, /MCPサーバーを介してお使いのビジネスツールに接続/);
  assert.match(pageSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(pageSource, /<AipFreeTrialCtaSection \/>/);
});

test("AIP integrations platform public page keeps category and product catalog route-local with keyword-based filters", () => {
  const categoryMatches = pageSource.match(/label: ".*?"/g) ?? [];
  assert.ok(categoryMatches.length >= 55, `expected category and product label entries, got ${categoryMatches.length}`);
  assert.match(pageSource, /const categories:/);
  assert.match(pageSource, /const products:/);
  assert.match(pageSource, /products\.length/);
  assert.match(pageSource, /workflow-automation/);
  assert.match(pageSource, /google-workspace/);
  assert.match(pageSource, /project-management/);
  assert.match(pageSource, /search-navigation/);
  assert.match(pageSource, /currentCategory === "all" \|\| product.categoryKeys.includes\(currentCategory\)/);
  assert.doesNotMatch(pageSource, /href=\{`\/t\/services\/aip\/integrations\?category=\$\{category\.id\}`\}/);
  assert.doesNotMatch(pageSource, /categoryIds:/);
});

test("AIP integrations platform section primitives define the integration filter and grid UI", () => {
  assert.match(sectionSource, /AipIntegrationsCategoryLink/);
  assert.match(sectionSource, /AipIntegrationsProductCard/);
  assert.doesNotMatch(sectionSource, /components\/sections\/platform\/page-primitives/);
  assert.match(cssSource, /\.content \{/);
  assert.match(cssSource, /max-width: 1200px/);
  assert.match(cssSource, /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(cssSource, /padding: 12px 32px/);
  assert.match(cssSource, /padding: 30px/);
  assert.match(cssSource, /background: #f6f8fa/);
  assert.doesNotMatch(cssSource, /min-height:\s*180px/);
  assert.match(cssSource, /padding-left: 24px/);
  assert.match(cssSource, /padding-right: 24px/);
  assert.match(cssSource, /@media \(max-width: 500px\)[\s\S]*padding-top: 120px/);
  assert.doesNotMatch(cssSource, /acpHeroSection/);
  assert.match(cssSource, /@media \(max-width: 500px\)[\s\S]*\.icon[\s\S]*width: 60px/);
  assert.match(cssSource, /@media \(max-width: 500px\)[\s\S]*\.iconImage[\s\S]*width: 60px/);
});

test("AIP integrations platform page avoids nested content wrappers inside the hero content", () => {
  assert.doesNotMatch(pageSource, /<AipIntegrationsContent>\s*<AipIntegrationsCategoryList>/);
  assert.doesNotMatch(pageSource, /<AipIntegrationsContent>\s*<AipIntegrationsProductList>/);
});

test("old preview and legacy redirect routes are removed without compatibility redirects", () => {
  assert.equal(existsSync(new URL("../../../../../../../src/app/t/platforms/aip/integrations/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../../../../../../../src/app/platform/ai/aip/integrations/route.ts", import.meta.url)), false);
});
