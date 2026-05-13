import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const primitiveSource = () => readSource("src/components/sections/home/primitives.tsx");

const directContractFiles = [
  "src/components/sections/certifications/section.tsx",
  "src/components/sections/plans/section.tsx",
  "src/components/sections/usage-based-llm/section.tsx",
];

test("shared marketing page section owns the default mobile container contract", () => {
  const source = primitiveSource();

  assert.match(source, /export function MarketingPageSection/);
  assert.match(source, /contentWidthClassName = "max-w-\[1200px\]"/);
  assert.match(source, /mx-auto w-full px-6 lg:px-0/);
  assert.match(source, /mx-auto w-full/);
});

test("simple static preview sections keep page-level mobile padding until migrated", () => {
  for (const filePath of directContractFiles) {
    const source = readSource(filePath);

    assert.match(
      source,
      /px-6[^"]*(?:lg|xl):px-0|(?:lg|xl):px-0[^"]*px-6/,
      `${filePath} should keep mobile px-6 with a desktop reset`,
    );
    assert.match(
      source,
      /max-w-\[1200px\]/,
      `${filePath} should keep the shared 1200px content width`,
    );
  }
});
