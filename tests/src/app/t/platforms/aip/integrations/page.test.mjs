import assert from "node:assert/strict";
import test from "node:test";
import { readSource } from "../../../../../../helpers/source-readers.mjs";

const pageSource = readSource("src/app/t/platforms/aip/integrations/page.tsx");
const sectionSource = readSource("src/components/sections/aip/integrations-page.tsx");
const cssSource = readSource("src/components/sections/aip/integrations-page.module.css");

test("AIP integrations page exports noindex metadata for the /t/platforms/aip/integrations route", () => {
  assert.match(pageSource, /canonical:\s*"\/t\/platforms\/aip\/integrations"/);
  assert.match(pageSource, /index:\s*false/);
  assert.match(pageSource, /follow:\s*false/);
  assert.match(pageSource, /title:\s*"QueryPie AI: インテグレーション"/);
  assert.doesNotMatch(pageSource, /AipIntegrationsPreviewPage/);
  assert.doesNotMatch(pageSource, /preview ページ/);
});

test("AIP integrations platform preview page keeps authored hero copy and CTA in page.tsx", () => {
  assert.match(pageSource, /AIPインテグレーション/);
  assert.match(pageSource, /MCPサーバーを介してお使いのビジネスツールに接続/);
  assert.match(pageSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(pageSource, /<AipFreeTrialCtaSection \/>/);
});

test("AIP integrations platform preview page keeps category and product catalog route-local with live-compatible numeric filters", () => {
  const categoryMatches = pageSource.match(/label: ".*?"/g) ?? [];
  assert.ok(categoryMatches.length >= 55, `expected category and product label entries, got ${categoryMatches.length}`);
  assert.match(pageSource, /const categories:/);
  assert.match(pageSource, /const products:/);
  assert.match(pageSource, /products\.length/);
  assert.match(pageSource, /key: "0", label: "ワークフロー自動化"/);
  assert.match(pageSource, /key: "3", label: "Googleサービス"/);
  assert.match(pageSource, /key: "5", label: "プロジェクト管理"/);
  assert.match(pageSource, /key: "8", label: "検索 & ナビゲーション"/);
  assert.match(pageSource, /currentCategory === "all" \|\| product.categoryKeys.includes\(currentCategory\)/);
  assert.match(pageSource, /href=\{`\/t\/platforms\/aip\/integrations\?category=\$\{category\.key\}`\}/);
  assert.doesNotMatch(pageSource, /categoryIds:/);
});

test("AIP integrations platform preview section primitives define the integration filter and grid UI", () => {
  assert.match(sectionSource, /AipIntegrationsCategoryLink/);
  assert.match(sectionSource, /AipIntegrationsProductCard/);
  assert.match(cssSource, /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(cssSource, /padding: 12px 32px/);
  assert.match(cssSource, /padding: 30px/);
  assert.match(cssSource, /background: #f6f8fa/);
});
