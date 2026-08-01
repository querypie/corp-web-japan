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
  assert.match(pageSource, /title:\s*"AIPインテグレーション \| QueryPie AI"/);
  assert.doesNotMatch(pageSource, /AipIntegrationsPreviewPage/);
  assert.doesNotMatch(pageSource, /preview ページ/);
});

test("AIP integrations platform public page keeps authored hero copy and CTA in page.tsx", () => {
  assert.match(pageSource, /AIを、業務ツールとつなぐ。/);
  assert.match(pageSource, /主要な業務ツールやデータベースを、MCPサーバーでQueryPie AIPに接続/);
  assert.match(pageSource, /<AipIntegrationsProductList columns=\{8\} compact>/);
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
  assert.match(cssSource, /grid-template-columns: repeat\(8, minmax\(0, 1fr\)\)/);
  assert.match(cssSource, /padding: 10px 20px/);
  assert.match(cssSource, /\.compactProductList \.productItem \{[\s\S]*min-height: 128px[\s\S]*gap: 16px[\s\S]*padding: 20px 12px/);
  assert.match(cssSource, /background: #f6f8fa/);
  assert.doesNotMatch(cssSource, /min-height:\s*180px/);
  assert.match(cssSource, /@media \(max-width: 500px\)[\s\S]*\.categoryItem \{[\s\S]*padding: 9px 16px/);
  assert.match(cssSource, /@media \(max-width: 500px\)[\s\S]*padding-top: 120px/);
  assert.doesNotMatch(cssSource, /acpHeroSection/);
  assert.match(sectionSource, /<Image src=\{iconSrc\} alt=\{label\} width=\{52\} height=\{52\}/);
  assert.match(cssSource, /@media \(max-width: 500px\)[\s\S]*\.compactProductList \.icon,[\s\S]*\.compactProductList \.iconImage \{[\s\S]*width: 52px/);
});

test("AIP integrations platform page avoids nested content wrappers inside the hero content", () => {
  assert.doesNotMatch(pageSource, /<AipIntegrationsContent>\s*<AipIntegrationsCategoryList>/);
  assert.doesNotMatch(pageSource, /<AipIntegrationsContent>\s*<AipIntegrationsProductList>/);
});

test("old preview and legacy redirect routes are removed without compatibility redirects", () => {
  assert.equal(existsSync(new URL("../../../../../../../src/app/t/platforms/aip/integrations/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../../../../../../../src/app/platform/ai/aip/integrations/route.ts", import.meta.url)), false);
});
