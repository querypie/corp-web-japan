import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import { getAiCrewDataSource, getTopPageDataSource, getTopPageStructureSource } from "./helpers/static-marketing-page-sources.mjs";

test("launch-risk CTA targets resolve to explicit anchors or real destinations", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const topPage = readSource("src/app/page.tsx");
  const heroSection = readSource("src/components/sections/home/hero-section.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const topPageDataSource = getTopPageDataSource();
  const topPageStructureSource = getTopPageStructureSource();
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiFaq = readSource("src/components/sections/internal-demo/ai-dashi-faq.tsx");
  const resourcePostPage = readSource("src/components/sections/publication-post-page.tsx");
  const contactUsPage = readSource("src/app/contact-us/page.tsx");
  const topPageSecuritySection = readSource("src/components/sections/home/security-section.tsx");

  assert.match(aiCrewDataSource, /const aiCrewConsultUrl =|export const aiCrewConsultUrl =/);
  assert.match(aiCrewDataSource, /const demoUseCasesUrl =|export const demoUseCasesUrl =/);
  assert.match(aiCrewDataSource, /const aiCrewFloatingCtaUrl = "\/contact-us\?product=ai-crew"|<FloatingConversionCta href=\{aiCrewFloatingCtaUrl\} \/>/);
  assert.match(
    aiCrewDataSource,
    /secondaryCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewConsultUrl \}|<AICrewUseCasesSecondaryAction href=\{aiCrewConsultUrl\}>/,
  );
  assert.match(aiCrewDataSource, /primaryCta: \{ label: "進め方を相談する", href: aiCrewConsultUrl \}|<AICrewProcessPrimaryAction href=\{aiCrewConsultUrl\}>[\s\S]*?進め方を相談する[\s\S]*?<\/AICrewProcessPrimaryAction>/);
  assert.match(
    aiCrewDataSource,
    /partnerCta: \{ label: "自社サービスAI化の進め方を見る", href: "\/solutions\/ai-dashi" \}|<AICrewDashiPromoAction href="\/solutions\/ai-dashi">/,
  );
  assert.match(aiCrewDataSource, /href: aiCrewWhitepaperUrl|href=\{aiCrewWhitepaperUrl\}/);

  assert.doesNotMatch(topPage, /FloatingConversionCta/);
  assert.match(`${topPageDataSource}
${topPage}`, /<HeroPrimaryAction href=\{topPageFinalDemoUrl\}>導入相談・デモを依頼<\/HeroPrimaryAction>/);
  assert.match(`${topPageDataSource}
${topPage}`, /secondaryCta: \{[\s\S]*label: "資料をダウンロード",[\s\S]*href: topPageDownloadUrl,?[\s\S]*\}|<HeroSecondaryAction href=\{topPageDownloadUrl\}>資料をダウンロード<\/HeroSecondaryAction>/);
  assert.match(topPageStructureSource, /id="contact"/);
  assert.match(topPageStructureSource, /bg-\[#0f172a\] text-white/);
  assert.match(topPageStructureSource, /id="download"/);
  assert.match(topPage, /<PlatformRequirementsBlockTitle>ハルシネーションリスクを抑え、既存システムと繋がるセキュアな統合<\/PlatformRequirementsBlockTitle>/);
  assert.match(topPage, /企業データのみに基づく事実回答を目指すガードレールを実装し、業務利用で許されないAIの嘘（ハルシネーション）のリスク低減を図ります。/);
  assert.match(topPage, /<FinalCtaAction href=\{topPageFinalDemoUrl\} primary>導入相談・デモを依頼<\/FinalCtaAction>/);
  assert.match(topPageDataSource, /\{ label: "資料をダウンロード", href: topPageDownloadUrl \}|<FinalCtaAction href=\{topPageDownloadUrl\}>資料をダウンロード<\/FinalCtaAction>/);
  assert.doesNotMatch(topPage, /topPageFinalConsultUrl|導入について相談する/);
  assert.match(heroSection, /aria-label="導入実績と提供価値"/);
  assert.match(heroSection, /role="list"/);
  assert.match(heroSection, /role="listitem"/);
  assert.match(heroSection, /flex w-max min-w-full flex-nowrap items-center gap-1\.5 overflow-x-auto/);
  assert.match(`${topPageDataSource}
${topPage}`, /href: "https:\/\/trust\.querypie\.com\/"|<SecurityAction href="https:\/\/trust\.querypie\.com\/">/);
  assert.match(`${topPageStructureSource}
${topPageSecuritySection}
${topPage}`, /href=\{security\.link\.href\}|<SecurityAction href="https:\/\/trust\.querypie\.com\/">/);
  assert.match(`${topPageStructureSource}
${topPageSecuritySection}
${topPage}`, /target="_blank"/);
  assert.match(`${topPageStructureSource}
${topPageSecuritySection}
${topPage}`, /rel="noopener noreferrer"/);
  assert.match(topPage, /国際基準のセキュリティと、AIデータ保護/);
  assert.match(topPage, /Zero Data Retention/);
  assert.match(topPage, /入力データを、AIモデルの学習に利用しない/);
  assert.match(topPage, /外部AIモデルの学習や長期保存に利用しません。/);
  assert.match(topPage, /データリージョン/);
  assert.match(topPage, /東京リージョンでデータを管理/);
  assert.match(topPageSecuritySection, /export function SecurityDataProtectionGrid/);
  assert.match(topPageSecuritySection, /export function SecurityDataProtectionCard/);
  assert.match(aiCrewPage, /<FloatingConversionCta href={aiCrewFloatingCtaUrl} \/>/);
  assert.match(aiDashiPage, /from "@\/content\/ai-dashi-links"/);
  assert.match(aiDashiPage, /<FloatingConversionCta href={aiDashiFloatingUrl} \/>/);
  assert.match(aiDashiPage, /href={aiDashiConsultUrl}/);
  assert.match(aiDashiFaq, /href={ctaHref}/);
  assert.match(resourcePostPage, /href={publicationPostContactUrl}/);
  assert.match(contactUsPage, /canonical:\s*"\/contact-us"/);
  assert.match(contactUsPage, /getPrefilledContactUsFormState\(urlSearchParams\)/);
  assert.doesNotMatch(aiCrewDataSource, /href: "#"/);
});

test("events is now a released resource hub with canonical metadata and a sitemap entry", () => {
  const eventsPage = readSource("src/app/events/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(eventsPage, /canonical:\s*"\/events"/);
  assert.match(eventsPage, /resolveEventTimeline\(resolvedSearchParams\?\.asof\)/);
  assert.match(eventsPage, /FeaturedEventHero/);
  assert.match(eventsPage, /InternalEventsDemoEmptyState/);
  assert.match(eventsPage, /Past Events/);
  assert.match(sitemap, /absoluteUrl\("\/events", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/resources", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/introduction-deck", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/manuals", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/glossary", deployedSiteUrl\)/);
});

test("robots and sitemap metadata files exist and cover the core public routes", () => {
  const robots = readSource("src/app/robots.ts");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(robots, /sitemap: new URL\("\/sitemap\.xml", deployedSiteUrl\)\.toString\(\)/);
  assert.match(robots, /host: deployedSiteUrl\.toString\(\)/);
  assert.doesNotMatch(robots, /\/privacy-policy/);
  assert.doesNotMatch(robots, /\/terms-of-service/);

  assert.match(sitemap, /absoluteUrl\("\/", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/solutions\/ai-crew", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/solutions\/ai-dashi", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/blog", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/whitepapers", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/resources", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/introduction-deck", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/glossary", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/manuals", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/contact-us", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/cookie-preference", deployedSiteUrl\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/terms-of-service", deployedSiteUrl\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/privacy-policy", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\("\/eula", deployedSiteUrl\)/);
  assert.match(sitemap, /eventPostRecords/);
  assert.match(sitemap, /getEventPostHref/);
});
