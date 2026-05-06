import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../../helpers/source-readers.mjs";

test("/t/demo/acp uses the dedicated demo sidebar with the active ACP label", () => {
  const source = readSource("src/app/t/demo/acp/page.tsx");

  assert.match(source, /from "@\/components\/sections\/demo-category-sidebar"/);
  assert.match(source, /<DemoCategorySidebar activeLabel="ACP機能" \/>/);
});
