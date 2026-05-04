import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import { getAiDashiStructureSource } from "./helpers/static-marketing-page-sources.mjs";

test("AI Dashi release flow section follows route-local authoring", () => {
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aiDashiStructureSource = getAiDashiStructureSource();

  assert.match(aiDashiPage, /AIDashiReleaseFlowSection/);
  assert.match(aiDashiPage, /AIDashiReleaseFlowCard/);
  assert.match(aiDashiPage, /最速で市場へ/);
  assert.match(aiDashiPage, /ヒアリング・要件定義/);
  assert.match(aiDashiPage, /本番リリース・運用開始/);
  assert.match(aiDashiPage, /最短1〜3ヶ月/);
  assert.doesNotMatch(aiDashiPage, /const releaseFlow = \[/);

  assert.match(aiDashiStructureSource, /export function AIDashiReleaseFlowSection/);
  assert.match(aiDashiStructureSource, /export function AIDashiReleaseFlowGrid/);
  assert.match(aiDashiStructureSource, /export function AIDashiReleaseFlowCardBody/);
});
