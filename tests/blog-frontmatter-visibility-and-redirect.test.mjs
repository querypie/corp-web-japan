import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("blog publication frontmatter supports hidden list items and external detail redirects", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");

  assert.match(source, /hidden\?: boolean;/);
  assert.match(source, /redirectUrl\?: string;/);
  assert.match(source, /hidden:\s*frontmatter\.hidden\s*===\s*true/);
  assert.match(source, /redirectUrl:\s*typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
});

test("blog publication list excludes only frontmatter-hidden records while preserving full record lookup", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");

  assert.match(source, /records\.filter\(\(record\) => !record\.hidden\)/);
  assert.match(source, /const recordsById = new Map<string, BlogPostRecord>\(records\.map\(\(post\) => \[post\.id, post\]\)\);/);
  assert.match(source, /listBlogPublicationParams\(\) \{\s*return getBlogPublicationCache\(\)\.records\.map\(\(\{ id, slug \}\) => \(\{ id, slug \}\)\);\s*\}/s);
});

test("blog detail routes redirect to a frontmatter redirectUrl before rendering the local post", () => {
  const idOnlyRouteSource = readSource("src/app/blog/[id]/page.tsx");
  const slugRouteSource = readSource("src/app/blog/[id]/[slug]/page.tsx");

  assert.match(idOnlyRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /const post = await getBlogPublicationPost\(id\);/);
});

test("blog 25 and 26 are hidden shadow records that redirect to the canonical news posts", () => {
  const blog25 = readSource("src/content/blog/25.mdx");
  const blog26 = readSource("src/content/blog/26.mdx");

  assert.match(blog25, /hidden:\s*true/);
  assert.match(blog25, /redirectUrl:\s*"\/news\/13\/terrasky-mitoco-buddy-announcement"/);
  assert.match(blog26, /hidden:\s*true/);
  assert.match(blog26, /redirectUrl:\s*"\/news\/14\/mitoco-buddy-official-launch"/);
});
