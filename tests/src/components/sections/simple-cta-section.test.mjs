import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("the AIP trial CTA identifies QueryPie AIP as the product being offered", () => {
  const source = readSource("src/components/sections/simple-cta-section.tsx");

  assert.match(source, /14日間無料でQueryPie AIPをお試しいただけます。/);
  assert.doesNotMatch(source, /14日間無料でQueryPie AIをお試しいただけます。/);
});
