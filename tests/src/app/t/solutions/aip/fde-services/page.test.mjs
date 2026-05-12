import test from "node:test";
import assert from "node:assert/strict";
import { readFirstExistingSource, readSource, repoExists } from "../../../../../../helpers/source-readers.mjs";

const pageFile = "src/app/t/solutions/aip/fde-services/page.tsx";
const sectionFiles = ["src/components/sections/fde-services/section.tsx", "src/components/sections/aip-fde-services-page.tsx"];
const assetFiles = [
  "public/solutions/aip/fde-services/hero.svg",
  "public/solutions/aip/fde-services/find-problems.png",
  "public/solutions/aip/fde-services/make-plans.png",
  "public/solutions/aip/fde-services/build-custom-ai-agents.png",
  "public/solutions/aip/fde-services/make-ai-work.png",
];

test("/t/solutions/aip/fde-services exists as a noindex page with route-local section composition", () => {
  assert.equal(repoExists(pageFile), true, `${pageFile} should exist`);
  assert.equal(sectionFiles.some((file) => repoExists(file)), true, `${sectionFiles.join(" or ")} should exist`);

  const pageSource = readSource(pageFile);
  const sectionSource = readFirstExistingSource(sectionFiles);

  assert.match(pageSource, /canonical:\s*"\/t\/solutions\/aip\/fde-services"/);
  assert.match(pageSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(pageSource, /<SiteHeader \/>/);
  assert.match(pageSource, /<SiteFooter \/>/);
  assert.match(pageSource, /AipFdeHeroTitle/);
  assert.match(pageSource, /QueryPie FDE/);
  assert.match(pageSource, /課題の発見と分析/);
  assert.match(pageSource, /戦略とロードマップの策定/);
  assert.match(pageSource, /カスタムAIエージェントの構築/);
  assert.match(pageSource, /AI実用化を支援/);
  assert.match(pageSource, /AipFreeTrialCtaSection|BrandGradientCtaButton href="https:\/\/app\.querypie\.com"/);
  assert.doesNotMatch(pageSource, /AipFdeServicesPreviewPage/);

  assert.match(sectionSource, /export function AipFdeHeroTitle/);
  assert.match(sectionSource, /export function AipFdeFeatureRow/);
  assert.match(sectionSource, /export function AipFdeCtaSection/);
});

test("/t/solutions/aip/fde-services uses route-aligned local assets", () => {
  const pageSource = readSource(pageFile);
  const sectionSource = readFirstExistingSource(sectionFiles);

  for (const assetFile of assetFiles) {
    assert.equal(repoExists(assetFile), true, `${assetFile} should exist`);
  }

  const combinedSource = `${pageSource}\n${sectionSource}`;

  assert.match(combinedSource, /\/solutions\/aip\/fde-services\/hero\.svg/);
  assert.match(combinedSource, /\/solutions\/aip\/fde-services\/find-problems\.png/);
  assert.match(combinedSource, /\/solutions\/aip\/fde-services\/make-plans\.png/);
  assert.match(combinedSource, /\/solutions\/aip\/fde-services\/build-custom-ai-agents\.png/);
  assert.match(combinedSource, /\/solutions\/aip\/fde-services\/make-ai-work\.png/);
  assert.doesNotMatch(combinedSource, /\/services\/fde\//);
});
