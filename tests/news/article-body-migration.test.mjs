import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readSource } from "../helpers/source-readers.mjs";

const newsDir = join(process.cwd(), "src/content/news");
const newsFilesById = new Map(
  readdirSync(newsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => [file.split("-", 1)[0], file]),
);

test("news 1-12 now contain imported article bodies instead of redirect-only archive placeholders", () => {
  const migratedNewsIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  for (const id of migratedNewsIds) {
    const filename = newsFilesById.get(id);
    assert.ok(filename);

    const source = readSource(`src/content/news/${filename}`);

    assert.doesNotMatch(source, /## 掲載情報/);
    assert.doesNotMatch(source, /区分: ニュース/);
    assert.doesNotMatch(source, /詳細は元記事または関連ブログをご確認ください。/);
    assert.match(source, /> (Source article|Original source): /);
  }
});

test("news 13 and 14 still contain the migrated article bodies from the former blog-only records", () => {
  const news13 = readSource("src/content/news/13-terrasky-mitoco-buddy-announcement.mdx");
  const news14 = readSource("src/content/news/14-mitoco-buddy-official-launch.mdx");

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
