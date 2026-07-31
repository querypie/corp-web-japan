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
  assert.doesNotMatch(page, /アプリ一覧/);
  assert.match(page, /iconSrc: "https:\/\/www\.querypie\.com\/assets\/pages\/home\/features\/icon-lingo\.png"/);
  assert.match(page, /bg-\[linear-gradient/);
  assert.match(page, /<Image/);
  assert.match(sitemap, /absoluteUrl\("\/apps", deployedSiteUrl\)/);
});
