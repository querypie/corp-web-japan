import assert from "node:assert/strict";
import test from "node:test";
import { readRepoText } from "../../../../../../helpers/source-readers.mjs";

const pageSource = readRepoText("src/app/t/services/aip/integrations/page.tsx");
const sectionSource = readRepoText("src/components/sections/aip/integrations-page.tsx");
const cssSource = readRepoText("src/components/sections/aip/integrations-page.module.css");

test("AIP integrations page exports noindex metadata for the /t/services/aip/integrations route", () => {
  assert.match(pageSource, /canonical:\s*"\/t\/services\/aip\/integrations"/);
  assert.match(pageSource, /index:\s*false/);
  assert.match(pageSource, /follow:\s*false/);
  assert.match(pageSource, /title:\s*"QueryPie AI: インテグレーション"/);
  assert.doesNotMatch(pageSource, /AipIntegrationsPreviewPage/);
  assert.doesNotMatch(pageSource, /preview ページ/);
});

test("AIP integrations preview page keeps authored hero copy in page.tsx and preserves the expected CTA contract", () => {
  assert.match(pageSource, /AIPインテグレーション/);
  assert.match(pageSource, /MCPサーバーを介してお使いのビジネスツールに接続/);
  assert.match(pageSource, /AipFreeTrialCtaSection|SimpleCtaSection/);
});

test("AIP integrations preview page keeps category and product catalog route-local with keyword-based filters", () => {
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

test("AIP integrations preview section primitives define the integration filter and grid UI", () => {
  assert.match(sectionSource, /AipIntegrationsCategoryLink/);
  assert.match(sectionSource, /AipIntegrationsProductCard/);
  assert.match(cssSource, /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(cssSource, /padding: 12px 32px/);
  assert.match(cssSource, /padding: 30px/);
  assert.match(cssSource, /background: #f6f8fa/);
});
