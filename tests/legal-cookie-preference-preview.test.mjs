import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/cookie-preference/page.tsx";
const switchPath = "src/components/sections/legal-cookie-preference-switch.tsx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("cookie preference preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/cookie-preference"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /Cookie設定/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /<LegalCookiePreferenceSwitch items=\{cookiePreferenceItems\} \/>/);
});

test("cookie preference preview uses local cookie toggle state and preview-aware footer link", () => {
  const switchSource = readSource(switchPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(switchSource, /document\.cookie/);
  assert.match(switchSource, /cookie-preference-set/);
  assert.match(switchSource, /cookie-preference-performance/);
  assert.match(switchSource, /cookie-preference-functional/);
  assert.match(switchSource, /cookie-preference-event/);
  assert.match(switchSource, /cookie-preference-marketing/);
  assert.match(footerSource, /label: "Cookie設定", href: t\("\/cookie-preference", previewModeEnabled\)/);
});
