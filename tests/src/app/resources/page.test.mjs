import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("/resources opts into the shared load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/resources/page.tsx");

  assert.match(source, /resolveResourceListVisibleCount\(items, resolvedSearchParams\?\.until\)/);
  assert.match(source, /<ResourceListLoadMore[\s\S]*items=\{items\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.match(source, /key={`resources:\$\{initialVisibleCount\}`}/);
  assert.doesNotMatch(source, /<ResourceListItems items=\{items\} \/>/);
});
