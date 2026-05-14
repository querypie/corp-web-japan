import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("/t/platforms/acp keeps route-local copy/composition while the interactive feature browser lives in a dedicated client section module", () => {
  assert.equal(sourceExists("src/app/t/platforms/acp/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp/service-page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/platform/page-primitives.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp/feature-browser.tsx"), true);

  const routeSource = readSource("src/app/t/platforms/acp/page.tsx");
  const sectionSource = readSource("src/components/sections/acp/service-page.tsx");
  const platformSource = readSource("src/components/sections/platform/page-primitives.tsx");
  const browserSource = readSource("src/components/sections/acp/feature-browser.tsx");
  const browserClientSource = readSource("src/components/sections/acp/feature-browser-client.tsx");

  assert.match(routeSource, /canonical: "\/t\/platforms\/acp"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /AcpHeroVideo/);
  assert.match(routeSource, /簡単インストール、簡単使用/);
  assert.match(routeSource, /QueryPie ACPができること/);
  assert.doesNotMatch(routeSource, /データベース、システム、Kubernetes、Web、ワークフロー全体にまたがる代表機能をカテゴリごとに確認できます。/);
  assert.match(routeSource, /<AcpFeatureCategoryLabel>データベースアクセス制御<\/AcpFeatureCategoryLabel>/);
  assert.match(routeSource, /<AcpFeatureCategoryLabel>システムアクセス制御<\/AcpFeatureCategoryLabel>/);
  assert.match(routeSource, /<AcpFeatureCategoryLabel>Kubernetesアクセス制御<\/AcpFeatureCategoryLabel>/);
  assert.match(routeSource, /<AcpFeatureCategoryLabel>Webアクセス制御<\/AcpFeatureCategoryLabel>/);
  assert.match(routeSource, /<AcpFeatureCategoryLabel>ワークフロー & 統合<\/AcpFeatureCategoryLabel>/);
  assert.match(routeSource, /<AcpFeatureItemTitle>エージェントレスクラウド<\/AcpFeatureItemTitle>/);
  assert.match(routeSource, /<AcpFeatureItemTitle>簡単なログストリーミング<\/AcpFeatureItemTitle>/);
  assert.match(routeSource, /<AcpFeatureItemBody>/);
  assert.match(routeSource, /利用可能なACP統合機能をすべて見る/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(routeSource, /<AcpFeatureCategory label=/);
  assert.doesNotMatch(routeSource, /<AcpFeatureItem\s+title=/);
  assert.doesNotMatch(routeSource, /type AcpFeatureItem =/);
  assert.doesNotMatch(routeSource, /type AcpFeatureCategory =/);
  assert.doesNotMatch(routeSource, /const categories =/);
  assert.doesNotMatch(routeSource, /AcpServicePreviewPage/);
  assert.doesNotMatch(routeSource, /プレビューです/);
  assert.doesNotMatch(routeSource, /PREVIEW SERVICE/);
  assert.doesNotMatch(routeSource, /現在の upstream ページで案内している代表機能/);

  assert.match(sectionSource, /export function AcpFeatureSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /export function AcpServicePageShell[\s\S]*<PlatformPageShell>/);
  assert.match(sectionSource, /export function AcpHeroSection[\s\S]*<PlatformHeroSection>/);
  assert.match(sectionSource, /export function AcpFeatureSection[\s\S]*<PlatformContentSection className="pb-\[80px\]">/);
  assert.match(sectionSource, /export function AcpFeatureIntro/);
  assert.match(sectionSource, /export function AcpIntegrationsLink/);
  assert.match(sectionSource, /export function AcpHeroVideo/);
  assert.doesNotMatch(sectionSource, /^"use client";/m);

  assert.match(platformSource, /export function PlatformPageShell/);
  assert.match(platformSource, /export function PlatformContentSection/);
  assert.match(platformSource, /export function PlatformPageSection[\s\S]*pt-\[120px\][\s\S]*lg:pt-\[144px\]/);
  assert.match(platformSource, /export function PlatformHeroSection[\s\S]*<PlatformPageSection>/);
  assert.match(platformSource, /paddingClassName = "px-6 lg:px-0"/);
  assert.match(platformSource, /joinClassNames\("flex justify-center", paddingClassName, className\)/);

  assert.match(browserSource, /export function AcpFeatureBrowser/);
  assert.match(browserSource, /export function AcpFeatureCategory/);
  assert.match(browserSource, /export function AcpFeatureCategoryLabel/);
  assert.match(browserSource, /export function AcpFeatureItem/);
  assert.match(browserSource, /export function AcpFeatureItemTitle/);
  assert.match(browserSource, /export function AcpFeatureItemBody/);
  assert.match(browserSource, /node\.type === AcpFeatureCategoryLabel/);
  assert.match(browserSource, /node\.type === AcpFeatureItemTitle/);
  assert.match(browserSource, /node\.type === AcpFeatureItemBody/);
  assert.match(browserSource, /Children\.toArray/);
  assert.match(browserSource, /AcpFeatureBrowserClient/);
  assert.match(browserSource, /toBodyLines/);

  assert.match(browserClientSource, /^"use client";/m);
  assert.match(browserClientSource, /useState/);
  assert.match(browserClientSource, /Learn More/);
  assert.match(browserClientSource, /Previous feature/);
  assert.match(browserClientSource, /Next feature/);
  assert.match(browserClientSource, /Show feature/);
  assert.match(browserClientSource, /grid w-full gap-\[60px\] lg:grid-cols-\[380px_1fr\]/);
});
