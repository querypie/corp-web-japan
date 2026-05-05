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

test("resource list routes compose hero and sidebar sections directly in each page.tsx", () => {
  for (const path of routeFiles) {
    const source = readSource(path);
    assert.match(source, /ResourceListHeroSection/);
    assert.match(source, /ResourceListSidebar>/);
    assert.match(source, /ResourceListSidebarNav label="Sidebar Navigation"/);
    assert.doesNotMatch(source, /ResourceListPage/);
  }
});

test("shared ResourceListPage wrapper component has been removed", () => {
  assert.equal(existsSync(new URL("../src/components/sections/resource-list-page.tsx", import.meta.url)), false);
});
