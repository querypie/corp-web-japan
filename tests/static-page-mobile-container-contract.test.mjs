import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const primitiveSource = () => readSource("src/components/sections/home/primitives.tsx");

const companySectionContractFiles = [
  "src/app/plans/aip/page.tsx",
  "src/app/plans/acp/page.tsx",
];

test("shared marketing page section owns the default mobile container contract", () => {
  const source = primitiveSource();

  assert.match(source, /export function MarketingPageSection/);
  assert.match(source, /as\?: T/);
  assert.match(source, /contentWidthClassName = "max-w-\[1200px\]"/);
  assert.match(source, /mx-auto w-full px-6 lg:px-0/);
  assert.match(source, /mx-auto w-full/);
});

test("plans public routes use the company page hero and container contract", () => {
  for (const filePath of companySectionContractFiles) {
    const source = readSource(filePath);

    assert.match(source, /CompanyPageSection/, `${filePath} should use the company page section primitive`);
    assert.match(source, /CompanyPageTitle/, `${filePath} should use the company page title primitive`);
    assert.match(source, /CompanyPageLead/, `${filePath} should use the company page lead primitive`);
    assert.doesNotMatch(source, /PlansPageSection/);
    assert.doesNotMatch(source, /PlansHeroTitle/);
    assert.doesNotMatch(source, /PlansHeroDescription/);
  }
});

test("usage-based LLM keeps feature rows as non-section content wrappers", () => {
  const source = readSource("src/components/sections/usage-based-llm/section.tsx");

  assert.match(source, /<PlatformContentSection[\s\S]*as="div"[\s\S]*contentClassName=\{cn\(/);
  assert.doesNotMatch(source, /MarketingPageSection/);
});
