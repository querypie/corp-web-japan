import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog index page reads blog list items from a server loader instead of a static blogItems array", () => {
  const source = readSource("src/app/blog/page.tsx");

  assert.match(source, /await\s+listBlogPublicationItems\(/);
  assert.doesNotMatch(source, /import\s*\{\s*blogItems\s*\}\s*from\s*"@\/content\/publications\/blog"/);
});

test("blog publication list source is generated from local MDX content instead of a handwritten array", () => {
  const source = readSource("src/lib/publications/blog-publication-records.ts");
  const blogItemsSource = readSource("src/lib/publications/blog-items.ts");

  assert.match(source, /export function listBlogPublicationItems\(/);
  assert.match(source, /getBlogPublicationCache\(\)\.listItems/);
  assert.match(source, /getPublicationHref\("blog"/);
  assert.match(blogItemsSource, /export const blogItems = listBlogPublicationItems\(\);/);
  assert.doesNotMatch(blogItemsSource, /readonly ResourceItem\[]\s*=\s*\[/);
});
