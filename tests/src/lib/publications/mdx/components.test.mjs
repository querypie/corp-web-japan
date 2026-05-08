import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("publication MDX component map supports legacy State badges used by whitepaper 10", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const whitepaper10 = readSource("src/content/whitepapers/10-querypie-devsecops-pipeline.mdx");

  assert.match(whitepaper10, /<State color="red">/);
  assert.match(mdxComponents, /type StateColor = "gray" \| "blue" \| "purple" \| "green" \| "yellow" \| "red";/);
  assert.match(mdxComponents, /function State\(\{ color = "blue", children \}: StateProps\)/);
  assert.match(mdxComponents, /const palette: Record<StateColor, string>/);
  assert.match(mdxComponents, /State,/);
});
