import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("/t/services/acp keeps route-local copy/composition while the interactive feature browser lives in a dedicated client section module", () => {
  assert.equal(sourceExists("src/app/t/services/acp/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp-service-page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp-feature-browser.tsx"), true);

  const routeSource = readSource("src/app/t/services/acp/page.tsx");
  const sectionSource = readSource("src/components/sections/acp-service-page.tsx");
  const browserSource = readSource("src/components/sections/acp-feature-browser.tsx");

  assert.match(routeSource, /canonical: "\/t\/services\/acp"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /AcpHeroVideo/);
  assert.match(routeSource, /簡単インストール、簡単使用/);
  assert.match(routeSource, /QueryPie ACPができること/);
  assert.match(routeSource, /データベース、システム、Kubernetes、Web、ワークフロー全体にまたがる代表機能をカテゴリごとに確認できます。/);
  assert.match(routeSource, /<AcpFeatureCategory label="データベースアクセス制御">/);
  assert.match(routeSource, /<AcpFeatureCategory label="システムアクセス制御">/);
  assert.match(routeSource, /<AcpFeatureCategory label="Kubernetesアクセス制御">/);
  assert.match(routeSource, /<AcpFeatureCategory label="Webアクセス制御">/);
  assert.match(routeSource, /<AcpFeatureCategory label="ワークフロー & 統合">/);
  assert.match(routeSource, /<AcpFeatureItem\s+title="エージェントレスクラウド"/);
  assert.match(routeSource, /<AcpFeatureItem\s+title="簡単なログストリーミング"/);
  assert.match(routeSource, /利用可能なACP統合機能をすべて見る/);
  assert.match(routeSource, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.match(routeSource, /BrandGradientCtaButton/);
  assert.doesNotMatch(routeSource, /type AcpFeatureItem =/);
  assert.doesNotMatch(routeSource, /type AcpFeatureCategory =/);
  assert.doesNotMatch(routeSource, /const categories =/);
  assert.doesNotMatch(routeSource, /PREVIEW SERVICE/);
  assert.doesNotMatch(routeSource, /現在の upstream ページで案内している代表機能/);

  assert.match(sectionSource, /export function AcpFeatureSection/);
  assert.match(sectionSource, /export function AcpFeatureIntro/);
  assert.match(sectionSource, /export function AcpIntegrationsLink/);
  assert.match(sectionSource, /export function AcpHeroVideo/);
  assert.doesNotMatch(sectionSource, /^"use client";/m);

  assert.match(browserSource, /^"use client";/m);
  assert.match(browserSource, /export function AcpFeatureBrowser/);
  assert.match(browserSource, /export function AcpFeatureCategory/);
  assert.match(browserSource, /export function AcpFeatureItem/);
  assert.match(browserSource, /Children\.toArray/);
  assert.match(browserSource, /useState/);
  assert.match(browserSource, /Learn More/);
  assert.match(browserSource, /Previous feature/);
  assert.match(browserSource, /Next feature/);
});
