import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const routeFiles = [
  "src/app/blog/page.tsx",
  "src/app/whitepapers/page.tsx",
  "src/app/events/page.tsx",
  "src/app/internal/events/page.tsx",
  "src/app/internal/load-more/page.tsx",
  "src/app/resources/page.tsx",
  "src/app/introduction-deck/page.tsx",
  "src/app/glossary/page.tsx",
  "src/app/manuals/page.tsx",
  "src/app/use-cases/page.tsx",
  "src/app/demo/aip/page.tsx",
  "src/app/demo/acp/page.tsx",
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
    "src/app/internal/events/page.tsx",
    "src/app/internal/load-more/page.tsx",
    "src/app/internal/mdx-list/page.tsx",
      "src/app/resources/page.tsx",
    "src/app/introduction-deck/page.tsx",
    "src/app/glossary/page.tsx",
    "src/app/manuals/page.tsx",
  ]) {
    const source = readSource(path);
    assert.match(source, /ResourceCategorySidebar/);
  }
});

test("use-case and demo list routes use the dedicated demo sidebar component", () => {
  for (const path of ["src/app/use-cases/page.tsx", "src/app/demo/aip/page.tsx", "src/app/demo/acp/page.tsx"]) {
    const source = readSource(path);
    assert.match(source, /DemoCategorySidebar/);
    assert.doesNotMatch(source, /ResourceCategorySidebar/);
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
  assert.match(source, /\{ label: "全て", href: "\/resources" \}/);
  assert.match(source, /\{ label: "紹介資料", href: "\/introduction-deck" \}/);
  assert.match(source, /\{ label: "用語集", href: "\/glossary" \}/);
  assert.match(source, /\{ label: "マニュアル", href: "\/manuals" \}/);
  assert.match(source, /\{ label: "ホワイトペーパー", href: "\/whitepapers" \}/);
  assert.match(source, /\{ label: "ブログ", href: "\/blog" \}/);
  assert.match(source, /\{ label: "イベント", href: "\/events" \}/);
  assert.match(source, /getDefaultResourceCategorySidebarLinks\(previewModeEnabled\)/);
  assert.match(source, /cookies\(\)/);
  assert.match(source, /PREVIEW_NAVIGATION_COOKIE/);
  assert.match(source, /getPreviewNavigationState/);
  assert.match(source, /ResourceListSidebarNav label="Sidebar Navigation"/);
});

test("demo category sidebar owns both public and preview demo links and sidebar markup", () => {
  const source = readSource("src/components/sections/demo-category-sidebar.tsx");

  assert.match(source, /export const publicDemoCategorySidebarLinks/);
  assert.match(source, /\{ label: "活用事例", href: "\/use-cases" \}/);
  assert.match(source, /\{ label: "AIP機能", href: "\/demo\/aip" \}/);
  assert.match(source, /\{ label: "ACP機能", href: "\/demo\/acp" \}/);
  assert.match(source, /export const previewDemoCategorySidebarLinks/);
  assert.match(source, /\{ label: "活用事例", href: "\/use-cases" \}/);
  assert.match(source, /\{ label: "AIP機能", href: "\/demo\/aip" \}/);
  assert.match(source, /\{ label: "ACP機能", href: "\/demo\/acp" \}/);
  assert.match(source, /getDefaultDemoCategorySidebarLinks\(previewModeEnabled\)/);
  assert.match(source, /cookies\(\)/);
  assert.match(source, /PREVIEW_NAVIGATION_COOKIE/);
  assert.match(source, /getPreviewNavigationState/);
  assert.match(source, /<ResourceListSidebarLabel>デモカテゴリー<\/ResourceListSidebarLabel>/);
  assert.match(source, /ResourceListSidebarNav label="Sidebar Navigation"/);
});

test("mobile sidebar drawer pattern uses a dedicated client sheet trigger and keeps desktop nav separate", () => {
  const sectionSource = readSource("src/components/sections/resource-list-section.tsx");
  const resourceSidebarSource = readSource("src/components/sections/resource-category-sidebar.tsx");
  const demoSidebarSource = readSource("src/components/sections/demo-category-sidebar.tsx");
  const drawerSource = readSource("src/components/sections/resource-list/mobile-sidebar-drawer.tsx");

  assert.match(drawerSource, /"use client"/);
  assert.match(drawerSource, /useState/);
  assert.match(drawerSource, /aria-expanded=\{open\}/);
  assert.match(drawerSource, /role="dialog"/);
  assert.match(drawerSource, /aria-modal="true"/);
  assert.match(drawerSource, /fixed inset-0 z-50/);
  assert.match(drawerSource, /lg:hidden/);

  assert.match(sectionSource, /ResourceListMobileSidebarDrawer/);
  assert.doesNotMatch(sectionSource, /overflow-x-auto \[scrollbar-width:none\] \[&::-webkit-scrollbar\]:hidden lg:overflow-visible/);
  assert.doesNotMatch(sectionSource, /flex min-w-max gap-3 lg:min-w-0 lg:flex-col lg:gap-0/);

  assert.match(resourceSidebarSource, /hidden lg:block/);
  assert.match(resourceSidebarSource, /title="カテゴリー"/);
  assert.match(resourceSidebarSource, /activeLabel=\{activeLabel\}/);
  assert.match(demoSidebarSource, /hidden lg:block/);
  assert.match(demoSidebarSource, /title="デモカテゴリー"/);
  assert.match(demoSidebarSource, /activeLabel=\{activeLabel\}/);
});

test("shared ResourceListPage wrapper component has been removed", () => {
  assert.equal(existsSync(new URL("../src/components/sections/resource-list-page.tsx", import.meta.url)), false);
});

test("internal mdx list demo uses the generic CTA section primitives instead of resource-list-specific CTA names", () => {
  const demoSource = readSource("src/app/internal/mdx-list/page.tsx");
  const resourceListSectionSource = readSource("src/components/sections/resource-list-section.tsx");
  const ctaSectionSource = readSource("src/components/sections/simple-cta-section.tsx");

  assert.match(demoSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(demoSource, /<SimpleCtaSection>/);
  assert.doesNotMatch(demoSource, /ResourceListCtaSection/);

  assert.match(ctaSectionSource, /export function SimpleCtaSection/);
  assert.match(ctaSectionSource, /export function CtaTitle/);
  assert.match(ctaSectionSource, /export function CtaButton/);
  assert.doesNotMatch(resourceListSectionSource, /ResourceListCtaSection/);
});
