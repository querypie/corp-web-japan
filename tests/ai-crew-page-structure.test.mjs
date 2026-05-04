import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import {
  getAiCrewDataSource,
  getAiCrewStructureSource,
  isAiCrewContentExternalized,
  isAiCrewSectionExternalized,
} from "./helpers/static-marketing-page-sources.mjs";

test("AI Crew about, lost, and why sections follow route-local authoring while the shared shell remains split around them", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const homePageSections = readSource("src/components/sections/home-page-sections.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const aiCrewStructureSource = getAiCrewStructureSource();

  assert.match(aiCrewPage, /HomePageIntroSections/);
  assert.match(aiCrewPage, /HomePageSections/);
  assert.match(aiCrewPage, /AICrewAboutSection/);
  assert.match(aiCrewPage, /AICrewAboutTitle/);
  assert.match(aiCrewPage, /AI Agentではなく、<strong>AI Crew<\/strong>/);
  assert.match(aiCrewPage, /「新しい同僚」/);
  assert.match(aiCrewPage, /AICrewAboutImage/);
  assert.match(aiCrewPage, /concept-team\.webp/);

  assert.match(aiCrewPage, /AICrewLostSection/);
  assert.match(aiCrewPage, /AICrewLostProblemCard/);
  assert.match(aiCrewPage, /AICrewLostProblemTitle/);
  assert.match(aiCrewPage, /AICrewLostProblemBody/);
  assert.match(aiCrewPage, /AICrewLostWhitepaperCard/);
  assert.match(aiCrewPage, /AICrewLostWhitepaperTitle/);
  assert.match(aiCrewPage, /AICrewLostWhitepaperAction href=\{aiCrewWhitepaperUrl\}/);

  assert.match(aiCrewPage, /AICrewWhySection/);
  assert.match(aiCrewPage, /AIに下準備を任せ、人は/);
  assert.ok(aiCrewPage.includes("<strong>判断と創造</strong>"));
  assert.match(aiCrewPage, /判断と創造/);
  assert.match(aiCrewPage, /<AICrewWhyBeforeCard>/);
  assert.match(aiCrewPage, /<AICrewWhyBeforeCardSubtitle>一次対応に時間がかかる<\/AICrewWhyBeforeCardSubtitle>/);
  assert.doesNotMatch(aiCrewPage, /<AICrewWhyBeforeCard subtitle=/);
  assert.match(aiCrewPage, /現場が止まるのは、判断の前にある業務が多すぎるから。/);
  assert.match(aiCrewPage, /情報が散らばり調査と確認に時間がかかる/);
  assert.match(aiCrewPage, /リスク検知/);

  assert.match(aiCrewPage, /AICrewContactSection/);
  assert.match(aiCrewPage, /どの業務から始めるべきか、/);
  assert.match(aiCrewPage, /href=\{aiCrewConsultUrl\}/);
  assert.match(aiCrewPage, /href=\{demoUseCasesUrl\}/);

  assert.match(aiCrewStructureSource, /export function HomePageIntroSections/);
  assert.match(aiCrewStructureSource, /export function AICrewAboutSection/);
  assert.match(aiCrewStructureSource, /export function AICrewLostSection/);
  assert.match(aiCrewStructureSource, /export function AICrewLostProblemCard/);
  assert.match(aiCrewStructureSource, /export function AICrewLostWhitepaperCard/);
  assert.match(aiCrewStructureSource, /export function AICrewAboutImage/);
  assert.match(aiCrewStructureSource, /export function AICrewWhySection/);
  assert.match(aiCrewStructureSource, /export function AICrewWhyAfterOrbitItem/);
  assert.match(aiCrewStructureSource, /featureIntro\.subtitle/);
  assert.doesNotMatch(homePageSections, /<section id="why"/);
  assert.doesNotMatch(aiCrewStructureSource, /FeatureShowcase/);
  assert.doesNotMatch(aiCrewStructureSource, /aboutSection\?: ReactNode/);
  assert.doesNotMatch(aiCrewStructureSource, /\{aboutSection\}/);

  assert.doesNotMatch(aiCrewPage, /RevealOnScroll variant="up"/);
  assert.doesNotMatch(aiCrewPage, /whitepaper-background\.svg/);
  assert.doesNotMatch(aiCrewPage, /rounded-\[1\.8rem\] border border-\[#d7e4fb\]/);

  if (isAiCrewContentExternalized()) {
    const aiCrewContent = readSource("src/content/home.ts");
    assert.match(aiCrewContent, /featureIntro:/);
    assert.match(aiCrewContent, /subtitle: "あなたの実務を担うAI、5つの設計要素"/);
    assert.doesNotMatch(aiCrewContent, /人手不足と見えないコストが、企業の成長を鈍化させる。/);
    assert.doesNotMatch(aiCrewContent, /なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか/);
    assert.doesNotMatch(aiCrewContent, /comparison:/);
    assert.doesNotMatch(aiCrewContent, /problem:/);
    assert.doesNotMatch(aiCrewContent, /AI Crewの考え方/);
    assert.doesNotMatch(aiCrewContent, /AI Agentではなく、AI Crew/);
    assert.doesNotMatch(aiCrewContent, /concept-team\.webp/);
    assert.doesNotMatch(aiCrewContent, /人とAI Crewが同じチームの一員として業務を分担するイメージ/);
  }

  if (isAiCrewSectionExternalized()) {
    assert.match(aiCrewPage, /@\/components\/sections\/home-page-sections/);
  }

  assert.match(aiCrewDataSource, /homePageContent|floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
});
