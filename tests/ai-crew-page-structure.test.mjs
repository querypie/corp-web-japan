import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import {
  getAiCrewDataSource,
  getAiCrewStructureSource,
  isAiCrewContentExternalized,
  isAiCrewSectionExternalized,
} from "./helpers/static-marketing-page-sources.mjs";

test("AI Crew page remains readable whether static marketing content is externalized or route-local", () => {
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiCrewDataSource = getAiCrewDataSource();
  const aiCrewStructureSource = getAiCrewStructureSource();

  assert.match(aiCrewPage, /AICrewSections|HomePageSections/);
  assert.match(aiCrewDataSource, /homePageContent|floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
  assert.match(aiCrewDataSource, /roles:|partnerCta: \{ label: "自社サービスAI化の進め方を見る", href: "\/solutions\/ai-dashi" \}/);
  assert.match(aiCrewStructureSource, /FeatureShowcase/);
  assert.match(aiCrewStructureSource, /UseCaseShowcase/);

  if (!isAiCrewSectionExternalized()) {
    assert.doesNotMatch(aiCrewPage, /@\/components\/sections\/home-page-sections/);
  }
  if (!isAiCrewContentExternalized()) {
    assert.doesNotMatch(aiCrewPage, /@\/content\/home/);
  }
});
