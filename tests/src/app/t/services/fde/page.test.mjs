import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("/t/services/fde keeps route-local copy/composition while the layout primitives live in the service section module", () => {
  assert.equal(sourceExists("src/app/t/services/fde/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/fde/service-page.tsx"), true);
  assert.equal(sourceExists("src/app/t/solutions/aip/fde-services/page.tsx"), false);
  assert.equal(sourceExists("src/components/sections/fde-services/section.tsx"), false);

  for (const assetPath of [
    "public/services/fde/hero.svg",
    "public/services/fde/find-problems.png",
    "public/services/fde/make-plans.png",
    "public/services/fde/build-custom-ai-agents.png",
    "public/services/fde/make-ai-work.png",
  ]) {
    assert.equal(sourceExists(assetPath), true, `${assetPath} should exist`);
  }

  assert.equal(sourceExists("public/solutions/aip/fde-services/hero.svg"), false);

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
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(routeSource, /ServiceFdePreviewPage/);
  assert.doesNotMatch(routeSource, /PREVIEW SERVICE/);
  assert.doesNotMatch(routeSource, /preview で事前確認できます/);

  assert.match(sectionSource, /export function ServiceFdeHeroSection/);
  assert.match(sectionSource, /export function ServiceFdeHeroVisual/);
  assert.match(sectionSource, /export function ServiceFdeFeatureSection/);
  assert.match(sectionSource, /export function ServiceFdeFeatureRow/);
  assert.match(sectionSource, /<h4 className="text-\[32px\]/);
  assert.match(sectionSource, /export function ServiceFdeCtaSection/);
});
