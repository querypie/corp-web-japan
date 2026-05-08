import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/eula/page.tsx";
const contentPath = "src/app/t/eula/eula-content.mdx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("eula preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/eula"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /End User License Agreement/);
  assert.match(source, /src\/app\/t\/eula\/eula-content\.mdx/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(source, /<BrandGradientCtaButton href="https:\/\/app\.querypie\.com\/">無料で試してみる<\/BrandGradientCtaButton>/);
});

test("eula preview keeps adjacent source content and preview-aware footer link", () => {
  const contentSource = readSource(contentPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(contentSource, /StaticH1>\{'End User License Agreement'\}/);
  assert.match(contentSource, /# PART I: GENERAL TERMS/);
  assert.match(contentSource, /www\.querypie\.com/);
  assert.match(footerSource, /label: "EULA", href: t\("\/eula", previewModeEnabled\)/);
});
