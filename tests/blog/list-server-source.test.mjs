import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog index page reads blog list items from a server loader instead of a static blogItems array", () => {
  const source = readSource("src/app/blog/page.tsx");

  assert.match(source, /listBlogPublicationItems\(/);
  assert.match(source, /const \[blogItems, resolvedSearchParams\] = await Promise\.all\(\[listBlogPublicationItems\(\), searchParams\]\);/);
  assert.match(source, /const initialVisibleCount = resolveResourceListVisibleCount\(blogItems, resolvedSearchParams\?\.until\);/);
  assert.doesNotMatch(source, /import\s*\{\s*blogItems\s*\}\s*from\s*"@\/content\/publications\/blog"/);
});

test("blog index page directly composes the resource-list hero and uses the concrete public sidebar", () => {
  const source = readSource("src/app/blog/page.tsx");

  assert.match(source, /ResourceListHeroSection/);
  assert.match(source, /ResourceListHeroTitle>ブログ<\/ResourceListHeroTitle>/);
  assert.match(source, /ResourceListHeroDescription>/);
  assert.match(source, /ResourceCategorySidebar/);
  assert.match(source, /<ResourceCategorySidebar activeLabel="ブログ" \/>/);
  assert.match(source, /ResourceListLoadMore/);
  assert.match(source, /items=\{blogItems\}/);
  assert.match(source, /initialVisibleCount=\{initialVisibleCount\}/);
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
