import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import {
  getAiCrewDataSource,
  getAiCrewStructureSource,
  isAiCrewSectionExternalized,
} from "./helpers/static-marketing-page-sources.mjs";

test("AI Crew route-local authoring keeps hero, platform, why, design-elements, process, use-cases, and results copy in the route while shared UI stays extracted", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiCrewWhySection = readSource("src/components/sections/ai-crew/why-section.tsx");
  const aiCrewUseCasesSection = readSource("src/components/sections/ai-crew/use-cases-section.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const aiCrewStructureSource = getAiCrewStructureSource();

  assert.match(aiCrewPage, /AICrewHeroSection/);
  assert.match(aiCrewPage, /AICrewHeroTitleLine>作業を減らし、/);
  assert.match(aiCrewPage, /AICrewHeroTitleLine accent delayMs=\{120\}>成果を増やす。/);
  assert.match(aiCrewPage, /利益を生み出す実務特化型AIエージェント/);
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
  assert.match(aiCrewPage, /現場が止まるのは、判断の前にある業務が多すぎるから。/);
  assert.match(aiCrewPage, /AICrewWhyBeforeCardSubtitle>一次対応に時間がかかる/);
  assert.match(aiCrewPage, /AICrewWhyAfterCardSubtitle>役割分担が整理され、本来の業務に集中/);
  assert.match(aiCrewPage, /AICrewWhyHumanDecisionCore>人による最終判断<\/AICrewWhyHumanDecisionCore>/);

  assert.match(aiCrewPage, /AICrewDesignElementsSection/);
  assert.match(aiCrewPage, /AICrewDesignElementsTitle/);
  assert.match(aiCrewPage, /AICrewDesignElementCard/);
  assert.match(aiCrewPage, /AICrewDesignElementHeading>任せる業務と期待する成果を明確にする/);
  assert.match(aiCrewPage, /AICrewDesignElementHeading>必要なデータと前提知識をつなぐ/);
  assert.match(aiCrewPage, /AICrewDesignElementHeading>利用量ではなく、業務への貢献で見る/);

  assert.match(aiCrewPage, /AICrewProcessSection/);
  assert.match(aiCrewPage, /AICrewProcessTitle/);
  assert.match(aiCrewPage, /導入は5ステップ、任せやすい業務から/);
  assert.match(aiCrewPage, /<strong>小さく始める<\/strong>/);
  assert.match(aiCrewPage, /STEP 01/);
  assert.match(aiCrewPage, /STEP 05/);
  assert.match(aiCrewPage, /進め方を相談する/);

  assert.match(aiCrewPage, /AICrewPlatformSection/);
  assert.match(aiCrewPage, /AICrewPlatformTitle/);
  assert.match(aiCrewPage, /実務での安全なAI活用を支える/);
  assert.match(aiCrewPage, /エンタープライズAI基盤 <AICrewPlatformAccent>QueryPie AIP<\/AICrewPlatformAccent>/);
  assert.match(aiCrewPage, /AICrewPlatformCardHeader/);
  assert.match(aiCrewPage, /AICrewPlatformCardIcon icon="brain"/);
  assert.match(aiCrewPage, /AICrewPlatformCardText/);
  assert.match(aiCrewPage, /AICrewPlatformCardTitle subtitle="Brain">頭脳/);
  assert.match(aiCrewPage, /AICrewPlatformCardTitle subtitle="Governance">統制/);

  assert.match(aiCrewPage, /AICrewUseCasesSection/);
  assert.match(aiCrewPage, /AICrewUseCasesTitle>まずは、貴社で最も負荷の高い業務から/);
  assert.match(aiCrewPage, /AICrewUseCaseCardTitle slot="card-title">SEO分析/);
  assert.match(aiCrewPage, /AICrewUseCaseCardTitle slot="card-title">開発インサイト/);
  assert.match(aiCrewPage, /AICrewUseCaseCardTitle slot="card-title">データ分析/);
  assert.match(aiCrewPage, /videoAriaLabel="SEO分析の動画を見る"/);
  assert.match(aiCrewPage, /videoAriaLabel="見積分析の動画を見る"/);
  assert.match(aiCrewPage, /videoAriaLabel="見積書作成の動画を見る"/);
  assert.match(aiCrewPage, /ctaLabel="詳しく見る"/);
  assert.match(aiCrewPage, /AICrewUseCaseTabbedCard icon="wallet"/);
  assert.match(aiCrewPage, /見積関連文書の確認から、複雑な見積ロジックに基づく出力までを支援。属人化しやすい見積業務を効率化します。/);
  assert.match(aiCrewPage, /label="見積分析"/);
  assert.match(aiCrewPage, /label="見積書作成"/);

  assert.match(aiCrewPage, /AICrewResultsSection/);
  assert.match(aiCrewPage, /現場は仕事が進む<AICrewResultsHighlight>スピード<\/AICrewResultsHighlight>を、経営は/);
  assert.match(aiCrewPage, /<AICrewResultsHighlight>投資対効果<\/AICrewResultsHighlight>を実感/);
  assert.match(aiCrewPage, /AICrewResultsCardName>マーケティング担当者/);
  assert.match(aiCrewPage, /AICrewResultsPricingCardTitle>必要な分だけ使えるコスト設計/);
  assert.match(aiCrewPage, /AICrewResultsPricingCardTitle>部署をまたいでも管理しやすい/);

  assert.match(aiCrewPage, /AICrewContactSection/);
  assert.match(aiCrewPage, /どの業務から始めるべきか、/);
  assert.match(aiCrewPage, /href=\{aiCrewConsultUrl\}/);
  assert.match(aiCrewPage, /href=\{demoUseCasesUrl\}/);

  assert.match(aiCrewStructureSource, /export function AICrewHeroSection/);
  assert.match(aiCrewStructureSource, /export function AICrewHeroTitleLine/);
  assert.match(aiCrewStructureSource, /export function AICrewAboutSection/);
  assert.match(aiCrewStructureSource, /export function AICrewLostSection/);
  assert.match(aiCrewStructureSource, /export function AICrewLostProblemCard/);
  assert.match(aiCrewStructureSource, /export function AICrewLostWhitepaperCard/);
  assert.match(aiCrewStructureSource, /export function AICrewAboutImage/);
  assert.match(aiCrewStructureSource, /export function AICrewPlatformSection/);
  assert.match(aiCrewStructureSource, /export function AICrewPlatformCard/);
  assert.match(aiCrewStructureSource, /export function AICrewPlatformCardHeader/);
  assert.match(aiCrewStructureSource, /export function AICrewPlatformCardIcon/);
  assert.match(aiCrewStructureSource, /export function AICrewPlatformCardText/);
  assert.match(aiCrewStructureSource, /export function AICrewPlatformCardBullet/);
  assert.match(aiCrewStructureSource, /export function AICrewWhySection/);
  assert.match(aiCrewStructureSource, /export function AICrewWhyAfterOrbitItem/);
  assert.match(aiCrewStructureSource, /export function AICrewDesignElementsSection/);
  assert.match(aiCrewStructureSource, /export function AICrewDesignElementCard/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessSection/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessTitle/);
  assert.match(aiCrewStructureSource, /\[&_strong\]:bg-\[linear-gradient\(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%\)\]/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessStepCard/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessSecondaryAction/);
  assert.match(aiCrewStructureSource, /export function AICrewUseCasesSection/);
  assert.match(aiCrewStructureSource, /export function AICrewUseCaseCard/);
  assert.match(aiCrewStructureSource, /export function AICrewUseCaseTabbedCard/);
  assert.match(aiCrewStructureSource, /type AICrewUseCaseCardSlot = "card-category" \| "card-title" \| "card-body";/);
  assert.match(aiCrewStructureSource, /ctaLabel: ReactNode/);
  assert.match(aiCrewStructureSource, /videoAriaLabel: string/);
  assert.doesNotMatch(aiCrewStructureSource, /child\.type === AICrewUseCaseCardCategory/);
  assert.doesNotMatch(aiCrewStructureSource, /child\.type === AICrewUseCaseCardTitle/);
  assert.doesNotMatch(aiCrewStructureSource, /child\.type === AICrewUseCaseCardBody/);
  assert.doesNotMatch(aiCrewStructureSource, /child\.type === AICrewUseCaseTab/);
  assert.doesNotMatch(aiCrewUseCasesSection, /詳しく見る/);
  assert.doesNotMatch(aiCrewUseCasesSection, /活用事例/);
  assert.doesNotMatch(aiCrewUseCasesSection, /の動画を見る/);
  assert.match(aiCrewStructureSource, /export function AICrewResultsSection/);
  assert.match(aiCrewStructureSource, /export function AICrewResultsCard/);
  assert.doesNotMatch(aiCrewStructureSource, /featureIntro\.subtitle/);
  assert.doesNotMatch(aiCrewStructureSource, /featureTabs/);
  assert.doesNotMatch(aiCrewStructureSource, /roi\.title/);
  assert.doesNotMatch(aiCrewStructureSource, /roi\.cards/);
  assert.doesNotMatch(aiCrewStructureSource, /comparison:/);
  assert.doesNotMatch(aiCrewStructureSource, /problem:/);
  assert.doesNotMatch(aiCrewStructureSource, /process\.title/);
  assert.doesNotMatch(aiCrewStructureSource, /process\.body/);
  assert.doesNotMatch(aiCrewStructureSource, /process\.steps/);
  assert.doesNotMatch(aiCrewStructureSource, /process\.primaryCta/);
  assert.doesNotMatch(aiCrewStructureSource, /process\.secondaryCta/);
  assert.doesNotMatch(aiCrewStructureSource, /FeatureShowcase/);
  assert.doesNotMatch(aiCrewStructureSource, /aboutSection\?: ReactNode/);
  assert.doesNotMatch(aiCrewStructureSource, /\{aboutSection\}/);

  assert.doesNotMatch(aiCrewPage, /HomePageSections/);
  assert.doesNotMatch(aiCrewPage, /AICrewSectionsBeforeDesignElements/);
  assert.doesNotMatch(aiCrewPage, /HomePagePreProcessSections/);
  assert.doesNotMatch(aiCrewPage, /RevealOnScroll variant="up"/);
  assert.doesNotMatch(aiCrewPage, /whitepaper-background\.svg/);
  assert.doesNotMatch(aiCrewPage, /rounded-\[1\.8rem\] border border-\[#d7e4fb\]/);

  if (isAiCrewSectionExternalized()) {
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/hero-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/design-elements-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/platform-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/process-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/results-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/use-cases-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew\/why-section/);
  }

  assert.doesNotMatch(aiCrewWhySection, /人による最終判断/);

  assert.match(aiCrewDataSource, /const aiCrewFloatingCtaUrl = "\/contact-us\?product=ai-crew"/);
});
