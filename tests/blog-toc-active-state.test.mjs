import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("blog TOC does not preselect the first section before scrolling into any heading", () => {
  const tocComponent = readSource("src/components/sections/resource-post-toc.tsx");

  assert.match(tocComponent, /let current: HTMLAnchorElement \| null = null;/);
  assert.doesNotMatch(tocComponent, /sections\[0\]\?\.link \?\? null/);
});
