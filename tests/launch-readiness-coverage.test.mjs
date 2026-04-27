import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("launch-risk CTA targets resolve to explicit anchors or real destinations", () => {
  const homeContent = readSource("src/content/home.ts");
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const topPage = readSource("src/app/page.tsx");
  const topPageContent = readSource("src/content/top-page.ts");
  const topPageSections = readSource("src/components/sections/top-page-sections.tsx");
  const aiCrewFloatingGuide = readSource("src/components/sections/ai-crew-floating-guide.tsx");
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiFaq = readSource("src/components/sections/ai-dashi-faq.tsx");
  const resourcePostPage = readSource("src/components/PublicationPostPage.tsx");
  const contactUsRoute = readSource("src/app/contact-us/route.ts");

  assert.match(homeContent, /export const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"/);
  assert.match(homeContent, /export const demoUseCasesUrl = "\/demo\/use-cases"/);
  assert.match(homeContent, /floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
  assert.match(homeContent, /secondaryCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewConsultUrl \}/);
  assert.match(homeContent, /primaryCta: \{ label: "進め方を相談する", href: aiCrewConsultUrl \}/);
  assert.match(homeContent, /partnerCta: \{ label: "自社サービスAI化の進め方を見る", href: "\/solutions\/ai-dashi" \}/);
  assert.match(homeContent, /href: aiCrewWhitepaperUrl/);

  assert.match(topPage, /<FloatingConversionCta href={topPageFloatingCtaUrl} \/>/);
  assert.match(topPageContent, /primaryCta: \{ label: "お問い合わせ", href: topPageHeroContactUrl \}/);
  assert.match(topPageContent, /secondaryCta: \{[\s\S]*label: "資料をダウンロード",[\s\S]*href: topPageDownloadUrl,?[\s\S]*\}/);
  assert.match(topPageSections, /id="contact"/);
  assert.match(topPageSections, /bg-\[#0f172a\] text-white/);
  assert.match(topPageSections, /id="download"/);
  assert.match(topPageContent, /\{ label: "デモを依頼", href: topPageFinalDemoUrl \}/);
  assert.match(topPageContent, /\{ label: "資料をダウンロード", href: topPageDownloadUrl \}/);
  assert.match(topPageContent, /\{ label: "導入について相談する", href: topPageFinalConsultUrl \}/);
  assert.match(topPageContent, /href: "https:\/\/trust\.querypie\.com\/"/);
  assert.match(topPageSections, /href=\{security\.link\.href\}[\s\S]*target="_blank"[\s\S]*rel="noopener noreferrer"/);
  assert.match(aiCrewPage, /<FloatingConversionCta href={aiCrewFloatingCtaUrl} \/>/);
  assert.match(aiCrewFloatingGuide, /ctaHref: aiCrewConsultUrl/);
  assert.match(aiCrewFloatingGuide, /ctaHref: demoUseCasesUrl/);
  assert.match(aiDashiPage, /from "@\/content\/ai-dashi-links"/);
  assert.match(aiDashiPage, /<FloatingConversionCta href={aiDashiFloatingUrl} \/>/);
  assert.match(aiDashiPage, /href={aiDashiConsultUrl}/);
  assert.match(aiDashiFaq, /href={aiDashiConsultUrl}/);
  assert.match(resourcePostPage, /href={publicationPostContactUrl}/);
  assert.match(contactUsRoute, /const contactUsUrl = new URL\("https:\/\/www\.querypie\.com\/ja\/company\/contact-us"\)/);
  assert.match(contactUsRoute, /redirectedUrl\.search = request\.nextUrl\.search;/);
  assert.match(contactUsRoute, /NextResponse\.redirect\(redirectedUrl, 307\)/);

  assert.doesNotMatch(homeContent, /href: "#"/);
  assert.doesNotMatch(aiCrewFloatingGuide, /ctaHref: "#"/);
});

test("events launch-readiness gate remains explicit and redirect-only resource aliases stay out of the sitemap", () => {
  const eventsPage = readSource("src/app/events/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(eventsPage, /unblock\?: string \| string\[];/);
  assert.match(eventsPage, /return notFound\(\);/);
  assert.match(eventsPage, /temporary `unblock` query-based readiness check/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/events"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/glossary"\)/);
});

test("robots and sitemap metadata files exist and cover the core public routes", () => {
  const robots = readSource("src/app/robots.ts");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(robots, /sitemap: `\$\{siteUrl\.toString\(\)\}sitemap\.xml`/);
  assert.match(robots, /host: siteUrl\.toString\(\)/);

  assert.match(sitemap, /absoluteUrl\("\/"\)/);
  assert.match(sitemap, /absoluteUrl\("\/solutions\/ai-crew"\)/);
  assert.match(sitemap, /absoluteUrl\("\/solutions\/ai-dashi"\)/);
  assert.match(sitemap, /absoluteUrl\("\/blog"\)/);
  assert.match(sitemap, /absoluteUrl\("\/whitepapers"\)/);
  assert.doesNotMatch(sitemap, /eventPostRecords/);
  assert.doesNotMatch(sitemap, /getEventPostHref/);
});
