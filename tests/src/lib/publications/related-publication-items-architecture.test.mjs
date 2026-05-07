import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

const sharedHelperPath = "src/lib/publications/build-related-publication-items.ts";
const sharedLoaderFiles = [
  "src/lib/publications/create-standard-publication-post-loader.ts",
  "src/lib/publications/get-publication-post.ts",
  "src/lib/publications/get-whitepaper-publication-post.ts",
];

const thinWrapperFiles = [
  "src/lib/publications/get-news-publication-post.ts",
];

test("all publication post loaders share one common related-items helper with explicit-related passthrough and same-category recent fallback", () => {
  assert.equal(
    existsSync(new URL("../../../../src/lib/publications/build-related-publication-items.ts", import.meta.url)),
    true,
  );

  const helper = readSource(sharedHelperPath);
  assert.match(helper, /export function buildRelatedPublicationItems/);
  assert.match(helper, /if \(relatedIds.length > 0\)/);
  assert.match(helper, /return relatedIds/);
  assert.match(helper, /filter\(\(relatedId\) => relatedId !== id\)/);
  assert.match(helper, /return records/);
  assert.match(helper, /filter\(\(record\) => record.id !== id\)/);
  assert.match(helper, /slice\(0, 3\)/);
  assert.doesNotMatch(helper, /hidden/);

  for (const filePath of sharedLoaderFiles) {
    const source = readSource(filePath);
    assert.match(source, /buildRelatedPublicationItems/);
    assert.match(source, /from "@\/lib\/publications\/build-related-publication-items"/);
    assert.doesNotMatch(source, /function buildRelatedItems/);
  }

  for (const filePath of thinWrapperFiles) {
    const source = readSource(filePath);
    assert.doesNotMatch(source, /function buildRelatedItems/);
  }

  const blogLoader = readSource("src/lib/publications/get-publication-post.ts");
  assert.doesNotMatch(blogLoader, /buildRelatedPublications/);

  const standardLoader = readSource("src/lib/publications/create-standard-publication-post-loader.ts");
  assert.doesNotMatch(standardLoader, /fallbackToAllRecords/);
  assert.doesNotMatch(standardLoader, /slice\(0, 3\)\.map/);
});
