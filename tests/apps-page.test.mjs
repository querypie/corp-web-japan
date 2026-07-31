import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("apps page curates available QueryPie AI applications", () => {
  const page = readSource("src/app/apps/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(page, /title: "アプリ \| QueryPie AI"/);
  assert.match(page, /canonical: "\/apps"/);
  assert.match(page, /name: "Lingo"/);
  assert.match(page, /href: "https:\/\/lingo\.querypie\.ai\/ja"/);
  assert.match(sitemap, /absoluteUrl\("\/apps", deployedSiteUrl\)/);
});
