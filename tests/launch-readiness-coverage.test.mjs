import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import { getAiCrewDataSource, getTopPageDataSource, getTopPageStructureSource } from "./helpers/static-marketing-page-sources.mjs";

test("launch-risk CTA targets resolve to explicit anchors or real destinations", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const topPage = readSource("src/app/page.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const topPageDataSource = getTopPageDataSource();
  const topPageStructureSource = getTopPageStructureSource();
  const aiCrewFloatingGuide = readSource("src/components/sections/ai-crew-floating-guide.tsx");
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiFaq = readSource("src/components/sections/ai-dashi-faq.tsx");
  const resourcePostPage = readSource("src/components/PublicationPostPage.tsx");
  const contactUsPage = readSource("src/app/contact-us/page.tsx");
  const topPageSecuritySection = readSource("src/components/sections/top-page-security-section.tsx");


  assert.match(aiCrewDataSource, /const aiCrewConsultUrl =|export const aiCrewConsultUrl =/);
  assert.match(aiCrewDataSource, /const demoUseCasesUrl =|export const demoUseCasesUrl =/);
  assert.match(aiCrewDataSource, /floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
  assert.match(aiCrewDataSource, /secondaryCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewConsultUrl \}/);
  assert.match(aiCrewDataSource, /primaryCta: \{ label: "進め方を相談する", href: aiCrewConsultUrl \}/);
  assert.match(aiCrewDataSource, /partnerCta: \{ label: "自社サービスAI化の進め方を見る", href: "\/solutions\/ai-dashi" \}/);
  assert.match(aiCrewDataSource, /href: aiCrewWhitepaperUrl/);

  assert.match(topPage, /<FloatingConversionCta href={topPageFloatingCtaUrl} \/>/);
  assert.match(`${topPageDataSource}\n${topPage}`, /primaryCta: \{ label: "お問い合わせ", href: topPageHeroContactUrl \}|<HeroPrimaryAction href=\{topPageHeroContactUrl\}>お問い合わせ<\/HeroPrimaryAction>/);
  assert.match(`${topPageDataSource}\n${topPage}`, /secondaryCta: \{[\s\S]*label: "資料をダウンロード",[\s\S]*href: topPageDownloadUrl,?[\s\S]*\}|<HeroSecondaryAction href=\{topPageDownloadUrl\}>資料をダウンロード<\/HeroSecondaryAction>/);
  assert.match(topPageStructureSource, /id="contact"/);
  assert.match(topPageStructureSource, /bg-\[#0f172a\] text-white/);
  assert.match(topPageStructureSource, /id="download"/);
  assert.match(topPageDataSource, /\{ label: "デモを依頼", href: topPageFinalDemoUrl \}|<FinalCtaAction href=\{topPageFinalDemoUrl\} primary>/);
  assert.match(topPageDataSource, /\{ label: "資料をダウンロード", href: topPageDownloadUrl \}|<FinalCtaAction href=\{topPageDownloadUrl\}>資料をダウンロード<\/FinalCtaAction>/);
  assert.match(topPageDataSource, /\{ label: "導入について相談する", href: topPageFinalConsultUrl \}|<FinalCtaAction href=\{topPageFinalConsultUrl\}>導入について相談する<\/FinalCtaAction>/);
  assert.match(`${topPageDataSource}\n${topPage}`, /href: "https:\/\/trust\.querypie\.com\/"|<SecurityAction href="https:\/\/trust\.querypie\.com\/">/);
  assert.match(`${topPageStructureSource}\n${topPageSecuritySection}\n${topPage}`, /href=\{security\.link\.href\}|<SecurityAction href="https:\/\/trust\.querypie\.com\/">/);
  assert.match(`${topPageStructureSource}\n${topPageSecuritySection}\n${topPage}`, /target="_blank"/);
  assert.match(`${topPageStructureSource}\n${topPageSecuritySection}\n${topPage}`, /rel="noopener noreferrer"/);
  assert.match(aiCrewPage, /<FloatingConversionCta href={aiCrewFloatingCtaUrl} \/>/);
  assert.match(aiCrewFloatingGuide, /ctaHref: aiCrewConsultUrl/);
  assert.match(aiCrewFloatingGuide, /ctaHref: demoUseCasesUrl/);
  assert.match(aiDashiPage, /from "@\/content\/ai-dashi-links"/);
  assert.match(aiDashiPage, /<FloatingConversionCta href={aiDashiFloatingUrl} \/>/);
  assert.match(aiDashiPage, /href={aiDashiConsultUrl}/);
  assert.match(aiDashiFaq, /href={aiDashiConsultUrl}/);
  assert.match(resourcePostPage, /href={publicationPostContactUrl}/);
  assert.match(contactUsPage, /canonical:\s*"\/contact-us"/);
  assert.match(contactUsPage, /getPrefilledContactUsFormState\(urlSearchParams\)/);
  assert.doesNotMatch(aiCrewDataSource, /href: "#"/);
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
  assert.match(sitemap, /absoluteUrl\("\/contact-us"\)/);
  assert.match(sitemap, /eventPostRecords/);
  assert.match(sitemap, /getEventPostHref/);
});