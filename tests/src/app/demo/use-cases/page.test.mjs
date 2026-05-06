import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/demo/use-cases uses the dedicated demo sidebar with the active use-case label", () => {
  const source = readSource("src/app/demo/use-cases/page.tsx");

  assert.match(source, /from "@\/components\/sections\/demo-category-sidebar"/);
  assert.match(source, /<DemoCategorySidebar activeLabel="活用事例"/);
  assert.match(source, /canonical: "\/demo\/use-cases"/);
});

test("/demo/use-cases opts into the shared load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/demo/use-cases/page.tsx");

  assert.match(source, /resolveResourceListVisibleCount/);
  assert.match(source, /<ResourceListLoadMore/);
  assert.match(source, /key={`use-cases:\$\{initialVisibleCount\}`}/);
});
