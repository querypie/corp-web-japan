import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("header exposes the preview toggle UI and preview-navigation API route again", () => {
  const headerClient = readSource("src/components/layout/site-header-client.tsx");
  const siteHeader = readSource("src/components/layout/site-header.tsx");
  const previewNavigation = readSource("src/lib/preview-navigation.ts");

  assert.match(headerClient, /PreviewModeToggle/);
  assert.match(headerClient, /showPreviewModeToggle/);
  assert.match(siteHeader, /showPreviewModeToggle=\{showToggle\}/);
  assert.match(previewNavigation, /return cookieValue === "on";/);
  assert.equal(existsSync(new URL("../src/components/layout/preview-mode-toggle.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/api/preview-navigation/route.ts", import.meta.url)), true);
});

test("footer keeps the preview-only Internal section when preview mode is enabled", () => {
  const footer = readSource("src/components/layout/site-footer.tsx");

  assert.match(footer, /previewModeEnabled\s*\?\s*\[(?:internalFooterColumn|\{\s*\.\.\.internalFooterColumn,\s*mobileLayout:\s*"single"\s+as\s+const\s*\})\]/);
  assert.match(footer, /title:\s*"Internal"/);
  assert.match(footer, /label:\s*"Internal Hub"/);
  assert.match(footer, /label:\s*"Whitepaper Gating Demo"/);
  assert.match(footer, /label:\s*"MDX List Demo"/);
  assert.match(footer, /label:\s*"Events Demo"/);
  assert.match(footer, /label:\s*"Load More Demo"/);
  assert.match(footer, /footerLinksPreview/);
});

test("footer demo links point to the rolled-out canonical list routes", () => {
  const footer = readSource("src/components/layout/site-footer.tsx");

  assert.match(footer, /label:\s*"活用事例", href:\s*"\/demo\/use-cases"/);
  assert.match(footer, /label:\s*"AIP 機能", href:\s*"\/demo\/aip"/);
  assert.match(footer, /label:\s*"ACP 機能", href:\s*"\/demo\/acp"/);
  assert.doesNotMatch(footer, /t\("\/use-cases", previewModeEnabled\)/);
  assert.doesNotMatch(footer, /t\("\/demo\/aip", previewModeEnabled\)/);
  assert.doesNotMatch(footer, /t\("\/demo\/acp", previewModeEnabled\)/);
});
