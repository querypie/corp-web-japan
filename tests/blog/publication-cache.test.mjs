import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog publication records delegate MDX frontmatter caching to the shared records repository helper", () => {
  const source = readSource("src/lib/publications/blog/records.ts");
  const sharedHelper = readSource("src/lib/publications/create-standard-records-repository.ts");

  assert.match(source, /const blogPublicationRepository = createStandardPublicationRecordsRepository<BlogPostFrontmatter>/);
  assert.match(source, /export const blogPostRecords = blogPublicationRepository\.records/);
  assert.match(sharedHelper, /const records = Object\.freeze\(/);
  assert.match(sharedHelper, /const recordsById = new Map<string, TRecord>/);
});

test("blog publication detail loader delegates body-source caching to the shared publication post loader", () => {
  const source = readSource("src/lib/publications/blog/get-post.ts");
  const sharedLoader = readSource("src/lib/publications/create-standard-publication-post-loader.ts");

  assert.match(source, /createStandardPublicationPostLoader/);
  assert.match(sharedLoader, /const bodySourceCache = new Map<string, string>\(\)/);
  assert.match(sharedLoader, /bodySourceCache\.get\(sourcePath\)/);
  assert.match(sharedLoader, /bodySourceCache\.set\(sourcePath, source\)/);
});
