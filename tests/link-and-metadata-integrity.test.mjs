import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const headerExpectedLinks = [
  'label: "AIプラットフォーム｜AIP", href: t("/services/aip", previewModeEnabled)',
  'label: "アクセス制御プラットフォーム｜ACP", href: t("/services/acp", previewModeEnabled)',
  'label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled)',
  'label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew"',
  'label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi"',
  'label: "活用事例", href: "/demo/use-cases"',
  'label: "全て", href: t("/resources", previewModeEnabled)',
  'label: "紹介資料", href: t("/introduction-deck", previewModeEnabled)',
  'label: "用語集", href: t("/glossary", previewModeEnabled)',
  'label: "マニュアル", href: t("/manuals", previewModeEnabled)',
  'label: "ホワイトペーパー", href: "/whitepapers"',
  'label: "ブログ", href: "/blog"',
  'label: "お問い合わせ", href: "/contact-us"',
];

const footerExpectedLinks = [
  'label: "AIプラットフォーム｜AIP", href: t("/services/aip", previewModeEnabled)',
  'label: "アクセス制御プラットフォーム｜ACP", href: t("/services/acp", previewModeEnabled)',
  'label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled)',
  'label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew"',
  'label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi"',
  'label: "活用事例", href: "/demo/use-cases"',
  'label: "全て", href: t("/resources", previewModeEnabled)',
  'label: "紹介資料", href: t("/introduction-deck", previewModeEnabled)',
  'label: "用語集", href: t("/glossary", previewModeEnabled)',
  'label: "マニュアル", href: t("/manuals", previewModeEnabled)',
  'label: "ホワイトペーパー", href: "/whitepapers"',
  'label: "ブログ", href: "/blog"',
  'label: "私たちについて", href: t("/about-us", previewModeEnabled)',
  'label: "お問い合わせ", href: "/contact-us"',
];

test("header and footer navigation links match the current implemented destinations", () => {
  const siteHeader = readSource("src/components/layout/site-header-client.tsx");
  const siteFooter = readSource("src/components/layout/site-footer.tsx");

  for (const expected of headerExpectedLinks) {
    assert.match(siteHeader, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const expected of footerExpectedLinks) {
    assert.match(siteFooter, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(siteHeader, /href:\s*"\/whitepaper"/);
  assert.doesNotMatch(siteFooter, /href:\s*"\/whitepaper"/);
});

test("public interaction surfaces do not ship bare hash broken links", () => {
  const siteHeader = readSource("src/components/layout/site-header-client.tsx");
  const siteFooter = readSource("src/components/layout/site-footer.tsx");
  const resourcePostPage = readSource("src/components/sections/publication-post-page.tsx");
  const resourcePostDownloadPage = readSource("src/components/sections/resource-post-download-page.tsx");
  const aiDashiFaq = readSource("src/components/sections/ai-dashi-faq.tsx");
  const aiCrewFloatingGuide = readSource("src/components/sections/ai-crew-floating-guide.tsx");

  assert.doesNotMatch(siteHeader, /href:\s*"#"/);
  assert.doesNotMatch(siteFooter, /href:\s*"#"/);
  assert.doesNotMatch(resourcePostPage, /href=\"#\"/);
  assert.doesNotMatch(resourcePostDownloadPage, /href=\"#\"/);
  assert.doesNotMatch(aiDashiFaq, /href=\"#\"/);
  assert.doesNotMatch(aiCrewFloatingGuide, /ctaHref:\s*"#"/);
});

test("public route metadata titles use the final QueryPie AI branding", () => {
  const eventsPage = readSource("src/app/events/page.tsx");
  const blogPage = readSource("src/app/blog/page.tsx");
  const whitepapersPage = readSource("src/app/whitepapers/page.tsx");
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const resourcePostRoute = readSource("src/app/posts/[category]/[slug]/page.tsx");

  assert.match(blogPage, /title: "ブログ \| QueryPie AI"/);
  assert.match(whitepapersPage, /title: "ホワイトペーパー \| QueryPie AI"/);
  assert.match(aiCrewPage, /title: "作業を減らし、成果を増やす。\| AI Crew \| QueryPie AI"/);
  assert.match(aiDashiPage, /title: "自社サービスをAI搭載SaaSへ最短で進化させる \| AI Dashi \| QueryPie AI"/);
  assert.match(eventsPage, /title: "イベント \| QueryPie AI"/);
  assert.match(resourcePostRoute, /title: `\$\{downloadPost\.title\} \| QueryPie AI`/);
  assert.match(resourcePostRoute, /title: `\$\{post\.title\} \| QueryPie AI`/);

  assert.doesNotMatch(eventsPage, /title: ".*AI Staff"/);
  assert.doesNotMatch(resourcePostRoute, /title: `\$\{.*\} \| AI Staff`/);
});

test("public route files expose metadata or generateMetadata for user-facing pages", () => {
  const homePage = readSource("src/app/page.tsx");
  const blogPage = readSource("src/app/blog/page.tsx");
  const whitepapersPage = readSource("src/app/whitepapers/page.tsx");
  const eventsPage = readSource("src/app/events/page.tsx");
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const resourcePostRoute = readSource("src/app/posts/[category]/[slug]/page.tsx");

  for (const source of [homePage, blogPage, whitepapersPage, eventsPage, aiCrewPage, aiDashiPage]) {
    assert.match(source, /export const metadata: Metadata = \{/);
    assert.match(source, /title:/);
    assert.match(source, /description:/);
  }

  assert.match(resourcePostRoute, /export async function generateMetadata/);
  assert.match(resourcePostRoute, /description:/);
});
