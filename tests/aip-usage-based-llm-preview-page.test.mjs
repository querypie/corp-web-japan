import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "./helpers/source-readers.mjs";

test("usage-based-llm page keeps route-local copy/composition and preserves the upstream redirect route", () => {
  assert.equal(sourceExists("src/app/t/solutions/aip/usage-based-llm/page.tsx"), true);

  const routeSource = readSource("src/app/t/solutions/aip/usage-based-llm/page.tsx");
  const sectionSource = readSource("src/components/sections/aip-usage-based-llm.tsx");
  const redirectSource = readSource("src/app/platform/ai/aip/usage-based-llm/route.ts");

  assert.match(routeSource, /canonical: "\/t\/solutions\/aip\/usage-based-llm"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
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
  assert.match(sectionSource, /export function AipUsageBasedLlmFeatureRow/);
  assert.match(sectionSource, /export function AipUsageBasedLlmComparisonSection/);
  assert.match(sectionSource, /export function AipUsageBasedLlmCtaButtonWrap/);

  assert.match(redirectSource, /const destination = "https:\/\/www\.querypie\.com\/ja\/solutions\/aip\/usage-based-llm";/);
  assert.match(redirectSource, /return NextResponse\.redirect\(destination, 307\);/);
  assert.match(redirectSource, /export const HEAD = GET;/);
});
