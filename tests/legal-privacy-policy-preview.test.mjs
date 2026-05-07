import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/privacy-policy/page.tsx";
const helperPath = "src/lib/legal-preview/privacy-policy.tsx";
const selectorPath = "src/components/sections/legal-privacy-policy-version-selector.tsx";
const contentPath = "src/content/legal-preview/privacy-policy.mdx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("privacy policy preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/privacy-policy"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /プライバシーポリシー/);
  assert.match(source, /renderPrivacyPolicyPreviewMdx\(\)/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
});

test("privacy policy preview uses local source content, selector helpers, and preview-aware footer link", () => {
  const helperSource = readSource(helperPath);
  const selectorSource = readSource(selectorPath);
  const contentSource = readSource(contentPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(helperSource, /join\(process\.cwd\(\), "src\/content\/legal-preview\/privacy-policy\.mdx"\)/);
  assert.match(helperSource, /PrivacyPolicyLanguageSelector/);
  assert.match(helperSource, /PrivacyPolicyVersionSelector: LegalPrivacyPolicyVersionSelector/);
  assert.match(selectorSource, /router\.push\(`\/privacy-policy-\$\{language\}\/\$\{nextVersion\}`\)/);
  assert.match(contentSource, /QueryPie Privacy Policy/);
  assert.match(contentSource, /PrivacyPolicyVersionSelector language="en" currentVersion="26-01-15"/);
  assert.match(footerSource, /label: "プライバシーポリシー", href: t\("\/privacy-policy", previewModeEnabled\)/);
});
