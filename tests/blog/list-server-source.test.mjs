import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog index page reads blog list items from a server loader instead of a static blogItems array", () => {
  const source = readSource("src/app/blog/page.tsx");

  assert.match(source, /listBlogPublicationItems\(/);
  assert.match(source, /const blogItems = await listBlogPublicationItems\(\);/);
  assert.doesNotMatch(source, /import\s*\{\s*blogItems\s*\}\s*from\s*"@\/content\/publications\/blog"/);
});

test("blog index page directly composes the resource-list hero and sidebar sections", () => {
  const source = readSource("src/app/blog/page.tsx");

  assert.match(source, /ResourceListHeroSection/);
  assert.match(source, /ResourceListHeroTitle>ブログ<\/ResourceListHeroTitle>/);
  assert.match(source, /ResourceListHeroDescription>/);
  assert.match(source, /ResourceListSidebar>/);
  assert.match(source, /ResourceListSidebarViewport>/);
  assert.match(source, /ResourceListSidebarNav label="Sidebar Navigation"/);
  assert.match(source, /ResourceListItems items=\{blogItems\}/);
  assert.match(source, /\{ label: "ブログ", href: "\/blog", active: true \}/);
  assert.doesNotMatch(source, /ResourceListPage/);
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
