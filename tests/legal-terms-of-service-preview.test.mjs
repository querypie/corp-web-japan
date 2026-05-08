import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/terms-of-service/page.tsx";
const helperPath = "src/lib/legal-preview/terms-of-service.tsx";
const contentPath = "src/content/legal-preview/terms-of-service.mdx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("terms of service preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/terms-of-service"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /renderTermsOfServicePreviewMdx\(\)/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.doesNotMatch(source, /corp-web-contents \/ corp-web-app/);
  assert.doesNotMatch(source, /法務・ポリシー関連のご質問/);
});

test("terms of service preview uses local source content with live-like heading structure and preview-aware footer link", () => {
  const helperSource = readSource(helperPath);
  const contentSource = readSource(contentPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(helperSource, /readFile\(sourcePath, "utf8"\)/);
  assert.match(helperSource, /join\(process\.cwd\(\), "src\/content\/legal-preview\/terms-of-service\.mdx"\)/);
  assert.match(helperSource, /buildPublicationMdxComponents/);
  assert.match(helperSource, /remarkPlugins: \[remarkGfm\]/);
  assert.match(helperSource, /<h1 id=\{legalHeadingId\(children\)\}/);
  assert.match(helperSource, /return <h2 id=\{legalHeadingId\(children\)\}>\{children\}<\/h2>/);
  assert.match(contentSource, /QueryPie Terms of Service/);
  assert.match(footerSource, /label: "利用規約", href: t\("\/terms-of-service", previewModeEnabled\)/);
});
