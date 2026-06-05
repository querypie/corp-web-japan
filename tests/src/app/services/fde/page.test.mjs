import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/services/fde is a public page with indexable metadata and canonical path", () => {
  assert.equal(sourceExists("src/app/services/fde/page.tsx"), true);
  assert.equal(sourceExists("src/app/services/fde/route.ts"), false);
  assert.equal(sourceExists("src/app/t/services/fde/page.tsx"), false);
  assert.equal(sourceExists("src/components/sections/fde/service-page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/platform/page-primitives.tsx"), true);

  for (const assetPath of [
    "public/services/fde/hero.svg",
    "public/services/fde/find-problems.png",
    "public/services/fde/make-plans.png",
    "public/services/fde/build-custom-ai-agents.png",
    "public/services/fde/make-ai-work.png",
  ]) {
    assert.equal(sourceExists(assetPath), true, `${assetPath} should exist`);
  }

  const routeSource = readSource("src/app/services/fde/page.tsx");
  const sectionSource = readSource("src/components/sections/fde/service-page.tsx");
  const platformSource = readSource("src/components/sections/platform/page-primitives.tsx");

  assert.match(routeSource, /canonical: "\/services\/fde"/);
  assert.match(routeSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /QueryPie FDE/);
  assert.match(routeSource, /AXを成功に導く専門家チーム/);
  assert.match(routeSource, /課題の発見と分析/);
  assert.match(routeSource, /戦略とロードマップの策定/);
  assert.match(routeSource, /カスタムAIエージェントの構築/);
  assert.match(routeSource, /AI実用化を支援/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);

  assert.match(sectionSource, /export function ServiceFdeHeroSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /export function ServiceFdePageShell[\s\S]*<PlatformPageShell(?:\s[^>]*)?>/);
  assert.match(sectionSource, /export function ServiceFdeHeroSection[\s\S]*<PlatformContentSection[\s\S]*className="pb-\[120px\] pt-\[134px\] lg:pt-\[144px\]">/);
  assert.match(sectionSource, /export function ServiceFdeHeroTitle[\s\S]*mx-auto max-w-\[800px\][\s\S]*text-\[48px\][\s\S]*lg:text-\[60px\]/);
  assert.match(sectionSource, /export function ServiceFdeHeroLead[\s\S]*max-w-\[1000px\][\s\S]*text-\[18px\][\s\S]*leading-\[28px\]/);
  assert.match(sectionSource, /export function ServiceFdeHeroVisual/);
  assert.match(sectionSource, /export function ServiceFdeFeatureSection/);
  assert.match(sectionSource, /export function ServiceFdeFeatureSection[\s\S]*<PlatformFeatureSection muted=\{muted\}>/);
  assert.match(sectionSource, /export function ServiceFdeFeatureRow/);
  assert.match(sectionSource, /flex flex-col items-center[\s\S]*gap-\[60px\][\s\S]*lg:gap-\[80px\][\s\S]*lg:flex-row/);
  assert.match(sectionSource, /--fde-feature-image-width/);
  assert.match(sectionSource, /lg:w-\[var\(--fde-feature-image-width\)\]/);
  assert.match(sectionSource, /shadow-\[0_4px_12px_rgba\(0,0,0,0\.1\)\]/);
  assert.match(sectionSource, /lg:shadow-\[0_8px_20px_rgba\(0,0,0,0\.15\)\]/);
  assert.match(sectionSource, /<h4 className="[^"]*text-\[32px\][^"]*leading-\[42px\][^"]*max-\[480px\]:text-\[20px\][^"]*max-\[480px\]:leading-\[28px\][^"]*"/);
  assert.match(sectionSource, /export function ServiceFdeCtaSection/);
  assert.match(sectionSource, /export function ServiceFdeCtaSection[\s\S]*<PlatformCtaSection>/);

  assert.match(platformSource, /export function PlatformPageShell/);
  assert.match(platformSource, /export function PlatformContentSection/);
  assert.match(platformSource, /export function PlatformPageSection[\s\S]*pt-\[120px\][\s\S]*lg:pt-\[144px\]/);
  assert.match(platformSource, /export function PlatformHeroSection[\s\S]*<PlatformPageSection>/);
  assert.match(platformSource, /export function PlatformFeatureSection[\s\S]*<PlatformContentSection/);
  assert.match(platformSource, /export function PlatformCtaSection/);
});
