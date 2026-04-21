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
