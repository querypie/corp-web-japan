import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("internal hub page exists and links to each internal demo route", () => {
  const file = "src/app/internal/page.tsx";
  const childPages = [
    "src/app/internal/whitepaper-gating-demo/page.tsx",
    "src/app/internal/mdx-list-demo/page.tsx",
    "src/app/internal/events-demo/page.tsx",
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
  assert.match(source, /const internalDemoCards = \[/);
  assert.match(source, /internalDemoCards\.length/);
  assert.match(source, /모든 internal 페이지는 검색 엔진 색인에서 제외됩니다/);
  assert.match(source, /card\.href/);
  assert.match(source, /\/internal\/whitepaper-gating-demo/);
  assert.match(source, /\/internal\/mdx-list-demo/);
  assert.match(source, /\/internal\/events-demo/);
  assert.match(source, /\/internal\/load-more/);
});
