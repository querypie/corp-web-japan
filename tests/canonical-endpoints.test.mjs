import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const expectedHeaderLinks = [
  'label: "AIプラットフォーム｜AIP", href: "/platforms/aip"',
  'label: "アクセス制御プラットフォーム｜ACP", href: "/platforms/acp"',
  'label: "AI専門家伴走支援｜FDE", href: "/services/fde"',
  'label: "IBM i（AS/400）モダナイゼーション", href: "/services/as400-cobol"',
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
  'label: "AIプラットフォーム｜AIP", href: "/platforms/aip"',
  'label: "アクセス制御プラットフォーム｜ACP", href: "/platforms/acp"',
  'label: "AI専門家伴走支援｜FDE", href: "/services/fde"',
  'label: "IBM i（AS/400）モダナイゼーション", href: "/services/as400-cobol"',
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
  const acpPlatformPage = readSource("src/app/platforms/acp/page.tsx");
  const acpIntegrationsPage = readSource("src/app/platforms/acp/integrations/page.tsx");
  const plansPage = readSource("src/app/plans/page.tsx");
  const plansAipPage = readSource("src/app/plans/aip/page.tsx");
  const plansAcpPage = readSource("src/app/plans/acp/page.tsx");
  const as400CobolPage = readSource("src/app/services/as400-cobol/page.tsx");
  const acpChildPages = [
    ["database-access-controller", readSource("src/app/platforms/acp/database-access-controller/page.tsx")],
    ["system-access-controller", readSource("src/app/platforms/acp/system-access-controller/page.tsx")],
    ["kubernetes-access-controller", readSource("src/app/platforms/acp/kubernetes-access-controller/page.tsx")],
    ["web-access-controller", readSource("src/app/platforms/acp/web-access-controller/page.tsx")],
  ];

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
  assert.match(acpPlatformPage, /canonical:\s*"\/platforms\/acp"/);
  assert.match(acpIntegrationsPage, /canonical:\s*"\/platforms\/acp\/integrations"/);
  assert.match(plansPage, /canonical:\s*"\/plans"/);
  assert.match(plansAipPage, /canonical:\s*"\/plans\/aip"/);
  assert.match(plansAcpPage, /canonical:\s*"\/plans\/acp"/);
  assert.match(as400CobolPage, /canonical:\s*"\/services\/as400-cobol"/);
  for (const [route, page] of acpChildPages) {
    assert.match(page, new RegExp(`canonical:\\s*"\\/platforms\\/acp\\/${route}"`));
  }
  assert.match(sitemap, /absoluteUrl\("\/about-us", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/certifications", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/contact-us", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/news", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/resources", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/introduction-deck", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/glossary", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/manuals", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/use-cases", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/aip", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/acp", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/services\/fde", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/services\/as400-cobol", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/platforms\/acp", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/platforms\/acp\/integrations", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/plans", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/plans\/aip", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/plans\/acp", deployedSiteUrl\)/);
  for (const [route] of acpChildPages) {
    assert.match(sitemap, new RegExp(`absoluteUrl\\("\\/platforms\\/acp\\/${route}", deployedSiteUrl\\)`));
  }
  assert.match(sitemap, /absoluteUrl\("\/cookie-preference", deployedSiteUrl\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/terms-of-service", deployedSiteUrl\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/privacy-policy", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/eula", deployedSiteUrl\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/demo\/use-cases", deployedSiteUrl\)/);
  assert.equal(existsSync(new URL("../src/app/about-us/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/certifications/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/news/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/cookie-preference/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/terms-of-service/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/privacy-policy/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/eula/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/platforms/acp/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/platforms/acp/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/platforms/acp/integrations/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/plans/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/plans/aip/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/plans/acp/page.tsx", import.meta.url)), false);
  for (const [route] of acpChildPages) {
    assert.equal(existsSync(new URL(`../src/app/t/platforms/acp/${route}/page.tsx`, import.meta.url)), false);
  }
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
  assert.match(sitemap, /absoluteUrl\("\/events", deployedSiteUrl\)/);
});
