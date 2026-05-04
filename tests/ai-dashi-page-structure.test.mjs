import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import { getAiDashiStructureSource } from "./helpers/static-marketing-page-sources.mjs";

test("AI Dashi release flow section follows route-local authoring", () => {
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiStructureSource = getAiDashiStructureSource();

  assert.match(aiDashiPage, /AIDashiReleaseFlowSection/);
  assert.match(aiDashiPage, /AIDashiReleaseFlowCard/);
  assert.match(aiDashiPage, /市場機会を逃さない、\s*<strong>圧倒的な導入スピード<\/strong>/);
  assert.doesNotMatch(aiDashiPage, /市場機会を逃さない、[\s\S]*?<span className="bg-gradient-to-r from\[#E45A2A\] via\[#ED602E\] to\[#F08A3C\] bg-clip-text text-transparent">[\s\S]*?圧倒的な導入スピード[\s\S]*?<\/span>/);
  assert.match(aiDashiPage, /最速で市場へ/);
  assert.match(aiDashiPage, /ヒアリング・要件定義/);
  assert.match(aiDashiPage, /本番リリース・運用開始/);
  assert.match(aiDashiPage, /最短1〜3ヶ月/);
  assert.doesNotMatch(aiDashiPage, /const releaseFlow = \[/);

  assert.match(aiDashiStructureSource, /export function AIDashiReleaseFlowSection/);
  assert.match(aiDashiStructureSource, /export function AIDashiReleaseFlowGrid/);
  assert.match(aiDashiStructureSource, /export function AIDashiReleaseFlowCardBody/);
});

test("AI Dashi risk section follows route-local authoring", () => {
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiStructureSource = getAiDashiStructureSource();

  assert.match(aiDashiPage, /AIDashiRiskSection/);
  assert.match(aiDashiPage, /AIDashiRiskLead/);
  assert.match(aiDashiPage, /AIDashiRiskTitle/);
  assert.match(aiDashiPage, /AIDashiRiskBody/);
  assert.match(aiDashiPage, /明日、AIを搭載した競合が現れたら。/);
  assert.match(aiDashiPage, /貴社のサービスは選ばれ続けますか？/);
  assert.match(aiDashiPage, /<strong>致命的な解約（チャーン）<\/strong>/);
  assert.doesNotMatch(aiDashiPage, /const lostSection = \{/);

  assert.match(aiDashiStructureSource, /export function AIDashiRiskSection/);
  assert.match(aiDashiStructureSource, /export function AIDashiRiskTitle/);
  assert.match(aiDashiStructureSource, /export function AIDashiRiskBody/);
});

test("AI Dashi support section follows route-local authoring", () => {
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiStructureSource = getAiDashiStructureSource();

  assert.match(aiDashiPage, /AIDashiSupportSection/);
  assert.match(aiDashiPage, /AIDashiSupportIntro/);
  assert.match(aiDashiPage, /AIDashiSupportCards/);
  assert.match(aiDashiPage, /AIDashiSupportCardPointList/);
  assert.match(aiDashiPage, /QueryPie AIの包括的サポート体制/);
  assert.match(aiDashiPage, /カスタマイズ自在なAI基盤の提供/);
  assert.match(aiDashiPage, /専門エンジニアによる開発支援/);
  assert.match(aiDashiPage, /24時間365日のインフラ・運用保守/);
  assert.doesNotMatch(aiDashiPage, /const supportItems = \[/);

  assert.match(aiDashiStructureSource, /export function AIDashiSupportSection/);
  assert.match(aiDashiStructureSource, /export function AIDashiSupportCards/);
  assert.match(aiDashiStructureSource, /export function AIDashiSupportCardPoint/);
});

test("AI Dashi enterprise-ready section follows route-local authoring", () => {
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiStructureSource = getAiDashiStructureSource();

  assert.match(aiDashiPage, /AIDashiEnterpriseReadySection/);
  assert.match(aiDashiPage, /AIDashiEnterpriseReadyIntro/);
  assert.match(aiDashiPage, /AIDashiEnterpriseReadyCard/);
  assert.match(aiDashiPage, /LLMを繋ぐだけでは、\s*<br\s*\/?>\s*エンタープライズ顧客には売れない/);
  assert.match(aiDashiPage, /B2B基準の権限管理（RBAC）/);
  assert.match(aiDashiPage, /ハルシネーションを防ぐガードレール/);
  assert.match(aiDashiPage, /監査ログとコンプライアンス対応/);
  assert.doesNotMatch(aiDashiPage, /const enterpriseReadyItems = \[/);

  assert.match(aiDashiStructureSource, /export function AIDashiEnterpriseReadySection/);
  assert.match(aiDashiStructureSource, /export function AIDashiEnterpriseReadyCards/);
  assert.match(aiDashiStructureSource, /export function AIDashiEnterpriseReadyCardBody/);
});
