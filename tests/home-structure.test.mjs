import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readFirstExistingSource, sourceExists } from "./helpers/source-readers.mjs";

test("static page sources remain readable whether content lives in route files or dedicated content/section modules", () => {
  const topPage = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const aiCrewPage = readFileSync(new URL("../src/app/solutions/ai-crew/page.tsx", import.meta.url), "utf8");

  const topSupportingSource = readFirstExistingSource([
    "src/content/top-page.ts",
    "src/app/page.tsx",
  ]);
  const aiCrewSupportingSource = readFirstExistingSource([
    "src/content/home.ts",
    "src/app/solutions/ai-crew/page.tsx",
  ]);
  const topStructureSource = readFirstExistingSource([
    "src/components/sections/top-page-sections.tsx",
    "src/app/page.tsx",
  ]);
  const aiCrewStructureSource = readFirstExistingSource([
    "src/components/sections/home-page-sections.tsx",
    "src/app/solutions/ai-crew/page.tsx",
  ]);

  assert.match(topPage, /SiteHeader/);
  assert.match(topPage, /TopPageRoadmapSection|TopPageSections/);
  assert.match(topSupportingSource, /topPageContent|primaryCta: \{ label: "お問い合わせ", href: topPageHeroContactUrl \}/);
  assert.match(topSupportingSource, /solutionBranch|\{ label: "導入について相談する", href: topPageFinalConsultUrl \}/);
  assert.match(topStructureSource, /RevealOnScroll/);

  assert.match(aiCrewPage, /AICrewSections|HomePageSections/);
  assert.match(aiCrewSupportingSource, /homePageContent|floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);
  assert.match(aiCrewSupportingSource, /roles:|partnerCta: \{ label: "自社サービスAI化の進め方を見る", href: "\/solutions\/ai-dashi" \}/);
  assert.match(aiCrewStructureSource, /FeatureShowcase/);
  assert.match(aiCrewStructureSource, /UseCaseShowcase/);

  if (!sourceExists("src/components/sections/top-page-sections.tsx")) {
    assert.doesNotMatch(topPage, /@\/components\/sections\/top-page-sections/);
  }
  if (!sourceExists("src/content/top-page.ts")) {
    assert.doesNotMatch(topPage, /@\/content\/top-page/);
  }
  if (!sourceExists("src/components/sections/home-page-sections.tsx")) {
    assert.doesNotMatch(aiCrewPage, /@\/components\/sections\/home-page-sections/);
  }
  if (!sourceExists("src/content/home.ts")) {
    assert.doesNotMatch(aiCrewPage, /@\/content\/home/);
  }
});
