import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readSource, sourceExists } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/cookie-preference/page.tsx";
const sectionPath = "src/components/sections/cookie-preference.tsx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("cookie preference preview page is implemented as a non-indexed /t route with route-local Japanese copy", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);
  assert.equal(sourceExists(sectionPath), true, `${sectionPath} should exist`);

  const pageSource = readSource(pagePath);

  assert.match(pageSource, /canonical: "\/t\/cookie-preference"/);
  assert.match(pageSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(pageSource, /<SiteHeader \/>/);
  assert.match(pageSource, /<SiteFooter \/>/);
  assert.match(pageSource, /<CookiePreferenceList>/);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="necessary"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="performance"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="functional"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="analysis"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="marketing"/s);
  assert.match(pageSource, /クッキー設定/);
  assert.match(pageSource, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(pageSource, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.doesNotMatch(pageSource, /src\/content\//);
});

test("cookie preference section keeps the upstream cookie key contract and preview-aware footer link", () => {
  const sectionSource = readSource(sectionPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(sectionSource, /cookie-preference-set/);
  assert.match(sectionSource, /cookie-preference-performance/);
  assert.match(sectionSource, /cookie-preference-functional/);
  assert.match(sectionSource, /cookie-preference-event/);
  assert.match(sectionSource, /cookie-preference-marketing/);
  assert.match(sectionSource, /role="switch"/);
  assert.match(sectionSource, /document\.cookie/);
  assert.match(footerSource, /label: "Cookie設定", href: t\("\/cookie-preference", previewModeEnabled\)/);
});
