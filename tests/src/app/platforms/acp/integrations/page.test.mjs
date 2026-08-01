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

test("ACP integrations public page keeps concise ACP-specific hero copy and CTA in page.tsx", () => {
  assert.match(pageSource, /50種類以上のシステムを、ひとつの統制基盤へ。/);
  assert.match(pageSource, /<span className="block">データベース、サーバー、Kubernetes、Web\/SaaSまで。<\/span>/);
  assert.match(pageSource, /<span className="block">主要なシステムと直接連携し、アクセスを一元管理します。<\/span>/);
  assert.match(pageSource, /items-start/);
  assert.match(pageSource, /!max-w-\[420px\] !text-left !text-\[16px\]/);
  assert.match(pageSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(pageSource, /<SimpleCtaSection background="white">/);
  assert.match(pageSource, /<CtaTitle>アクセス統制を、次のAI活用へ。<\/CtaTitle>/);
  assert.match(pageSource, /href="\/contact-us\?inquiry=ai-consulting&product=acp"/);
  assert.doesNotMatch(pageSource, /AcpPageCta/);
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
  assert.match(pageSource, /<AipIntegrationsProductList columns=\{8\} compact>/);
  assert.match(cssSource, /\.content \{/);
  assert.match(cssSource, /max-width: 1200px/);
  assert.match(
    cssSource,
    /\.productListEightColumns \{\s*grid-template-columns: repeat\(8, minmax\(0, 1fr\)\)/,
  );
  assert.match(
    cssSource,
    /\.categoryItem \{[\s\S]*padding: 10px 20px;[\s\S]*border: 1px solid #d0d7de;[\s\S]*background: transparent;[\s\S]*color: #57606a;[\s\S]*font-size: 14px;[\s\S]*font-weight: 300/,
  );
  assert.match(cssSource, /\.compactProductList \{/);
  assert.match(cssSource, /\.compactProductList \.productItem \{\s*min-height: 128px/);
  assert.match(cssSource, /\.compactProductList \.icon,/);
  assert.match(cssSource, /width: 52px/);
  assert.match(cssSource, /\.compactProductList \.productItem \{\s*min-height: 140px/);
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
