import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../../helpers/source-readers.mjs";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("/t/platforms/aip keeps route-local copy/composition while the layout primitives live in the AIP section module", () => {
  assert.equal(sourceExists("src/app/t/platforms/aip/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/aip/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/platform/page-primitives.tsx"), true);

  const routeSource = readSource("src/app/t/platforms/aip/page.tsx");
  const sectionSource = readSource("src/components/sections/aip/page.tsx");
  const platformSource = readSource("src/components/sections/platform/page-primitives.tsx");

  assert.match(routeSource, /canonical: "\/t\/platforms\/aip"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /AipHeroVideo/);
  assert.match(routeSource, /AipValueCardLink/);
  assert.match(routeSource, /成果にこだわるエンタープライズAI/);
  assert.match(routeSource, /AI導入を、ワンストップで実現する３つの価値/);
  assert.match(routeSource, /従量課金型の\s*<AipLineBreak \/>\s*AIモデル/);
  assert.match(routeSource, /統合型\s*<AipLineBreak \/>\s*AIゲートウェイ/);
  assert.match(routeSource, /AI専門家伴走\s*<AipLineBreak \/>\s*サービス/);
  assert.match(routeSource, /href="\/t\/services\/fde"/);
  assert.doesNotMatch(routeSource, /href="\/t\/solutions\/aip\/fde-services"/);
  assert.match(routeSource, /QueryPie AIPができること/);
  assert.match(routeSource, /プロンプト自動生成/);
  assert.match(routeSource, /シンプルな統合/);
  assert.match(routeSource, /社内文書の学習機能/);
  assert.match(routeSource, /カスタムエージェント作成/);
  assert.match(routeSource, /ビジュアルレポート作成/);
  assert.match(routeSource, /エージェントスケジューリング/);
  assert.match(routeSource, /href="\/t\/platforms\/aip\/integrations"/);
  assert.doesNotMatch(routeSource, /href="https:\/\/www\.querypie\.com\/ja\/solutions\/aip\/integrations"/);
  assert.match(routeSource, /QueryPie AIPと接続可能な連携ツールの一覧はこちら/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(routeSource, /AipPreviewPage/);
  assert.doesNotMatch(routeSource, /Preview Service/i);
  assert.doesNotMatch(routeSource, /preview でローカル確認できるように移しています/);

  assert.match(sectionSource, /export function AipHeroSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /export function AipPageShell[\s\S]*<PlatformPageShell>/);
  assert.match(sectionSource, /export function AipHeroSection[\s\S]*<PlatformHeroSection>/);
  assert.match(sectionSource, /export function AipHeroVideo/);
  assert.match(sectionSource, /bg-\[linear-gradient\(291deg,#C5D6E6_0%,#FFF_100%\)\]/);
  assert.match(sectionSource, /export function AipValueGrid/);
  assert.match(sectionSource, /export function AipValueCardLink/);
  assert.match(sectionSource, /absolute inset-0 flex items-center/);
  assert.match(sectionSource, /export function AipFeatureSection/);
  assert.match(sectionSource, /export function AipFeatureSection[\s\S]*<PlatformFeatureSection muted=\{muted\}>/);
  assert.match(sectionSource, /export function AipFeatureRow/);
  assert.match(sectionSource, /export function AipFeatureImage/);
  assert.match(sectionSource, /style=\{\{ width \}\}/);

  assert.match(platformSource, /export function PlatformPageShell/);
  assert.match(platformSource, /export function PlatformPageSection/);
  assert.match(platformSource, /export function PlatformHeroSection/);
  assert.match(platformSource, /export function PlatformFeatureSection/);
  assert.match(platformSource, /relative overflow-x-hidden bg-white text-slate-950/);
  assert.match(platformSource, /flex justify-center px-6 lg:px-0/);
});

test("/t/platforms/aip guards the route-aligned assets required for visual parity", () => {
  const routeSource = readSource("src/app/t/platforms/aip/page.tsx");

  for (const asset of [
    "value-usage-based-llm.png",
    "value-mcp-gateway.png",
    "value-fde-services.png",
    "prompt.gif",
    "integration.gif",
    "knowledge.gif",
    "custom-agent.gif",
    "visual-report.gif",
    "scheduling.gif",
  ]) {
    const publicPath = `/services/aip/${asset}`;

    assert.match(routeSource, new RegExp(escapeRegExp(publicPath)));
    assert.equal(sourceExists(`public${publicPath}`), true, `public${publicPath} should exist`);
  }
});
