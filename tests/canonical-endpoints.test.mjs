import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const expectedHeaderLinks = [
  'label: "AIプラットフォーム｜AIP", href: "/services/aip"',
  'label: "アクセス制御プラットフォーム｜ACP", href: "/services/acp"',
  'label: "AI専門家伴走支援｜FDE", href: "/services/fde"',
  'label: "ユースケース", href: "/demo/use-cases"',
  'label: "AIP機能", href: "/demo/aip"',
  'label: "ACP機能", href: "/demo/acp"',
  'label: "全てのリソース", href: "/resources"',
  'label: "用語集", href: "/glossary"',
  'label: "マニュアル", href: "/manuals"',
  'label: "イベント", href: "/events"',
  'label: "私たちについて", href: "/about-us"',
  'label: "認証情報", href: "/certifications"',
  'label: "ニュース", href: "/news"',
  'label: "お問い合わせ", href: "/contact-us"',
];

const expectedFooterLinks = [
  'label: "AIプラットフォーム｜AIP", href: "/services/aip"',
  'label: "アクセス制御プラットフォーム｜ACP", href: "/services/acp"',
  'label: "AI専門家伴走支援｜FDE", href: "/services/fde"',
  'label: "活用事例", href: "/demo/use-cases"',
  'label: "AIP 機能", href: "/demo/aip"',
  'label: "ACP 機能", href: "/demo/acp"',
  'label: "全てのリソース", href: "/resources"',
  'label: "用語集", href: "/glossary"',
  'label: "マニュアル", href: "/manuals"',
  'label: "イベント", href: "/events"',
  'label: "会社概要", href: "/about-us"',
  'label: "認定・認証", href: "/certifications"',
  'label: "ニュース", href: "/news"',
  'label: "お問い合わせ", href: "/contact-us"',
];

const expectedSidebarLinks = [
  'label: "全てのリソース", href: "/resources", key: "resources"',
  'label: "用語集", href: "/glossary", key: "glossary"',
  'label: "マニュアル", href: "/manuals", key: "manuals"',
  'label: "ホワイトペーパー", href: "/whitepapers", key: "whitepaper"',
  'label: "ブログ", href: "/blog", key: "blog"',
  'label: "イベント", href: "/events", key: "events"',
];

const expectedRedirectFiles = [
  "src/app/resources/route.ts",
  "src/app/manuals/route.ts",
  "src/app/glossary/route.ts",
  "src/app/demo/aip/route.ts",
  "src/app/demo/acp/route.ts",
  "src/app/about-us/route.ts",
  "src/app/certifications/route.ts",
  "src/app/news/route.ts",
  "src/app/contact-us/route.ts",
];

test("navigation surfaces point to the canonical local and redirect endpoints", () => {
  const siteHeader = readSource("src/components/layout/site-header.tsx");
  const siteFooter = readSource("src/components/layout/site-footer.tsx");
  const resourcePage = readSource("src/components/sections/resource-page.tsx");

  for (const expected of expectedHeaderLinks) {
    assert.match(siteHeader, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const expected of expectedFooterLinks) {
    assert.match(siteFooter, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const expected of expectedSidebarLinks) {
    assert.match(resourcePage, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("new canonical endpoints that do not have local content are implemented as redirect routes", () => {
  const sitemap = readSource("src/app/sitemap.ts");

  for (const relativePath of expectedRedirectFiles) {
    assert.equal(existsSync(new URL(`../${relativePath}`, import.meta.url)), true, `${relativePath} should exist`);
  }

  assert.doesNotMatch(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/glossary"\)/);
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
