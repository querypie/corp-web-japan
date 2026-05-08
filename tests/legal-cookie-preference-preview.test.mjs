import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/cookie-preference/page.tsx";
const switchPath = "src/components/sections/legal-cookie-preference-switch.tsx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("cookie preference preview page exists with noindex metadata, route-local authored copy, and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /description: "QueryPieのクッキー設定を管理します。"/);
  assert.match(source, /canonical: "\/t\/cookie-preference"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /当社は、データを収集し、お客様のオンライン体験をカスタマイズするために、「Cookie」などの技術を使用しています。/);
  assert.match(source, /ページの下部にある Cookie の設定にアクセスすることで、いつでも設定を変更することができます。/);
  assert.match(source, /<LegalCookiePreferenceSwitch items=\{cookiePreferenceItems\} \/>/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(source, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.match(source, /<BrandGradientCtaButton href="https:\/\/app\.querypie\.com\/">無料で試してみる<\/BrandGradientCtaButton>/);
});

test("cookie preference preview uses upstream cookie keys, switch semantics, and preview-aware footer link", () => {
  const switchSource = readSource(switchPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(switchSource, /role="switch"/);
  assert.match(switchSource, /aria-label=\{label\}/);
  assert.match(switchSource, /cookie-preference-set/);
  assert.match(switchSource, /cookie-preference-performance/);
  assert.match(switchSource, /cookie-preference-functional/);
  assert.match(switchSource, /cookie-preference-event/);
  assert.match(switchSource, /cookie-preference-marketing/);
  assert.match(footerSource, /label: "Cookie設定", href: t\("\/cookie-preference", previewModeEnabled\)/);
});
