import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const expectedHeaderLinks = [
  'label: "AIプラットフォーム｜AIP", href: t("/services/aip", previewModeEnabled)',
  'label: "アクセス制御プラットフォーム｜ACP", href: t("/services/acp", previewModeEnabled)',
  'label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled)',
  'label: "活用事例", href: "/demo/use-cases"',
  'label: "AIP機能", href: "/demo/aip"',
  'label: "ACP機能", href: "/demo-acp"',
  'label: "全て", href: t("/resources", previewModeEnabled)',
  'label: "紹介資料", href: t("/introduction-deck", previewModeEnabled)',
  'label: "用語集", href: t("/glossary", previewModeEnabled)',
  'label: "マニュアル", href: t("/manuals", previewModeEnabled)',
  'label: "イベント", href: t("/events", previewModeEnabled)',
  'label: "私たちについて", href: t("/about-us", previewModeEnabled)',
  'label: "認証情報", href: t("/certifications", previewModeEnabled)',
  'label: "ニュース", href: "/news"',
  'label: "お問い合わせ", href: "/contact-us"',
];

const expectedFooterLinks = [
  'label: "AIプラットフォーム｜AIP", href: t("/services/aip", previewModeEnabled)',
  'label: "アクセス制御プラットフォーム｜ACP", href: t("/services/acp", previewModeEnabled)',
  'label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled)',
  'label: "活用事例", href: "/demo/use-cases"',
  'label: "AIP 機能", href: "/demo/aip"',
  'label: "ACP 機能", href: "/demo-acp"',
  'label: "全て", href: t("/resources", previewModeEnabled)',
  'label: "紹介資料", href: t("/introduction-deck", previewModeEnabled)',
  'label: "用語集", href: t("/glossary", previewModeEnabled)',
  'label: "マニュアル", href: t("/manuals", previewModeEnabled)',
  'label: "イベント", href: t("/events", previewModeEnabled)',
  'label: "私たちについて", href: t("/about-us", previewModeEnabled)',
  'label: "認証情報", href: t("/certifications", previewModeEnabled)',
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

const expectedRedirectFiles = [
  "src/app/resources/route.ts",
  "src/app/manuals/route.ts",
  "src/app/glossary/route.ts",
  "src/app/about-us/route.ts",
  "src/app/certifications/route.ts",
];

test("navigation surfaces point to the canonical local and redirect endpoints", () => {
  const siteHeader = readSource("src/components/layout/site-header-client.tsx");
  const siteFooter = readSource("src/components/layout/site-footer.tsx");
  const resourceSidebar = readSource("src/components/sections/resource-category-sidebar.tsx");

  for (const expected of expectedHeaderLinks) {
    assert.match(siteHeader, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const expected of expectedFooterLinks) {
    assert.match(siteFooter, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const expected of expectedSidebarLinks) {
    assert.match(resourceSidebar, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("redirect and local list endpoints stay on the intended files", () => {
  const sitemap = readSource("src/app/sitemap.ts");
  const contactUsPage = readSource("src/app/contact-us/page.tsx");
  const newsPage = readSource("src/app/news/page.tsx");
  const useCasesPage = readSource("src/app/demo/use-cases/page.tsx");
  const aipPage = readSource("src/app/demo/aip/page.tsx");
  const acpPage = readSource("src/app/demo-acp/page.tsx");

  for (const relativePath of expectedRedirectFiles) {
    assert.equal(existsSync(new URL(`../${relativePath}`, import.meta.url)), true, `${relativePath} should exist`);
  }

  assert.match(contactUsPage, /canonical:\s*"\/contact-us"/);
  assert.match(newsPage, /canonical:\s*"\/news"/);
  assert.match(useCasesPage, /canonical:\s*"\/demo\/use-cases"/);
  assert.match(aipPage, /canonical:\s*"\/demo\/aip"/);
  assert.match(acpPage, /canonical:\s*"\/demo-acp"/);
  assert.match(sitemap, /absoluteUrl\("\/contact-us"\)/);
  assert.match(sitemap, /absoluteUrl\("\/news"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/use-cases"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/aip"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo-acp"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/use-cases"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/glossary"\)/);
  assert.equal(existsSync(new URL("../src/app/news/route.ts", import.meta.url)), false);
});

test("events remains gated and stays out of the sitemap until launch", () => {
  const eventsPage = readSource("src/app/events/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(eventsPage, /title: "イベント \| QueryPie AI"/);
  assert.match(eventsPage, /unblock\?: string \| string\[];/);
  assert.match(eventsPage, /return notFound\(\);/);
  assert.doesNotMatch(eventsPage, /canonical: "\/events"/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/events"\)/);
});
