import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("/t/services/fde keeps route-local copy/composition while the layout primitives live in the service section module", () => {
  assert.equal(sourceExists("src/app/t/services/fde/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/fde/service-page.tsx"), true);

  const routeSource = readSource("src/app/t/services/fde/page.tsx");
  const sectionSource = readSource("src/components/sections/fde/service-page.tsx");

  assert.match(routeSource, /canonical: "\/t\/services\/fde"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /QueryPie FDE/);
  assert.match(routeSource, /AXを成功に導く専門家チーム/);
  assert.match(routeSource, /課題の発見と分析/);
  assert.match(routeSource, /戦略とロードマップの策定/);
  assert.match(routeSource, /カスタムAIエージェントの構築/);
  assert.match(routeSource, /AI実用化を支援/);
  assert.match(routeSource, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.match(routeSource, /BrandGradientCtaButton/);
  assert.doesNotMatch(routeSource, /ServiceFdePreviewPage/);
  assert.doesNotMatch(routeSource, /PREVIEW SERVICE/);
  assert.doesNotMatch(routeSource, /preview で事前確認できます/);

  assert.match(sectionSource, /export function ServiceFdeHeroSection/);
  assert.match(sectionSource, /export function ServiceFdeHeroVisual/);
  assert.match(sectionSource, /export function ServiceFdeFeatureSection/);
  assert.match(sectionSource, /export function ServiceFdeFeatureRow/);
  assert.match(sectionSource, /export function ServiceFdeCtaSection/);
});
