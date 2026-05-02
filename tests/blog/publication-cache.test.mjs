import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog publication records use an explicit module-level cache for MDX frontmatter", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");

  assert.match(source, /let\s+blogPublicationCache\s*:/);
  assert.match(source, /if\s*\(blogPublicationCache\)/);
  assert.match(source, /blogPublicationCache\s*=\s*Object\.freeze\(/);
});

test("blog publication detail loader caches MDX body source by file path", () => {
  const source = readSource("src/lib/publications/get-publication-post.ts");

  assert.match(source, /const\s+blogPostBodySourceCache\s*=\s*new Map/);
  assert.match(source, /blogPostBodySourceCache\.get\(post\.sourcePath\)/);
  assert.match(source, /blogPostBodySourceCache\.set\(post\.sourcePath,/);
});
