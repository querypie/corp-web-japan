import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog publication records delegate MDX frontmatter caching to the shared records repository helper", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");
  const sharedHelper = readSource("src/lib/publications/create-standard-records-repository.ts");

  assert.match(source, /const blogPublicationRepository = createStandardPublicationRecordsRepository<BlogPostFrontmatter>/);
  assert.match(source, /export const blogPostRecords = blogPublicationRepository\.records/);
  assert.match(sharedHelper, /const records = Object\.freeze\(/);
  assert.match(sharedHelper, /const recordsById = new Map<string, TRecord>/);
});

test("blog publication detail loader caches MDX body source by file path", () => {
  const source = readSource("src/lib/publications/create-standard-publication-post-loader.ts");

  assert.match(source, /const\s+bodySourceCache\s*=\s*new Map/);
  assert.match(source, /bodySourceCache\.get\(sourcePath\)/);
  assert.match(source, /bodySourceCache\.set\(sourcePath,/);
});
