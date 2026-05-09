import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("/t/services/acp keeps route-local copy/composition while the interactive feature browser lives in the section module", () => {
  assert.equal(sourceExists("src/app/t/services/acp/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp-service-page.tsx"), true);

  const routeSource = readSource("src/app/t/services/acp/page.tsx");
  const sectionSource = readSource("src/components/sections/acp-service-page.tsx");

  assert.match(routeSource, /canonical: "\/t\/services\/acp"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /AcpHeroVideo/);
  assert.match(routeSource, /簡単インストール、簡単使用/);
  assert.match(sectionSource, /QueryPie ACPができること/);
  assert.match(routeSource, /データベースアクセス制御/);
  assert.match(routeSource, /システムアクセス制御/);
  assert.match(routeSource, /Kubernetesアクセス制御/);
  assert.match(routeSource, /Webアクセス制御/);
  assert.match(routeSource, /ワークフロー & 統合/);
  assert.match(routeSource, /利用可能なACP統合機能をすべて見る/);
  assert.match(routeSource, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.match(routeSource, /BrandGradientCtaButton/);
  assert.doesNotMatch(routeSource, /PREVIEW SERVICE/);
  assert.doesNotMatch(routeSource, /現在の upstream ページで案内している代表機能/);

  assert.match(sectionSource, /export function AcpHeroVideo/);
  assert.match(sectionSource, /export function AcpFeatureBrowser/);
  assert.match(sectionSource, /useState/);
  assert.match(sectionSource, /Learn More/);
  assert.match(sectionSource, /Previous feature/);
  assert.match(sectionSource, /Next feature/);
});
