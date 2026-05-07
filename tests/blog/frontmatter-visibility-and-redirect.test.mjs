import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog publication frontmatter supports hidden list items and external detail redirects", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");

  assert.match(source, /hidden\?: boolean;/);
  assert.match(source, /redirectUrl\?: string;/);
  assert.match(source, /hidden:\s*frontmatter\.hidden\s*===\s*true/);
  assert.match(source, /redirectUrl:\s*typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
});

test("blog publication list excludes only frontmatter-hidden records while preserving full record lookup", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");

  assert.match(source, /createStandardPublicationRecordsRepository/);
  assert.match(source, /listBlogPublicationParams\(\) \{\s*return blogPublicationRepository\.listParams\(\);\s*\}/s);
  assert.match(source, /getBlogPublicationRecord\(id: string\) \{\s*return blogPublicationRepository\.getRecord\(id\);\s*\}/s);
});

test("blog detail routes redirect to a frontmatter redirectUrl before rendering the local post", () => {
  const idOnlyRouteSource = readSource("src/app/blog/[id]/page.tsx");
  const slugRouteSource = readSource("src/app/blog/[id]/[slug]/page.tsx");

  assert.match(idOnlyRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /const post = await getBlogPublicationPost\(id\);/);
});

test("blog 23, 25, and 26 are hidden shadow records that redirect to canonical news posts", () => {
  const blog23 = readSource("src/content/blog/23.mdx");
  const blog25 = readSource("src/content/blog/25.mdx");
  const blog26 = readSource("src/content/blog/26.mdx");

  assert.match(blog23, /hidden:\s*true/);
  assert.match(blog23, /redirectUrl:\s*"\/news\/12\/payroll-querypie-ai-security-partnership"/);
  assert.match(blog25, /hidden:\s*true/);
  assert.match(blog25, /redirectUrl:\s*"\/news\/13\/terrasky-mitoco-buddy-announcement"/);
  assert.match(blog26, /hidden:\s*true/);
  assert.match(blog26, /redirectUrl:\s*"\/news\/14\/mitoco-buddy-official-launch"/);
});
