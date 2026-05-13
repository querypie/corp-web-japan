import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("/news opts into a news-specific load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/news/page.tsx");

  assert.match(source, /NewsArticleLoadMore/);
  assert.match(source, /resolveResourceListVisibleCount\(newsItems, resolvedSearchParams\?\.until\)/);
  assert.match(source, /<NewsArticleLoadMore[\s\S]*items=\{newsItems\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.match(source, /key={`news:\$\{initialVisibleCount\}`}/);
  assert.doesNotMatch(source, /<NewsArticleList items=\{newsItems\} \/>/);
});
