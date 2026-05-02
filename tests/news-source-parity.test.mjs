import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const sourceNewsPagePath = path.join(process.cwd(), "../../../corp-web-contents/pages/company/news/ja/content.mdx");
const localNewsDir = path.join(process.cwd(), "src/content/news");

function parseSourceItems() {
  const source = readFileSync(sourceNewsPagePath, "utf8");
  const start = source.indexOf("items={[");
  const end = source.indexOf("]}", start);
  assert.notEqual(start, -1, "Missing items array in corp-web-contents news source");
  assert.notEqual(end, -1, "Missing items array end in corp-web-contents news source");

  const arrayText = source.slice(start + "items={".length, end + 1);
  const items = Function(`return (${arrayText});`)();
  assert.ok(Array.isArray(items), "Parsed source news items should be an array");
  return items;
}

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

test("local news corpus includes every source news item in the same visible order", () => {
  const sourceItems = parseSourceItems();
  const localItems = readLocalNewsItems();

  assert.equal(localItems.length, sourceItems.length);
  assert.deepEqual(
    localItems.map((item) => item.title),
    sourceItems.map((item) => item.title),
  );
});

test("local news corpus keeps one MDX file per source item with non-empty metadata", () => {
  const localItems = readLocalNewsItems();

  for (const item of localItems) {
    assert.ok(item.id, `Missing id in ${item.file}`);
    assert.ok(item.title, `Missing title in ${item.file}`);
    assert.ok(item.date, `Missing date in ${item.file}`);
  }
});
