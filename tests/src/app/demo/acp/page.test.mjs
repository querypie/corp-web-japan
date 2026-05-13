import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/demo/acp uses the dedicated demo sidebar with the active ACP label", () => {
  const source = readSource("src/app/demo/acp/page.tsx");

  assert.match(source, /from "@\/components\/sections\/demo-category-sidebar"/);
  assert.match(source, /<DemoCategorySidebar activeLabel="ACP機能"/);
  assert.match(source, /canonical: "\/demo\/acp"/);
});


test("/demo/acp opts into the shared load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/demo/acp/page.tsx");

  assert.match(source, /resolveResourceListVisibleCount/);
  assert.match(source, /<ResourceListLoadMore/);
  assert.match(source, /key={`acp:\$\{initialVisibleCount\}`}/);
  assert.doesNotMatch(source, /<ResourceListItems items=\{acpDemoItems\} \/>/);
});
