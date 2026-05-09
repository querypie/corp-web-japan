import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const pagePath = new URL("../src/app/t/services/aip/integrations/page.tsx", import.meta.url);
const sectionPath = new URL("../src/components/sections/aip-integrations-page.tsx", import.meta.url);
const cssPath = new URL("../src/components/sections/aip-integrations-page.module.css", import.meta.url);

const pageSource = fs.readFileSync(pagePath, "utf8");
const sectionSource = fs.readFileSync(sectionPath, "utf8");
const cssSource = fs.readFileSync(cssPath, "utf8");

test("AIP integrations preview page exports noindex metadata for the /t/services/aip/integrations route", () => {
  assert.match(pageSource, /canonical:\s*"\/t\/services\/aip\/integrations"/);
  assert.match(pageSource, /index:\s*false/);
  assert.match(pageSource, /follow:\s*false/);
  assert.match(pageSource, /title:\s*"QueryPie AI: インテグレーション"/);
});

test("AIP integrations preview page keeps authored hero copy and CTA in page.tsx", () => {
  assert.match(pageSource, /AIPインテグレーション/);
  assert.match(pageSource, /MCPサーバーを介してお使いのビジネスツールに接続/);
  assert.match(pageSource, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(pageSource, /14日間の無料トライアル/);
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
