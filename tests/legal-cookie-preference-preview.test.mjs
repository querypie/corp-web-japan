import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readSource, sourceExists } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/cookie-preference/page.tsx";
const sectionPath = "src/components/sections/cookie-preference.tsx";
const pageSectionPath = "src/components/sections/cookie-preference-page.tsx";
const togglePath = "src/components/sections/cookie-preference-toggle.tsx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("cookie preference preview page keeps route-local copy while shared page/layout primitives own the rendering shells", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);
  assert.equal(sourceExists(sectionPath), true, `${sectionPath} should exist`);
  assert.equal(sourceExists(pageSectionPath), true, `${pageSectionPath} should exist`);
  assert.equal(sourceExists(togglePath), true, `${togglePath} should exist`);

  const pageSource = readSource(pagePath);

  assert.match(pageSource, /canonical: "\/t\/cookie-preference"/);
  assert.match(pageSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(pageSource, /<SiteHeader \/>/);
  assert.match(pageSource, /<SiteFooter \/>/);
  assert.match(pageSource, /from "@\/components\/sections\/cookie-preference-page"/);
  assert.match(pageSource, /<CookiePreferenceHeroSection>/);
  assert.match(pageSource, /<CookiePreferenceHeroTitle>クッキー設定<\/CookiePreferenceHeroTitle>/);
  assert.match(pageSource, /<CookiePreferenceSettingsSection>/);
  assert.match(pageSource, /<CookiePreferenceList>/);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="necessary"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="performance"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="functional"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="analysis"/s);
  assert.match(pageSource, /<CookiePreferenceItem\s+id="marketing"/s);
  assert.match(pageSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(pageSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(pageSource, /from "next\/link"/);
  assert.doesNotMatch(pageSource, /<section className="mx-auto max-w-\[1920px\] bg-white px-\[30px\]/);
  assert.doesNotMatch(pageSource, /src\/content\//);
});

test("cookie preference shared section modules separate server-side layout primitives from client-side toggle state", () => {
  const sectionSource = readSource(sectionPath);
  const pageSectionSource = readSource(pageSectionPath);
  const toggleSource = readSource(togglePath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.doesNotMatch(sectionSource, /^"use client";/m);
  assert.match(sectionSource, /export type CookiePreferenceKey/);
  assert.match(sectionSource, /export function CookiePreferenceList/);
  assert.match(sectionSource, /export function CookiePreferenceItem/);
  assert.match(sectionSource, /<CookiePreferenceToggle preference=\{id\} id=\{switchId\} disabled=\{disabled\} \/>/);
  assert.match(sectionSource, /<label htmlFor=\{switchId\}/);
  assert.match(sectionSource, /<ul className="flex flex-col gap-\[40px\]">/);
  assert.match(sectionSource, /<li className="flex flex-col gap-\[20px\]">/);

  assert.match(pageSectionSource, /export function CookiePreferenceHeroSection/);
  assert.match(pageSectionSource, /export function CookiePreferenceHeroTitle/);
  assert.match(pageSectionSource, /export function CookiePreferenceCtaSection/);
  assert.match(pageSectionSource, /export function CookiePreferenceCtaLink/);
  assert.match(pageSectionSource, /inline-flex min-h-\[47px\] items-center justify-center gap-\[10px\]/);

  assert.match(toggleSource, /^"use client";/m);
  assert.match(toggleSource, /cookie-preference-set/);
  assert.match(toggleSource, /cookie-preference-performance/);
  assert.match(toggleSource, /cookie-preference-functional/);
  assert.match(toggleSource, /cookie-preference-event/);
  assert.match(toggleSource, /cookie-preference-marketing/);
  assert.match(toggleSource, /document\.cookie/);
  assert.match(toggleSource, /useState/);
  assert.match(toggleSource, /role="switch"/);
  assert.match(toggleSource, /opacity-50/);
  assert.match(toggleSource, /translate-x-\[19px\]/);

  assert.match(footerSource, /label: "Cookie設定", href: t\("\/cookie-preference", previewModeEnabled\)/);
});
