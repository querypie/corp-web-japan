import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/eula/page.tsx";
const helperPath = "src/lib/legal-preview/eula.tsx";
const contentPath = "src/content/legal-preview/eula.mdx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("eula preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/eula"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /EULA/);
  assert.match(source, /renderEulaPreviewMdx\(\)/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
});

test("eula preview uses local source content and preview-aware footer link", () => {
  const helperSource = readSource(helperPath);
  const contentSource = readSource(contentPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(helperSource, /join\(process\.cwd\(\), "src\/content\/legal-preview\/eula\.mdx"\)/);
  assert.match(helperSource, /buildPublicationMdxComponents/);
  assert.match(helperSource, /remarkPlugins: \[remarkGfm\]/);
  assert.match(contentSource, /End User License Agreement/);
  assert.match(footerSource, /label: "EULA", href: t\("\/eula", previewModeEnabled\)/);
});
