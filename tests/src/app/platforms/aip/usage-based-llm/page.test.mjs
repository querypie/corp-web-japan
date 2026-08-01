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
  assert.match(routeSource, /従量課金型エンタープライズAI｜QueryPie AIP/);
  assert.match(routeSource, /使った分だけで、/);
  assert.match(routeSource, /使った分だけ、無駄なく支払う/);
  assert.match(routeSource, /用途に合わせて、LLMを選ぶ/);
  assert.match(routeSource, /SSOと一元管理で、組織利用に対応/);
  assert.match(routeSource, /全社導入のコストを、利用実態に合わせる。/);
  assert.match(routeSource, /\$0（従量課金）/);
  assert.match(routeSource, /Claude、GPT、Gemini、自社保有LLM/);
  assert.match(routeSource, /US\$7,200〜／年/);
  assert.match(routeSource, /assets\/products\/aip\/usage-based-llm\/aip_function_pay\.gif/);
  assert.match(routeSource, /assets\/products\/aip\/usage-based-llm\/aip_function_llmmodel\.gif/);
  assert.match(routeSource, /assets\/products\/aip\/usage-based-llm\/aip_function_sso\.gif/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(routeSource, /AipUsageBasedLlmPreviewPage/);

  assert.match(sectionSource, /export function AipUsageBasedLlmHeroSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /export function AipUsageBasedLlmPageShell[\s\S]*<PlatformPageShell(?:\s[^>]*)?>/);
  assert.match(sectionSource, /export function AipUsageBasedLlmHeroSection[\s\S]*<PlatformContentSection[\s\S]*className="pb-\[120px\] pt-\[134px\] lg:pt-\[144px\]" contentWidthClassName="max-w-\[1200px\]">/);
  assert.match(sectionSource, /w-full text-left text-\[36px\][\s\S]*lg:text-\[44px\]/);
  assert.match(sectionSource, /mt-5 max-w-\[600px\] text-left text-\[16px\][\s\S]*leading-\[26px\]/);
  assert.match(sectionSource, /export function AipUsageBasedLlmHeroFootnote[\s\S]*<small[^>]*className="text-\[10px\] font-light leading-\[28px\] tracking-\[0\.36px\] text-\[#57606A\]">/);
  assert.match(routeSource, /<AipUsageBasedLlmHeroFootnote>\*削減率は利用条件により異なります<\/AipUsageBasedLlmHeroFootnote>/);
  assert.match(sectionSource, /assets\/products\/aip\/usage-based-llm\/usage-based-llm\.svg/);
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
  assert.match(sectionSource, /export function AipUsageBasedLlmComparisonSection[\s\S]*bg-\[#F6F8FA\] py-\[100px\] lg:py-\[120px\]/);
  assert.match(sectionSource, /export function AipUsageBasedLlmComparisonTable[\s\S]*min-w-\[1040px\]/);
  assert.match(sectionSource, /grid-cols-\[180px_repeat\(5,minmax\(0,1fr\)\)\]/);
  assert.doesNotMatch(sectionSource, /AipUsageBasedLlmComparisonImage/);
  assert.match(sectionSource, /export function AipUsageBasedLlmCtaButtonWrap/);

  assert.match(platformSource, /contentClassName\?: string/);
  assert.match(platformSource, /contentWidthClassName\?: string/);
  assert.match(platformSource, /paddingClassName\?: string/);
});
