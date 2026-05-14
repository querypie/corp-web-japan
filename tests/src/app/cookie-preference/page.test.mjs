import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

const pagePath = "src/app/cookie-preference/page.tsx";
const sectionPath = "src/components/sections/cookie-preference/list.tsx";
const togglePath = "src/components/sections/cookie-preference/toggle.tsx";
const preferencePath = "src/lib/cookie-preferences.ts";
const legalDocumentPath = "src/components/sections/legal/document.tsx";

test("cookie preference public page keeps route-local copy while shared page/layout primitives own the rendering shells", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);
  assert.equal(sourceExists(sectionPath), true, `${sectionPath} should exist`);
  assert.equal(sourceExists(togglePath), true, `${togglePath} should exist`);
  assert.equal(sourceExists(preferencePath), true, `${preferencePath} should exist`);

  const pageSource = readSource(pagePath);

  assert.match(pageSource, /canonical: "\/cookie-preference"/);
  assert.match(pageSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(pageSource, /<SiteHeader \/>/);
  assert.match(pageSource, /<SiteFooter \/>/);
  assert.doesNotMatch(pageSource, /from "@\/components\/sections\/cookie-preference\/page"/);
  assert.match(pageSource, /from "@\/components\/sections\/legal\/document"/);
  assert.match(pageSource, /<LegalDocumentSection>/);
  assert.match(pageSource, /<LegalDocumentIntro>/);
  assert.match(pageSource, /<LegalDocumentTitle>クッキー設定<\/LegalDocumentTitle>/);
  assert.match(pageSource, /<LegalDocumentLead>\s*<p>/s);
  assert.match(pageSource, /<LegalDocumentLayout>/);
  assert.doesNotMatch(pageSource, /<CookiePreferenceSettingsSection>/);
  assert.doesNotMatch(pageSource, /CookiePreferenceHeroTitle/);
  assert.doesNotMatch(pageSource, /CookiePreferenceHeroDescription/);
  assert.match(pageSource, /import \{ cookies \} from "next\/headers";/);
  assert.match(pageSource, /getCookiePreferenceState/);
  assert.match(pageSource, /const cookieStore = await cookies\(\);/);
  assert.match(pageSource, /export default async function CookiePreferencePage/);
  assert.match(pageSource, /const cookiePreferences = await getCookiePreferenceState\(\);/);
  assert.match(pageSource, /<CookiePreferenceList>/);
  assert.match(pageSource, /CookiePreferenceToggleField,/);
  assert.match(pageSource, /CookiePreferenceToggleDescription,/);
  assert.match(pageSource, /<CookiePreferenceItem>\s*<CookiePreferenceToggleField id="necessary" disabled>\s*必須 Cookie/s);
  assert.match(pageSource, /<CookiePreferenceToggleField id="performance" initialChecked=\{cookiePreferences\.performance\}>\s*パフォーマンス Cookie/s);
  assert.match(pageSource, /<CookiePreferenceToggleField id="functional" initialChecked=\{cookiePreferences\.functional\}>\s*機能 Cookie/s);
  assert.match(pageSource, /<CookiePreferenceToggleField id="analysis" initialChecked=\{cookiePreferences\.analysis\}>\s*分析 Cookie/s);
  assert.match(pageSource, /<CookiePreferenceToggleField id="marketing" initialChecked=\{cookiePreferences\.marketing\}>\s*マーケティング Cookie/s);
  assert.match(pageSource, /<CookiePreferenceToggleDescription>\s*これらの Cookie/s);
  assert.doesNotMatch(pageSource, /<CookiePreferenceToggleDescription>\s*<p>/s);
  assert.doesNotMatch(pageSource, /<\/p>\s*<\/CookiePreferenceToggleDescription>/s);
  assert.doesNotMatch(pageSource, /label="/);
  assert.doesNotMatch(pageSource, /description=\{/);
  assert.match(pageSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(pageSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(pageSource, /from "next\/link"/);
  assert.doesNotMatch(pageSource, /<section className="mx-auto max-w-\[1920px\] bg-white px-\[30px\]/);
  assert.doesNotMatch(pageSource, /src\/content\//);
});

test("cookie preference shared section modules separate server-side layout primitives from client-side toggle state", () => {
  const sectionSource = readSource(sectionPath);
  const toggleSource = readSource(togglePath);
  const preferenceSource = readSource(preferencePath);
  const footerSource = readSource("src/components/layout/site-footer.tsx");

  assert.equal(sourceExists("src/components/sections/cookie-preference/page.tsx"), false);
  assert.doesNotMatch(sectionSource, /^"use client";/m);
  assert.match(sectionSource, /import \{ companyBodyTextClassName \} from "@\/components\/ui\/text-tokens";/);
  assert.match(sectionSource, /import type \{ CookiePreferenceKey \} from "@\/lib\/cookie-preferences";/);
  assert.match(sectionSource, /export function CookiePreferenceList/);
  assert.match(sectionSource, /export function CookiePreferenceItem/);
  assert.match(sectionSource, /export function CookiePreferenceToggleField/);
  assert.match(sectionSource, /export function CookiePreferenceToggleDescription/);
  assert.match(sectionSource, /return <p className=\{companyBodyTextClassName\}>\{children\}<\/p>;/);
  assert.doesNotMatch(sectionSource, /text-\[/);
  assert.doesNotMatch(sectionSource, /leading-\[/);
  assert.doesNotMatch(sectionSource, /tracking-\[/);
  assert.doesNotMatch(sectionSource, /text-\[#/);
  assert.doesNotMatch(sectionSource, /gap-\[/);
  assert.match(sectionSource, /<CookiePreferenceToggle preference=\{id\} id=\{switchId\} disabled=\{disabled\} initialChecked=\{initialChecked\} \/>/);
  assert.match(sectionSource, /<label htmlFor=\{switchId\} className="font-medium text-slate-950">/);
  assert.match(sectionSource, /<ul className="flex flex-col gap-10">/);
  assert.match(sectionSource, /<li className="flex flex-col gap-5">/);
  assert.match(sectionSource, /<div className="flex items-center gap-4">/);
  assert.doesNotMatch(sectionSource, /label: string/);
  assert.doesNotMatch(sectionSource, /description: ReactNode/);

  assert.match(toggleSource, /^"use client";/m);
  assert.match(preferenceSource, /export type CookiePreferenceKey/);
  assert.match(preferenceSource, /export type MutableCookiePreferenceKey/);
  assert.match(preferenceSource, /export const COOKIE_PREFERENCE_COOKIE_KEYS/);
  assert.match(preferenceSource, /export const COOKIE_PREFERENCE_MAX_AGE/);
  assert.match(preferenceSource, /export function isCookiePreferenceEnabled/);
  assert.match(preferenceSource, /cookie-preference-set/);
  assert.match(preferenceSource, /cookie-preference-performance/);
  assert.match(preferenceSource, /cookie-preference-functional/);
  assert.match(preferenceSource, /cookie-preference-event/);
  assert.match(preferenceSource, /cookie-preference-marketing/);
  assert.match(toggleSource, /type CookiePreferenceKey/);
  assert.match(toggleSource, /initialChecked\?: boolean/);
  assert.match(toggleSource, /useState\(isNecessary \? true : initialChecked\)/);
  assert.doesNotMatch(toggleSource, /useState\(\(\) =>/);
  assert.doesNotMatch(toggleSource, /getCookieValue/);
  assert.doesNotMatch(toggleSource, /readCheckedState/);
  assert.match(toggleSource, /document\.cookie/);
  assert.match(toggleSource, /role="switch"/);
  assert.match(toggleSource, /opacity-50/);
  assert.match(toggleSource, /translate-x-\[19px\]/);

  assert.match(footerSource, /label: "Cookie設定", href: "\/cookie-preference"/);
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
