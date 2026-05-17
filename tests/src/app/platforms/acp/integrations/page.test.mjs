import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { readSource } from "../../../../../helpers/source-readers.mjs";

const pageSource = readSource("src/app/platforms/acp/integrations/page.tsx");
const sectionSource = readSource(
  "src/components/sections/aip/integrations-page.tsx",
);
const cssSource = readSource(
  "src/components/sections/aip/integrations-page.module.css",
);

test("ACP integrations page exports indexable metadata for the canonical /platforms/acp/integrations route", () => {
  assert.match(pageSource, /canonical:\s*"\/platforms\/acp\/integrations"/);
  assert.match(pageSource, /index:\s*true/);
  assert.match(pageSource, /follow:\s*true/);
  assert.match(
    pageSource,
    /title:\s*"QueryPie: インテグレーション \| QueryPie AI"/,
  );
});

test("ACP integrations public page keeps authored hero copy and CTA in page.tsx", () => {
  assert.match(pageSource, /ACP統合機能/);
  assert.match(
    pageSource,
    /データソースに直接接続し、すべてのシステム、アプリケーション、およびサービスを完全に把握することが可能です。/,
  );
  assert.match(pageSource, /from "@\/components\/sections\/acp\/static-page"/);
  assert.match(pageSource, /<AcpPageCta>/);
  assert.match(
    pageSource,
    /<AcpPageCtaTitle>まずは小さく、失敗しないAXを始めよう<\/AcpPageCtaTitle>/,
  );
});

test("ACP integrations public page keeps category and product catalog route-local with keyword-based filters", () => {
  const labelMatches = pageSource.match(/"?label"?: ".*?"/g) ?? [];
  assert.ok(
    labelMatches.length >= 50,
    `expected category and product label entries, got ${labelMatches.length}`,
  );
  assert.match(pageSource, /const categories:/);
  assert.match(pageSource, /const products:/);
  assert.match(pageSource, /products\.length/);
  assert.match(pageSource, /data-sources/);
  assert.match(pageSource, /cloud-containers/);
  assert.match(pageSource, /identity-providers/);
  assert.match(
    pageSource,
    /currentCategory === "all"\s*\|\|\s*product\.categoryKeys\.includes\(currentCategory\)/,
  );
  assert.match(
    pageSource,
    /href="\/platforms\/acp\/integrations\?category=all"/,
  );
  assert.match(
    pageSource,
    /href=\{`\/platforms\/acp\/integrations\?category=\$\{category\.key\}`\}/,
  );
  assert.doesNotMatch(pageSource, /\/t\/platforms\/acp\/integrations/);
  assert.doesNotMatch(pageSource, /legacyCategoryMap/);
  assert.doesNotMatch(pageSource, /category-\d/);
  assert.doesNotMatch(pageSource, /"categoryKeys":/);
  assert.doesNotMatch(pageSource, /"label":/);
  assert.doesNotMatch(pageSource, /"svgFilename":/);
});

test("ACP integrations platform section primitives define the integration filter and grid UI", () => {
  assert.match(sectionSource, /AipIntegrationsCategoryLink/);
  assert.match(sectionSource, /AipIntegrationsProductCard/);
  assert.match(cssSource, /\.content \{/);
  assert.match(cssSource, /max-width: 1200px/);
  assert.match(
    cssSource,
    /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/,
  );
  assert.match(cssSource, /padding: 12px 32px/);
  assert.match(cssSource, /padding: 30px/);
  assert.match(cssSource, /background: #f6f8fa/);
});

test("old ACP integrations preview route is removed without a compatibility redirect", () => {
  assert.equal(
    existsSync(
      new URL(
        "../../../../../../../src/app/t/platforms/acp/integrations/page.tsx",
        import.meta.url,
      ),
    ),
    false,
  );
});
