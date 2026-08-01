import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("/platforms/aip keeps route-local copy/composition while the layout primitives live in the AIP section module", () => {
  assert.equal(sourceExists("src/app/platforms/aip/page.tsx"), true);
  assert.equal(sourceExists("src/app/platforms/aip/route.ts"), false);
  assert.equal(sourceExists("src/app/t/platforms/aip/page.tsx"), false);
  assert.equal(sourceExists("src/components/sections/aip/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/platform/page-primitives.tsx"), true);

  const routeSource = readSource("src/app/platforms/aip/page.tsx");
  const sectionSource = readSource("src/components/sections/aip/page.tsx");
  const platformSource = readSource("src/components/sections/platform/page-primitives.tsx");

  assert.match(routeSource, /canonical: "\/platforms\/aip"/);
  assert.match(routeSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /AIを、現場で動かすための基盤。/);
  assert.match(routeSource, /AIと既存の業務システムをつなぎ、コスト・セキュリティ・運用を一つの基盤で整える/);
  assert.match(routeSource, /QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform\.mp4/);
  assert.match(routeSource, /https:\/\/www\.querypie\.com\/assets\/products\/aip\/aip-cover\.png/);
  assert.match(routeSource, /AipValueCardLink/);
  assert.match(routeSource, /AI導入を、成果につなげる3つの基盤/);
  assert.match(routeSource, /コストを最適化し、安全につなぎ、現場に定着させる。/);
  assert.match(routeSource, /従量課金型の\s*<AipLineBreak \/>\s*エンタープライズAI/);
  assert.match(routeSource, /統合型\s*<AipLineBreak \/>\s*MCPゲートウェイ/);
  assert.match(routeSource, /FDEによる\s*<AipLineBreak \/>\s*導入・定着支援/);
  assert.match(routeSource, /href="\/services\/fde"/);
  assert.doesNotMatch(routeSource, /href="\/t\/solutions\/aip\/fde-services"/);
  assert.match(routeSource, /実務に根づく、AIの実行機能/);
  assert.match(routeSource, /指示から、実行できるプロンプトへ/);
  assert.match(routeSource, /既存のツールを、AIの実行基盤へ/);
  assert.match(routeSource, /社内の知識を、回答に活かす/);
  assert.match(routeSource, /業務に合わせて、AIエージェントを設計/);
  assert.match(routeSource, /回答を、意思決定できるレポートへ/);
  assert.match(routeSource, /定型業務を、スケジュールで自動化/);
  assert.match(routeSource, /href="\/platforms\/aip\/integrations"/);
  assert.doesNotMatch(routeSource, /href="https:\/\/www\.querypie\.com\/ja\/solutions\/aip\/integrations"/);
  assert.match(routeSource, /接続可能な連携ツールを見る/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(routeSource, /AipPreviewPage/);
  assert.doesNotMatch(routeSource, /Preview Service/i);
  assert.doesNotMatch(routeSource, /preview でローカル確認できるように移しています/);

  assert.match(sectionSource, /export function AipHeroSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /export function AipPageShell[\s\S]*<PlatformPageShell(?:\s[^>]*)?>/);
  assert.match(sectionSource, /export function AipHeroSection[\s\S]*<PlatformContentSection[\s\S]*className="pb-\[120px\] pt-\[134px\] lg:pt-\[144px\]">/);
  assert.match(sectionSource, /export function AipHeroVideo/);
  assert.match(sectionSource, /<video/);
  assert.match(sectionSource, /autoPlay/);
  assert.match(sectionSource, /playsInline/);
  assert.match(sectionSource, /poster=\{posterSrc\}/);
  assert.doesNotMatch(sectionSource, /rounded-\[12px\]/);
  assert.doesNotMatch(sectionSource, /shadow-\[0_24px_80px_-55px_rgba\(15,23,42,0\.45\)\]/);
  assert.match(sectionSource, /bg-\[#F6F8FA\] py-\[100px\] lg:py-\[120px\]/);
  assert.match(sectionSource, /export function AipValueGrid/);
  assert.match(sectionSource, /export function AipValueCardLink/);
  assert.match(sectionSource, /function AipTextButtonArrowIcon/);
  assert.match(sectionSource, /viewBox="0 0 7 12"/);
  assert.match(sectionSource, /M7 6L0\.865033 12L0 11\.154L5\.26381 6L0 0\.846L0\.865033 0L7 6Z/);
  assert.match(sectionSource, /export function AipValueCardLink[\s\S]*gap-\[10px\][\s\S]*<AipTextButtonArrowIcon \/>/);
  assert.match(sectionSource, /export function AipInlineLink[\s\S]*gap-\[10px\][\s\S]*<AipTextButtonArrowIcon \/>/);
  assert.match(sectionSource, /export function AipValueCardBody[\s\S]*pb-\[60px\]/);
  assert.match(sectionSource, /absolute inset-0 flex items-center/);
  assert.match(sectionSource, /export function AipValueSection[\s\S]*<PlatformContentSection/);
  assert.match(sectionSource, /export function AipFeatureSection/);
  assert.match(sectionSource, /export function AipFeatureSection[\s\S]*<PlatformFeatureSection[\s\S]*muted=\{muted\}>/);
  assert.match(sectionSource, /export function AipFeatureRow/);
  assert.match(sectionSource, /flex w-full flex-col items-center/);
  assert.match(sectionSource, /lg:flex-row-reverse/);
  assert.match(sectionSource, /export function AipFeatureImage/);
  assert.match(sectionSource, /--aip-feature-image-width/);
  assert.match(sectionSource, /lg:w-\[var\(--aip-feature-image-width\)\]/);
  assert.match(sectionSource, /export function AipFeatureTitle[\s\S]*text-\[20px\][\s\S]*lg:text-\[32px\]/);
  assert.match(sectionSource, /export function AipValueCard[\s\S]*flex h-full flex-col/);
  assert.match(routeSource, /<RevealOnScroll className="h-full">/);
  assert.match(routeSource, /<AipFeatureCopy className="max-w-\[538px\]">/);
  assert.match(routeSource, /<RevealOnScroll className="w-full lg:w-auto">/);

  assert.match(platformSource, /export function PlatformPageShell/);
  assert.match(platformSource, /export function PlatformContentSection/);
  assert.match(platformSource, /export function PlatformPageSection[\s\S]*pt-\[120px\][\s\S]*lg:pt-\[144px\]/);
  assert.match(platformSource, /export function PlatformHeroSection[\s\S]*<PlatformPageSection>/);
  assert.match(platformSource, /export function PlatformFeatureSection[\s\S]*<PlatformContentSection/);
  assert.match(platformSource, /relative overflow-x-hidden bg-white text-slate-950/);
  assert.match(platformSource, /paddingClassName = "px-6 lg:px-0"/);
  assert.match(platformSource, /joinClassNames\("flex justify-center", paddingClassName, className\)/);

});

test("/platforms/aip guards the route-aligned assets required for visual parity", () => {
  const routeSource = readSource("src/app/platforms/aip/page.tsx");

  for (const asset of [
    "value-usage-based-llm.png",
    "value-mcp-gateway.png",
    "value-fde-services.png",
  ]) {
    const publicPath = `/services/aip/${asset}`;

    assert.match(routeSource, new RegExp(escapeRegExp(publicPath)));
    assert.equal(sourceExists(`public${publicPath}`), true, `public${publicPath} should exist`);
  }

  for (const asset of [
    "aip_function_prompt.gif",
    "aip_function_integration.gif",
    "aip_function_knowledge.gif",
    "aip_function_createagent.gif",
    "aip_function_visualization.gif",
    "aip_function_schedule.gif",
  ]) {
    assert.match(routeSource, new RegExp(escapeRegExp(`https://www.querypie.com/assets/products/aip/${asset}`)));
  }
});
