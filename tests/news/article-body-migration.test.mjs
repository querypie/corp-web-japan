import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../helpers/source-readers.mjs";

test("news 13 and 14 now contain the migrated article bodies from the former blog-only records", () => {
  const news13 = readSource("src/content/news/13.mdx");
  const news14 = readSource("src/content/news/14.mdx");

  assert.match(news13, /### \*\*■ 背景\*\*/);
  assert.match(news13, /public\/news\/13\/image-1\.png/);
  assert.match(news13, /public\/news\/13\/image-2\.png/);
  assert.match(news13, /public\/news\/13\/image-3\.png/);
  assert.doesNotMatch(news13, /public\/blog\/25\//);
  assert.doesNotMatch(news13, /参照元: \[関連ブログを見る\]/);

  assert.match(news14, /### \*\*■ 背景と経緯\*\*/);
  assert.match(news14, /### \*\*■ QueryPie AIの役割\*\*/);
  assert.doesNotMatch(news14, /参照元: \[関連ブログを見る\]/);
  assert.doesNotMatch(news14, /public\/blog\/26\//);
});

test("route-aligned migrated news assets for former blog 25 are present under public/news/13", () => {
  assert.equal(existsSync(new URL("../../public/news/13/image-1.png", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../public/news/13/image-2.png", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../public/news/13/image-3.png", import.meta.url)), true);
});
