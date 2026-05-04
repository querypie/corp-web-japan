import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import {
  getAiCrewDataSource,
  getAiCrewStructureSource,
  isAiCrewContentExternalized,
  isAiCrewSectionExternalized,
} from "./helpers/static-marketing-page-sources.mjs";

test("AI Crew route-local authoring keeps why, design-elements, and process copy in the route while shared UI stays extracted", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const aiCrewStructureSource = getAiCrewStructureSource();

  assert.match(aiCrewPage, /HomePageIntroSections/);
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

  assert.match(aiCrewPage, /AICrewDesignElementsSection/);
  assert.match(aiCrewPage, /AICrewDesignElementsTitle/);
  assert.match(aiCrewPage, /AICrewDesignElementCard/);
  assert.match(aiCrewPage, /AICrewDesignElementHeading>任せる業務と期待する成果を明確にする/);
  assert.match(aiCrewPage, /AICrewDesignElementHeading>必要なデータと前提知識をつなぐ/);
  assert.match(aiCrewPage, /AICrewDesignElementHeading>利用量ではなく、業務への貢献で見る/);

  assert.match(aiCrewPage, /AICrewProcessSection/);
  assert.match(aiCrewPage, /AICrewProcessTitle/);
  assert.match(aiCrewPage, /導入は5ステップ、任せやすい業務から/);
  assert.match(aiCrewPage, /STEP 01/);
  assert.match(aiCrewPage, /STEP 05/);
  assert.match(aiCrewPage, /進め方を相談する/);
  assert.match(aiCrewPage, /AICrewSectionsAfterDesignElements/);

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
  assert.match(aiCrewStructureSource, /export function AICrewDesignElementsSection/);
  assert.match(aiCrewStructureSource, /export function AICrewDesignElementCard/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessSection/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessStepCard/);
  assert.match(aiCrewStructureSource, /export function AICrewProcessSecondaryAction/);
  assert.match(aiCrewStructureSource, /export function AICrewSectionsAfterDesignElements/);
  assert.doesNotMatch(aiCrewStructureSource, /featureIntro\.subtitle/);
  assert.doesNotMatch(aiCrewStructureSource, /featureTabs/);
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

  if (isAiCrewContentExternalized()) {
    const aiCrewContent = readSource("src/content/home.ts");
    assert.doesNotMatch(aiCrewContent, /featureIntro/);
    assert.doesNotMatch(aiCrewContent, /featureTabs/);
    assert.doesNotMatch(aiCrewContent, /comparison:/);
    assert.doesNotMatch(aiCrewContent, /problem:/);
    assert.doesNotMatch(aiCrewContent, /process:/);
    assert.doesNotMatch(aiCrewContent, /人手不足と見えないコストが、企業の成長を鈍化させる。/);
    assert.doesNotMatch(aiCrewContent, /なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか/);
    assert.doesNotMatch(aiCrewContent, /AI Agentではなく、AI Crew/);
    assert.doesNotMatch(aiCrewContent, /concept-team\.webp/);
    assert.doesNotMatch(aiCrewContent, /人とAI Crewが同じチームの一員として業務を分担するイメージ/);
  }

  if (isAiCrewSectionExternalized()) {
    assert.match(aiCrewPage, /@\/components\/sections\/home-page-sections/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew-design-elements-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew-process-section/);
    assert.match(aiCrewPage, /@\/components\/sections\/ai-crew-why-section/);
  }

  assert.match(aiCrewDataSource, /homePageContent|floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
});
