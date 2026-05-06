import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/use-cases uses the dedicated demo sidebar with the active use-case label", () => {
  const source = readSource("src/app/t/use-cases/page.tsx");

  assert.match(source, /from "@\/components\/sections\/demo-category-sidebar"/);
  assert.match(source, /<DemoCategorySidebar activeLabel="活用事例" \/>/);
});
