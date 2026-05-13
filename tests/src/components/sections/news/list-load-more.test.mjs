import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("NewsArticleLoadMore reuses the shared load-more helper and keeps the news list renderer", () => {
  const source = readSource("src/components/sections/news/list-load-more.tsx");

  assert.match(source, /getResourceListLoadedRange/);
  assert.match(source, /getResourceListNextVisibleCount/);
  assert.match(source, /<NewsArticleList items=\{visibleItems\} \/>/);
  assert.match(source, /<ProgressiveLoadMore/);
  assert.match(source, /nextSearchParams\.set\("until", nextLoadedRange\.oldestId\)/);
});
