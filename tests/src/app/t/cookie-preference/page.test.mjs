import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

const pagePath = "src/app/t/cookie-preference/page.tsx";
const sectionPath = "src/components/sections/cookie-preference/list.tsx";
const pageSectionPath = "src/components/sections/cookie-preference/page.tsx";
const togglePath = "src/components/sections/cookie-preference/toggle.tsx";
const legalDocumentPath = "src/components/sections/legal/document.tsx";

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
  assert.match(pageSource, /from "@\/components\/sections\/cookie-preference\/page"/);
  assert.match(pageSource, /from "@\/components\/sections\/legal\/document"/);
  assert.match(pageSource, /<LegalDocumentSection>/);
  assert.match(pageSource, /<LegalDocumentIntro>/);
  assert.match(pageSource, /<LegalDocumentTitle>クッキー設定<\/LegalDocumentTitle>/);
  assert.match(pageSource, /<LegalDocumentLead>\s*<p>/s);
  assert.match(pageSource, /<CookiePreferenceSettingsSection>/);
  assert.doesNotMatch(pageSource, /CookiePreferenceHeroTitle/);
  assert.doesNotMatch(pageSource, /CookiePreferenceHeroDescription/);
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
  const footerSource = readSource("src/components/layout/site-footer.tsx");

  assert.doesNotMatch(sectionSource, /^"use client";/m);
  assert.match(sectionSource, /export type CookiePreferenceKey/);
  assert.match(sectionSource, /export function CookiePreferenceList/);
  assert.match(sectionSource, /export function CookiePreferenceItem/);
  assert.match(sectionSource, /<CookiePreferenceToggle preference=\{id\} id=\{switchId\} disabled=\{disabled\} \/>/);
  assert.match(sectionSource, /<label htmlFor=\{switchId\}/);
  assert.match(sectionSource, /<ul className="flex flex-col gap-\[40px\]">/);
  assert.match(sectionSource, /<li className="flex flex-col gap-\[20px\]">/);

  assert.doesNotMatch(pageSectionSource, /export function CookiePreferenceHeroSection/);
  assert.doesNotMatch(pageSectionSource, /export function CookiePreferenceHeroTitle/);
  assert.doesNotMatch(pageSectionSource, /export function CookiePreferenceHeroDescription/);
  assert.match(pageSectionSource, /export function CookiePreferenceCtaSection/);
  assert.match(pageSectionSource, /return <div className="max-w-\[1200px\]">\{children\}<\/div>;/);
  assert.doesNotMatch(pageSectionSource, /mt-\[52\.5px\]/);
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


test("shared legal document intro matches company family typography and spacing", () => {
  const legalDocumentSource = readSource(legalDocumentPath);

  assert.match(
    legalDocumentSource,
    /<h1 className="text-\[40px\] font-medium leading-\[1\.2\] tracking-\[-0\.03em\] text-slate-950 sm:text-\[48px\] lg:text-\[52px\]">/,
  );
  assert.match(legalDocumentSource, /return <div className=\{companyBodyTextClassName\}>\{children\}<\/div>;/);
  assert.match(legalDocumentSource, /export function LegalDocumentTitleActions/);
  assert.match(legalDocumentSource, /mb-10 flex flex-col gap-10 pt-\[10px\] text-left lg:mb-\[50px\] lg:gap-\[50px\] lg:pt-0/);
  assert.doesNotMatch(legalDocumentSource, /titleVariant/);
  assert.doesNotMatch(legalDocumentSource, /<div className="flex flex-col gap-3">/);
});
