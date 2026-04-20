import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("homepage content is split into dedicated content and section modules", () => {
  const page = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const content = readFileSync(new URL("../src/content/home.ts", import.meta.url), "utf8");
  const sections = readFileSync(new URL("../src/components/sections/home-page-sections.tsx", import.meta.url), "utf8");

  assert.match(page, /SiteHeader/);
  assert.match(page, /HomePageSections/);
  assert.match(content, /homePageContent/);
  assert.match(content, /roles:/);
  assert.match(sections, /FeatureShowcase/);
  assert.match(sections, /UseCaseShowcase/);
});

test("sample homepage is isolated under its own route and content module", () => {
  const page = readFileSync(new URL("../src/app/sample/page.tsx", import.meta.url), "utf8");
  const content = readFileSync(new URL("../src/content/sample-home.ts", import.meta.url), "utf8");
  const sections = readFileSync(new URL("../src/components/sections/sample-home-sections.tsx", import.meta.url), "utf8");

  assert.match(page, /SampleHomeSections/);
  assert.match(page, /sampleHomeContent/);
  assert.match(content, /信頼できるAIが、現場を動かす/);
  assert.match(content, /Security & Governance/);
  assert.match(content, /課題に応じて、最適なかたちでAI活用を前に進めます/);
  assert.match(content, /AI活用を支えるプロダクトと専門支援/);
  assert.match(sections, /QueryPie AI/);
  assert.match(sections, /adoption-flow/);
  assert.match(sections, /solutions\.cards/);
  assert.match(sections, /products\.cards/);
  assert.match(sections, /Case study placeholder/);
});
