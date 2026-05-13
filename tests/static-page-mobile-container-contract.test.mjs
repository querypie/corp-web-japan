import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const primitiveSource = () => readSource("src/components/sections/home/primitives.tsx");

const migratedContractFiles = [
  "src/components/sections/plans/section.tsx",
  "src/components/sections/usage-based-llm/section.tsx",
];

test("shared marketing page section owns the default mobile container contract", () => {
  const source = primitiveSource();

  assert.match(source, /export function MarketingPageSection/);
  assert.match(source, /as\?: T/);
  assert.match(source, /contentWidthClassName = "max-w-\[1200px\]"/);
  assert.match(source, /mx-auto w-full px-6 lg:px-0/);
  assert.match(source, /mx-auto w-full/);
});

test("simple static preview sections use the shared mobile container primitive", () => {
  for (const filePath of migratedContractFiles) {
    const source = readSource(filePath);

    assert.match(source, /MarketingPageSection/, `${filePath} should use the shared page section primitive`);
  }
});

test("usage-based LLM keeps feature rows as non-section content wrappers", () => {
  const source = readSource("src/components/sections/usage-based-llm/section.tsx");

  assert.match(source, /<MarketingPageSection[\s\S]*as="div"[\s\S]*contentClassName=\{cn\(/);
});
