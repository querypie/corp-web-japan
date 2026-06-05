import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("published usage-based-llm page keeps route-local copy/composition", () => {
  assert.equal(sourceExists("src/app/platforms/aip/usage-based-llm/page.tsx"), true);
  assert.equal(sourceExists("src/app/t/platforms/aip/usage-based-llm/page.tsx"), false);

  const routeSource = readSource("src/app/platforms/aip/usage-based-llm/page.tsx");
  const sectionSource = readSource("src/components/sections/usage-based-llm/section.tsx");
  const platformSource = readSource("src/components/sections/platform/page-primitives.tsx");

  assert.match(routeSource, /canonical: "\/platforms\/aip\/usage-based-llm"/);
  assert.match(routeSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /QueryPie AIP：実際使用量ベースエンタープライズAI/);
  assert.match(routeSource, /利用量に応じた課金モデル/);
  assert.match(routeSource, /選択可能なプレミアムLLM/);
  assert.match(routeSource, /シングルサインオン\(SSO\) で一元管理/);
  assert.match(routeSource, /最高のパフォーマンスを、最適なコストで！/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(routeSource, /AipUsageBasedLlmPreviewPage/);

  assert.match(sectionSource, /export function AipUsageBasedLlmHeroSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /export function AipUsageBasedLlmPageShell[\s\S]*<PlatformPageShell(?:\s[^>]*)?>/);
  assert.match(sectionSource, /export function AipUsageBasedLlmHeroSection[\s\S]*<PlatformContentSection[\s\S]*className="pb-\[120px\] pt-\[134px\] lg:pt-\[144px\]" contentWidthClassName="max-w-\[1200px\]">/);
  assert.match(sectionSource, /max-w-\[800px\][\s\S]*text-\[48px\][\s\S]*text-\[#24292F\][\s\S]*lg:text-\[60px\]/);
  assert.match(sectionSource, /max-w-\[1000px\]/);
  assert.match(sectionSource, /mt-\[20px\]/);
  assert.match(sectionSource, /export function AipUsageBasedLlmHeroFootnote[\s\S]*<small[^>]*className="text-\[10px\] font-light leading-\[28px\] tracking-\[0\.36px\] text-\[#57606A\]">/);
  assert.match(routeSource, /<AipUsageBasedLlmHeroFootnote>\*ユーザーの利用量により異なります<\/AipUsageBasedLlmHeroFootnote>/);
  assert.match(sectionSource, /className="py-\[80px\]"/);
  assert.match(sectionSource, /<PlatformContentSection[\s\S]*as="div"[\s\S]*contentClassName=\{cn\(/);
  assert.match(sectionSource, /flex flex-col items-center justify-center gap-\[60px\] lg:gap-\[80px\]/);
  assert.match(sectionSource, /reverse \? "lg:flex-row-reverse" : "lg:flex-row"/);
  assert.doesNotMatch(sectionSource, /grid items-center gap-x-\[75px\]/);
  assert.doesNotMatch(sectionSource, /MarketingPageSection/);
  assert.doesNotMatch(sectionSource, /lg:min-h-\[458px\]/);
  assert.match(sectionSource, /export function AipUsageBasedLlmFeatureRow/);
  assert.match(sectionSource, /export function AipUsageBasedLlmFeatureCopy[\s\S]*flex w-full max-w-full flex-col gap-\[20px\]/);
  assert.match(sectionSource, /export function AipUsageBasedLlmFeatureTitle[\s\S]*max-\[480px\]:text-\[20px\][\s\S]*max-\[480px\]:leading-\[28px\]/);
  assert.match(sectionSource, /--usage-feature-image-width/);
  assert.match(sectionSource, /shadow-\[0_4px_12px_rgba\(0,0,0,0\.1\)\]/);
  assert.match(sectionSource, /lg:shadow-\[0_8px_20px_rgba\(0,0,0,0\.15\)\]/);
  assert.match(routeSource, /<AipUsageBasedLlmFeatureRow reverse>/);
  assert.match(routeSource, /className="lg:w-\[445px\] lg:max-w-\[445px\]"/);
  assert.match(routeSource, /className="ml-auto lg:w-\[534px\] lg:max-w-\[534px\]"/);
  assert.match(routeSource, /className="lg:w-\[518px\] lg:max-w-\[518px\]"/);
  assert.match(sectionSource, /export function AipUsageBasedLlmComparisonSection[\s\S]*className="py-\[160px\]"/);
  assert.match(sectionSource, /mt-\[80px\]/);
  assert.match(sectionSource, /export function AipUsageBasedLlmCtaButtonWrap/);

  assert.match(platformSource, /contentClassName\?: string/);
  assert.match(platformSource, /contentWidthClassName\?: string/);
  assert.match(platformSource, /paddingClassName\?: string/);
});
