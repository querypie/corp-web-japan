import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

test("/t/services/aip keeps route-local copy/composition while the layout primitives live in the service section module", () => {
  assert.equal(sourceExists("src/app/t/services/aip/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/aip-service-page.tsx"), true);

  const routeSource = readSource("src/app/t/services/aip/page.tsx");
  const sectionSource = readSource("src/components/sections/aip-service-page.tsx");

  assert.match(routeSource, /canonical: "\/t\/services\/aip"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /AipServiceHeroVideo/);
  assert.match(routeSource, /成果にこだわるエンタープライズAI/);
  assert.match(routeSource, /AI導入を、ワンストップで実現する３つの価値/);
  assert.match(routeSource, /従量課金型の AIモデル/);
  assert.match(routeSource, /統合型 AIゲートウェイ/);
  assert.match(routeSource, /AI専門家伴走 サービス/);
  assert.match(routeSource, /QueryPie AIPができること/);
  assert.match(routeSource, /プロンプト自動生成/);
  assert.match(routeSource, /シンプルな統合/);
  assert.match(routeSource, /社内文書の学習機能/);
  assert.match(routeSource, /カスタムエージェント作成/);
  assert.match(routeSource, /ビジュアルレポート作成/);
  assert.match(routeSource, /エージェントスケジューリング/);
  assert.match(routeSource, /QueryPie AIPと接続可能な連携ツールの一覧はこちら/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<CanonicalTypeACtaSection \/>/);
  assert.doesNotMatch(routeSource, /AipServicePreviewPage/);
  assert.doesNotMatch(routeSource, /Preview Service/i);
  assert.doesNotMatch(routeSource, /preview でローカル確認できるように移しています/);

  assert.match(sectionSource, /export function AipServiceHeroSection/);
  assert.match(sectionSource, /export function AipServiceHeroVideo/);
  assert.match(sectionSource, /export function AipServiceValueGrid/);
  assert.match(sectionSource, /export function AipServiceFeatureSection/);
  assert.match(sectionSource, /export function AipServiceFeatureRow/);
  assert.match(sectionSource, /export function AipServiceFeatureImage/);
});
