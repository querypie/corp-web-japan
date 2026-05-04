import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import {
  getAiCrewDataSource,
  getAiCrewStructureSource,
  isAiCrewContentExternalized,
  isAiCrewSectionExternalized,
} from "./helpers/static-marketing-page-sources.mjs";

test("AI Crew contact section follows route-local authoring while the shared shell remains", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const aiCrewStructureSource = getAiCrewStructureSource();

  assert.match(aiCrewPage, /HomePageSections/);
  assert.match(aiCrewPage, /AICrewContactSection/);
  assert.match(aiCrewPage, /AICrewDashiPromo/);
  assert.match(aiCrewPage, /どの業務から始めるべきか、/);
  assert.match(aiCrewPage, /まずは一緒に整理しませんか？/);
  assert.match(aiCrewPage, /貴社のサービスを、最短でAI化しませんか？/);
  assert.match(aiCrewPage, /href=\{aiCrewConsultUrl\}/);
  assert.match(aiCrewPage, /href=\{demoUseCasesUrl\}/);

  assert.match(aiCrewDataSource, /homePageContent|floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
  assert.match(aiCrewDataSource, /roles:|const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"|export const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"/);

  assert.match(aiCrewStructureSource, /export function AICrewContactSection/);
  assert.match(aiCrewStructureSource, /export function AICrewDashiPromo/);
  assert.match(aiCrewStructureSource, /FeatureShowcase/);
  assert.match(aiCrewStructureSource, /UseCaseShowcase/);

  if (isAiCrewContentExternalized()) {
    const aiCrewContent = readSource("src/content/home.ts");
    assert.doesNotMatch(aiCrewContent, /contact:/);
    assert.doesNotMatch(aiCrewContent, /partnerTitle:/);
  }

  if (!isAiCrewSectionExternalized()) {
    assert.doesNotMatch(aiCrewPage, /@\/components\/sections\/home-page-sections/);
  }
});
