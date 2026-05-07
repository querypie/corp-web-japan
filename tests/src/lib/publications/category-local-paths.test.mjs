import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const newCategoryLocalPaths = [
  "src/lib/publications/blog/records.ts",
  "src/lib/publications/blog/get-post.ts",
  "src/lib/publications/blog/items.ts",
  "src/lib/publications/news/records.ts",
  "src/lib/publications/news/get-post.ts",
  "src/lib/publications/whitepapers/records.ts",
  "src/lib/publications/whitepapers/get-post.ts",
  "src/lib/publications/events/records.ts",
  "src/lib/publications/events/get-post.ts",
  "src/lib/publications/use-cases/records.ts",
  "src/lib/publications/use-cases/get-post.ts",
  "src/lib/publications/demo/aip/records.ts",
  "src/lib/publications/demo/aip/get-post.ts",
  "src/lib/publications/demo/acp/records.ts",
  "src/lib/publications/demo/acp/get-post.ts",
];

const oldFlatPaths = [
  "src/lib/publications/blog-publication-records.ts",
  "src/lib/publications/get-publication-post.ts",
  "src/lib/publications/blog-items.ts",
  "src/lib/publications/news-publication-records.ts",
  "src/lib/publications/get-news-publication-post.ts",
  "src/lib/publications/whitepaper-publication-records.ts",
  "src/lib/publications/get-whitepaper-publication-post.ts",
  "src/lib/publications/event-publication-records.ts",
  "src/lib/publications/get-event-publication-post.ts",
  "src/lib/publications/use-case-publication-records.ts",
  "src/lib/publications/get-use-case-publication-post.ts",
  "src/lib/publications/aip-demo-publication-records.ts",
  "src/lib/publications/get-aip-demo-publication-post.ts",
  "src/lib/publications/acp-demo-publication-records.ts",
  "src/lib/publications/get-acp-demo-publication-post.ts",
];

test("publication category-specific records and post loaders live under category-local directories", () => {
  for (const relativePath of newCategoryLocalPaths) {
    assert.equal(existsSync(new URL(`../../../../${relativePath}`, import.meta.url)), true, `${relativePath} should exist`);
  }

  for (const relativePath of oldFlatPaths) {
    assert.equal(existsSync(new URL(`../../../../${relativePath}`, import.meta.url)), false, `${relativePath} should be removed`);
  }
});
