import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/demo/aip uses the dedicated demo sidebar with the active AIP label", () => {
  const source = readSource("src/app/demo/aip/page.tsx");

  assert.match(source, /from "@\/components\/sections\/demo-category-sidebar"/);
  assert.match(source, /<DemoCategorySidebar activeLabel="AIP機能"/);
  assert.match(source, /canonical: "\/demo\/aip"/);
});
