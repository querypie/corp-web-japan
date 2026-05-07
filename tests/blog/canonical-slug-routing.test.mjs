import assert from "node:assert/strict";
import test from "node:test";
import { readSource } from "../helpers/source-readers.mjs";

test("blog id-only route redirects to the canonical slug URL", () => {
  const source = readSource("src/app/blog/[id]/page.tsx");

  assert.match(source, /listBlogPublicationIds/);
  assert.match(source, /const \{ id \} = await params;/);
  assert.match(source, /const record = getBlogPublicationRecord\(id\);/);
  assert.match(source, /redirect\(getBlogPublicationHref\(id, record\.slug\)\);/);
});

test("blog slug route renders posts by id and only redirects when the slug mismatches", () => {
  const source = readSource("src/app/blog/[id]/[slug]/page.tsx");

  assert.match(source, /if \(record\.slug !== slug\) \{/);
  assert.match(source, /redirect\(getBlogPublicationHref\(id, record\.slug\)\);/);
  assert.match(source, /const post = await getBlogPublicationPost\(id\);/);
  assert.doesNotMatch(source, /getBlogPublicationPost\(id, slug\)/);
});

test("blog publication loader resolves posts by id without requiring a slug match", () => {
  const source = readSource("src/lib/publications/blog/get-post.ts");

  assert.match(source, /createStandardPublicationPostLoader/);
  assert.match(source, /from "@\/lib\/publications\/create-standard-publication-post-loader"/);
  assert.match(source, /getRecord: getBlogPublicationRecord/);
  assert.doesNotMatch(source, /function readBlogPostBodySource/);
  assert.doesNotMatch(source, /post\.slug !== slug/);
});
