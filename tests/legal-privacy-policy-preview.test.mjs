import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/privacy-policy/page.tsx";
const selectorPath = "src/components/sections/legal-privacy-policy-version-selector.tsx";
const contentPath = "src/app/t/privacy-policy/privacy-policy-content.mdx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("privacy policy preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/privacy-policy"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /QueryPie Privacy Policy \(Jan 15, 2026\)/);
  assert.match(source, /src\/app\/t\/privacy-policy\/privacy-policy-content\.mdx/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(source, /<BrandGradientCtaButton href="https:\/\/app\.querypie\.com\/">無料で試してみる<\/BrandGradientCtaButton>/);
});

test("privacy policy preview keeps adjacent source content, live selector semantics, and preview-aware footer link", () => {
  const selectorSource = readSource(selectorPath);
  const contentSource = readSource(contentPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(contentSource, /StaticH3 as="h1">\{'QueryPie Privacy Policy \(Jan 15, 2026\)'\}/);
  assert.match(contentSource, /PrivacyPolicyLanguageSelector language="en"/);
  assert.match(contentSource, /PrivacyPolicyVersionSelector language="en" currentVersion="26-01-15"/);
  assert.match(selectorSource, /window\.location\.assign\(buildVersionUrl\(language, nextVersion\)\)/);
  assert.match(selectorSource, /https:\/\/www\.querypie\.com\/ja\/privacy-policy-\$\{language\}\/\$\{version\}/);
  assert.match(footerSource, /label: "プライバシーポリシー", href: t\("\/privacy-policy", previewModeEnabled\)/);
});
