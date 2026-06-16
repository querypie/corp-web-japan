import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("internal hub page exists and links to each internal route", () => {
  const file = "src/app/internal/page.tsx";
  const childPages = [
    "src/app/internal/whitepaper-gating-form/page.tsx",
    "src/app/internal/mdx-list/page.tsx",
    "src/app/internal/events/page.tsx",
    "src/app/internal/load-more/page.tsx",
    "src/app/internal/video/page.tsx",
    "src/app/internal/sections/page.tsx",
  ];

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  for (const childPage of childPages) {
    assert.equal(existsSync(new URL(`../${childPage}`, import.meta.url)), true, `${childPage} should exist`);
  }

  const source = readSource(file);

  assert.match(source, /title:\s*"Internal Pages \| QueryPie AI"/);
  assert.match(source, /canonical:\s*"\/internal"/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*false/);
  assert.match(source, /export const revalidate = 3600;/);
  assert.match(source, /site-notice\/site-notice-surface/);
  assert.match(source, /<SiteNoticeSurface \/>/);
  assert.match(source, /const internalPageCards = \[/);
  assert.match(source, /internalPageCards\.length/);
  assert.match(source, /모든 internal 페이지는 검색 엔진 색인에서 제외됩니다/);
  assert.match(source, /card\.href/);
  assert.match(source, /\/internal\/whitepaper-gating-form/);
  assert.match(source, /\/internal\/mdx-list/);
  assert.match(source, /\/internal\/events/);
  assert.match(source, /\/internal\/load-more/);
  assert.match(source, /\/internal\/video/);
  assert.match(source, /\/internal\/sections/);
});
