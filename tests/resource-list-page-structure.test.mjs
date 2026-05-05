import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const routeFiles = [
  "src/app/blog/page.tsx",
  "src/app/whitepapers/page.tsx",
  "src/app/events/page.tsx",
  "src/app/internal/load-more/page.tsx",
  "src/app/t/resources/page.tsx",
  "src/app/t/introduction-deck/page.tsx",
  "src/app/t/glossary/page.tsx",
  "src/app/t/manuals/page.tsx",
  "src/app/t/events/page.tsx",
  "src/app/t/use-cases/page.tsx",
  "src/app/t/demo/aip/page.tsx",
  "src/app/t/demo/acp/page.tsx",
];

test("resource list routes compose hero sections directly in each page.tsx", () => {
  for (const path of routeFiles) {
    const source = readSource(path);
    assert.match(source, /ResourceListHeroSection/);
    assert.doesNotMatch(source, /ResourceListPage/);
  }
});

test("public resource-list routes use the concrete public sidebar component", () => {
  for (const path of [
    "src/app/blog/page.tsx",
    "src/app/whitepapers/page.tsx",
    "src/app/events/page.tsx",
    "src/app/internal/load-more/page.tsx",
    "src/app/internal/mdx-list-demo/page.tsx",
    "src/app/t/use-cases/page.tsx",
    "src/app/t/events/page.tsx",
    "src/app/t/demo/aip/page.tsx",
    "src/app/t/demo/acp/page.tsx",
  ]) {
    const source = readSource(path);
    assert.match(source, /ResourceCategorySidebar/);
  }
});

test("preview resource list routes also use ResourceCategorySidebar instead of redefining sidebar markup", () => {
  for (const path of [
    "src/app/t/resources/page.tsx",
    "src/app/t/glossary/page.tsx",
    "src/app/t/introduction-deck/page.tsx",
    "src/app/t/manuals/page.tsx",
  ]) {
    const source = readSource(path);
    assert.match(source, /ResourceCategorySidebar/);
    assert.doesNotMatch(source, /const sidebarLinks: readonly ResourceCategoryLink\[] = \[/);
    assert.doesNotMatch(source, /<ResourceListSidebar>/);
  }
});

test("resource category sidebar owns both public and preview category link sets and sidebar markup", () => {
  const source = readSource("src/components/sections/resource-category-sidebar.tsx");

  assert.match(source, /export const resourceCategorySidebarLinks/);
  assert.match(source, /\{ label: "全て", href: "\/resources" \}/);
  assert.match(source, /\{ label: "紹介資料", href: "\/introduction-deck" \}/);
  assert.match(source, /\{ label: "用語集", href: "\/glossary" \}/);
  assert.match(source, /\{ label: "マニュアル", href: "\/manuals" \}/);
  assert.match(source, /\{ label: "ホワイトペーパー", href: "\/whitepapers" \}/);
  assert.match(source, /\{ label: "ブログ", href: "\/blog" \}/);
  assert.match(source, /export const previewResourceCategorySidebarLinks/);
  assert.match(source, /\{ label: "全て", href: "\/t\/resources" \}/);
  assert.match(source, /\{ label: "ホワイトペーパー", href: "\/whitepapers" \}/);
  assert.match(source, /\{ label: "ブログ", href: "\/blog" \}/);
  assert.match(source, /\{ label: "マニュアル", href: "\/t\/manuals" \}/);
  assert.match(source, /getDefaultResourceCategorySidebarLinks\(previewModeEnabled\)/);
  assert.match(source, /cookies\(\)/);
  assert.match(source, /PREVIEW_NAVIGATION_COOKIE/);
  assert.match(source, /getPreviewNavigationState/);
  assert.match(source, /ResourceListSidebarNav label="Sidebar Navigation"/);
});

test("shared ResourceListPage wrapper component has been removed", () => {
  assert.equal(existsSync(new URL("../src/components/sections/resource-list-page.tsx", import.meta.url)), false);
});

