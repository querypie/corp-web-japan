import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import {
  getTopPageDataSource,
  getTopPageStructureSource,
  isTopPageContentExternalized,
  isTopPageSectionExternalized,
} from "./helpers/static-marketing-page-sources.mjs";

test("top page remains readable whether static marketing content is externalized or route-local", () => {
  const topPage = readSource("src/app/page.tsx");
  const topPageDataSource = getTopPageDataSource();
  const topPageStructureSource = getTopPageStructureSource();

  assert.match(topPage, /SiteHeader/);
  assert.match(topPage, /RoadmapSection|TopPageRoadmapSection|TopPageSections/);
  assert.match(`${topPageDataSource}\n${topPage}`, /topPageContent|primaryCta: \{ label: "お問い合わせ", href: topPageHeroContactUrl \}|<HeroPrimaryAction href=\{topPageHeroContactUrl\}>お問い合わせ<\/HeroPrimaryAction>/);
  assert.match(`${topPageDataSource}\n${topPage}`, /solutionBranch|\{ label: "導入について相談する", href: topPageFinalConsultUrl \}|<FinalCtaAction href=\{topPageFinalConsultUrl\}>導入について相談する<\/FinalCtaAction>/);
  assert.match(topPageStructureSource, /RevealOnScroll/);
  assert.doesNotMatch(topPageStructureSource, /node\.type === RoadmapTab|node\.type === RoadmapStep/);

  if (!isTopPageSectionExternalized()) {
    assert.doesNotMatch(topPage, /@\/components\/sections\/top-page-sections/);
  }
  if (!isTopPageContentExternalized()) {
    assert.doesNotMatch(topPage, /@\/content\/top-page/);
  }
});