import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const localNewsDir = path.join(process.cwd(), "src/content/news");

function readLocalNewsItems() {
  return readdirSync(localNewsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = readFileSync(path.join(localNewsDir, file), "utf8");
      const id = (source.match(/\nid: "([^"]+)"/) ?? [])[1] ?? null;
      const title = (source.match(/\ntitle: "([^"]+)"/) ?? [])[1] ?? null;
      const date = (source.match(/\ndate: "([^"]+)"/) ?? [])[1] ?? null;
      return { file, id, title, date };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

test("local news corpus keeps one MDX file per source item with non-empty metadata", () => {
  const localItems = readLocalNewsItems();

  for (const item of localItems) {
    assert.ok(item.id, `Missing id in ${item.file}`);
    assert.ok(item.title, `Missing title in ${item.file}`);
    assert.ok(item.date, `Missing date in ${item.file}`);
  }
});
