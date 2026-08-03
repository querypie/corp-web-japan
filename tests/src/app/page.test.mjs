import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../helpers/source-readers.mjs";
import {
  getTopPageDataSource,
  getTopPageStructureSource,
  isTopPageContentExternalized,
  isTopPageSectionExternalized,
} from "../../helpers/static-marketing-page-sources.mjs";

test("top page remains readable whether static marketing content is externalized or route-local", () => {
  const topPage = readSource("src/app/page.tsx");
  const topPageDataSource = getTopPageDataSource();
  const topPageStructureSource = getTopPageStructureSource();

  assert.match(topPage, /SiteHeader/);
  assert.match(topPage, /RoadmapSection|TopPageRoadmapSection|TopPageSections/);
  assert.match(`${topPageDataSource}\n${topPage}`, /topPageContent|primaryCta: \{ label: "導入相談・デモを依頼", href: topPageFinalDemoUrl \}|<HeroPrimaryAction href=\{topPageFinalDemoUrl\}>導入相談・デモを依頼<\/HeroPrimaryAction>/);
  assert.match(`${topPageDataSource}\n${topPage}`, /solutionBranch|<FinalCtaAction href=\{topPageFinalDemoUrl\} primary>導入相談・デモを依頼<\/FinalCtaAction>/);
  assert.match(topPage, /const topPageDownloadUrl =\n\s+"\/introduction-deck\/1\/querypie-aip";/);
  assert.match(topPage, /<WhitepaperAction href="\/whitepapers\/24\/ai-transformation-japan\/pdf">無料ダウンロード<\/WhitepaperAction>/);
  assert.match(topPage, /<WhitepaperAction href="\/whitepapers\/30\/saas-end-or-evolution\/pdf">無料ダウンロード<\/WhitepaperAction>/);
  assert.doesNotMatch(topPage, /https:\/\/www\.querypie\.com\/ja\/features\/documentation/);
  assert.match(topPageStructureSource, /RevealOnScroll/);
  assert.doesNotMatch(topPageStructureSource, /B-BAQRoMUnU/);
  assert.doesNotMatch(topPageStructureSource, /PlatformRequirementsVideo/);
  assert.doesNotMatch(topPageStructureSource, /node\.type === RoadmapTab|node\.type === RoadmapStep/);

  if (!isTopPageSectionExternalized()) {
    assert.doesNotMatch(topPage, /@\/components\/sections\/top-page-sections/);
  }
  if (!isTopPageContentExternalized()) {
    assert.doesNotMatch(topPage, /@\/content\/top-page/);
  }
});
