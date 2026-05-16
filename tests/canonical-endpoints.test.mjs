import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const expectedHeaderLinks = [
  'label: "AIプラットフォーム｜AIP", href: t("/platforms/aip", previewModeEnabled)',
  'label: "アクセス制御プラットフォーム｜ACP", href: t("/platforms/acp", previewModeEnabled)',
  'label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled)',
  'label: "活用事例", href: "/use-cases"',
  'label: "AIP機能", href: "/demo/aip"',
  'label: "ACP機能", href: "/demo/acp"',
  'label: "全て", href: "/resources"',
  'label: "紹介資料", href: "/introduction-deck"',
  'label: "用語集", href: "/glossary"',
  'label: "マニュアル", href: "/manuals"',
  'label: "イベント", href: "/events"',
  'label: "私たちについて", href: "/about-us"',
  'label: "認証情報", href: "/certifications"',
  'label: "ニュース", href: "/news"',
  'label: "お問い合わせ", href: "/contact-us"',
];

const expectedFooterLinks = [
  'label: "AIプラットフォーム｜AIP", href: t("/platforms/aip", previewModeEnabled)',
  'label: "アクセス制御プラットフォーム｜ACP", href: t("/platforms/acp", previewModeEnabled)',
  'label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled)',
  'label: "活用事例", href: "/use-cases"',
  'label: "AIP 機能", href: "/demo/aip"',
  'label: "ACP 機能", href: "/demo/acp"',
  'label: "全て", href: "/resources"',
  'label: "紹介資料", href: "/introduction-deck"',
  'label: "用語集", href: "/glossary"',
  'label: "マニュアル", href: "/manuals"',
  'label: "イベント", href: "/events"',
  'label: "私たちについて", href: "/about-us"',
  'label: "認証情報", href: "/certifications"',
  'label: "ニュース", href: "/news"',
  'label: "お問い合わせ", href: "/contact-us"',
];

const expectedSidebarLinks = [
  'label: "全て", href: "/resources"',
  'label: "紹介資料", href: "/introduction-deck"',
  'label: "用語集", href: "/glossary"',
  'label: "マニュアル", href: "/manuals"',
  'label: "ホワイトペーパー", href: "/whitepapers"',
  'label: "ブログ", href: "/blog"',
];

const expectedRedirectFiles = [];

test("navigation surfaces point to the canonical local and redirect endpoints", () => {
  const siteHeader = readSource("src/components/layout/site-header-client.tsx");
  const siteFooter = readSource("src/components/layout/site-footer.tsx");
  const resourceSidebar = readSource("src/components/sections/resource-category-sidebar.tsx");

  for (const expected of expectedHeaderLinks) {
    assert.ok(siteHeader.includes(expected), `missing header link: ${expected}`);
  }

  for (const expected of expectedFooterLinks) {
    assert.ok(siteFooter.includes(expected), `missing footer link: ${expected}`);
  }

  for (const expected of expectedSidebarLinks) {
    assert.ok(resourceSidebar.includes(expected), `missing sidebar link: ${expected}`);
  }
});

test("public resource rollout replaced the old redirect endpoints with page routes and sitemap entries", () => {
  const aboutUsPage = readSource("src/app/about-us/page.tsx");
  const certificationsPage = readSource("src/app/certifications/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");
  const contactUsPage = readSource("src/app/contact-us/page.tsx");
  const newsPage = readSource("src/app/news/page.tsx");
  const useCasesPage = readSource("src/app/use-cases/page.tsx");
  const aipPage = readSource("src/app/demo/aip/page.tsx");
  const acpPage = readSource("src/app/demo/acp/page.tsx");
  const cookiePreferencePage = readSource("src/app/cookie-preference/page.tsx");
  const termsOfServicePage = readSource("src/app/terms-of-service/page.tsx");
  const privacyPolicyPage = readSource("src/app/privacy-policy/page.tsx");
  const eulaPage = readSource("src/app/eula/page.tsx");

  for (const relativePath of expectedRedirectFiles) {
    assert.equal(existsSync(new URL(`../${relativePath}`, import.meta.url)), true, `${relativePath} should exist`);
  }

  for (const pagePath of [
    "src/app/resources/page.tsx",
    "src/app/introduction-deck/page.tsx",
    "src/app/glossary/page.tsx",
    "src/app/manuals/page.tsx",
  ]) {
    assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);
  }

  for (const removedRoutePath of [
    "src/app/resources/route.ts",
    "src/app/introduction-deck/route.ts",
    "src/app/glossary/route.ts",
    "src/app/manuals/route.ts",
  ]) {
    assert.equal(existsSync(new URL(`../${removedRoutePath}`, import.meta.url)), false, `${removedRoutePath} should be removed`);
  }

  assert.match(aboutUsPage, /canonical:\s*"\/about-us"/);
  assert.match(certificationsPage, /canonical:\s*"\/certifications"/);
  assert.match(contactUsPage, /canonical:\s*"\/contact-us"/);
  assert.match(newsPage, /canonical:\s*"\/news"/);
  assert.match(useCasesPage, /canonical:\s*"\/use-cases"/);
  assert.match(aipPage, /canonical:\s*"\/demo\/aip"/);
  assert.match(acpPage, /canonical:\s*"\/demo\/acp"/);
  assert.match(cookiePreferencePage, /canonical:\s*"\/cookie-preference"/);
  assert.match(termsOfServicePage, /canonical:\s*"\/terms-of-service"/);
  assert.match(privacyPolicyPage, /canonicalPath: "\/privacy-policy"/);
  assert.match(eulaPage, /canonical:\s*"\/eula"/);
  assert.match(sitemap, /absoluteUrl\("\/about-us"\)/);
  assert.match(sitemap, /absoluteUrl\("\/certifications"\)/);
  assert.match(sitemap, /absoluteUrl\("\/contact-us"\)/);
  assert.match(sitemap, /absoluteUrl\("\/news"\)/);
  assert.match(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.match(sitemap, /absoluteUrl\("\/introduction-deck"\)/);
  assert.match(sitemap, /absoluteUrl\("\/glossary"\)/);
  assert.match(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.match(sitemap, /absoluteUrl\("\/use-cases"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/aip"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/acp"\)/);
  assert.match(sitemap, /absoluteUrl\("\/cookie-preference"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/terms-of-service"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/privacy-policy"\)/);
  assert.match(sitemap, /absoluteUrl\("\/eula"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/demo\/use-cases"\)/);
  assert.equal(existsSync(new URL("../src/app/about-us/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/certifications/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/news/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/cookie-preference/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/terms-of-service/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/privacy-policy/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/eula/route.ts", import.meta.url)), false);
});

test("events is a canonical public resource list route and is included in the sitemap", () => {
  const eventsPage = readSource("src/app/events/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(eventsPage, /title: "イベント \| QueryPie AI"/);
  assert.match(eventsPage, /canonical: "\/events"/);
  assert.match(eventsPage, /resolveEventTimeline\(resolvedSearchParams\?\.asof\)/);
  assert.match(eventsPage, /<ResourceCategorySidebar activeLabel="イベント" \/>/);
  assert.match(eventsPage, /<FeaturedEventHero/);
  assert.match(eventsPage, /resolveResourceListVisibleCount\(pastEvents, resolvedSearchParams\?\.until\)/);
  assert.match(eventsPage, /<ResourceListLoadMore[\s\S]*items=\{pastEvents\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.doesNotMatch(eventsPage, /<ResourceListItems items=\{pastEvents\} \/>/);
  assert.doesNotMatch(eventsPage, /return notFound\(\);/);
  assert.match(sitemap, /absoluteUrl\("\/events"\)/);
});
