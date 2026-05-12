import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

const sharedLoaderPath = "src/lib/publications/create-standard-publication-post-loader.ts";
const standardLoaderFiles = [
  "src/lib/publications/use-cases/get-post.ts",
  "src/lib/publications/demo/aip/get-post.ts",
  "src/lib/publications/demo/acp/get-post.ts",
  "src/lib/publications/events/get-post.ts",
  "src/lib/publications/news/get-post.ts",
  "src/lib/publications/blog/get-post.ts",
];

test("use-case, AIP demo, ACP demo, event, news, and blog post loaders share a common standard publication post loader helper", () => {
  assert.equal(sourceExists("src/lib/publications/create-standard-publication-post-loader.ts"), true);

  const sharedLoader = readSource(sharedLoaderPath);
  assert.match(sharedLoader, /export function createStandardPublicationPostLoader/);
  assert.match(sharedLoader, /buildRelatedPublicationItems/);
  assert.match(sharedLoader, /renderPublicationMdx/);
  assert.match(sharedLoader, /extractHeadingsFromMdx/);
  assert.match(sharedLoader, /buildPublicationAuthor/);

  for (const filePath of standardLoaderFiles) {
    const source = readSource(filePath);

    assert.match(source, /createStandardPublicationPostLoader/);
    assert.match(source, /from "@\/lib\/publications\/create-standard-publication-post-loader"/);
    assert.doesNotMatch(source, /function read[A-Za-z]+BodySource/);
    assert.doesNotMatch(source, /function buildRelatedItems/);
  }

  assert.doesNotMatch(sharedLoader, /fallbackToAllRecords/);
});
