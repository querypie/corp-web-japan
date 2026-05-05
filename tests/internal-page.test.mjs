import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("internal hub page exists and links to each internal demo route", () => {
  const file = "src/app/internal/page.tsx";
  const childPages = [
    "src/app/internal/whitepaper-gating-demo/page.tsx",
    "src/app/internal/mdx-list-demo/page.tsx",
    "src/app/internal/load-more/page.tsx",
  ];

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  for (const childPage of childPages) {
    assert.equal(existsSync(new URL(`../${childPage}`, import.meta.url)), true, `${childPage} should exist`);
  }

  const source = readSource(file);

  assert.match(source, /title:\s*"Internal Demos \| QueryPie AI"/);
  assert.match(source, /canonical:\s*"\/internal"/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*false/);
  assert.match(source, /href=\{"\/internal\/whitepaper-gating-demo"\}/);
  assert.match(source, /href=\{"\/internal\/mdx-list-demo"\}/);
  assert.match(source, /href=\{"\/internal\/load-more"\}/);
});
