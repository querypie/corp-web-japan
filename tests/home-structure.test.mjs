import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("public routes are split into dedicated content and section modules", () => {
  const topPage = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const topContent = readFileSync(new URL("../src/content/top-page.ts", import.meta.url), "utf8");
  const topSections = readFileSync(new URL("../src/components/sections/top-page-sections.tsx", import.meta.url), "utf8");

  const aiCrewPage = readFileSync(new URL("../src/app/solutions/ai-crew/page.tsx", import.meta.url), "utf8");
  const aiCrewContent = readFileSync(new URL("../src/content/home.ts", import.meta.url), "utf8");
  const aiCrewSections = readFileSync(new URL("../src/components/sections/home-page-sections.tsx", import.meta.url), "utf8");

  assert.match(topPage, /SiteHeader/);
  assert.match(topPage, /TopPageSections/);
  assert.match(topContent, /topPageContent/);
  assert.match(topContent, /solutionBranch/);
  assert.match(topSections, /RevealOnScroll/);

  assert.match(aiCrewPage, /HomePageSections/);
  assert.match(aiCrewContent, /homePageContent/);
  assert.match(aiCrewContent, /roles:/);
  assert.match(aiCrewSections, /FeatureShowcase/);
  assert.match(aiCrewSections, /UseCaseShowcase/);
});
