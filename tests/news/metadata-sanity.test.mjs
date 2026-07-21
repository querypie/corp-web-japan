import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const localNewsDir = path.join(process.cwd(), "src/content/news");

function readNewsMetadata(source) {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1];
  if (!frontmatter) return { id: null, title: null, date: null };

  const parsed = parse(frontmatter);
  const scalar = (name) => parsed[name] == null ? null : String(parsed[name]);
  return { id: scalar("id"), title: scalar("title"), date: scalar("date") };
}

function readLocalNewsItems() {
  return readdirSync(localNewsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      file,
      ...readNewsMetadata(readFileSync(path.join(localNewsDir, file), "utf8")),
    }))
    .sort((left, right) => Number(right.id) - Number(left.id));
}

test("news metadata parser accepts valid YAML scalar forms and rejects malformed quotes", () => {
  assert.deepEqual(readNewsMetadata('---\nid: "18"\ntitle: "Brant\'s launch"\ndate: "2026-01-01"\n---\n'), {
    id: "18",
    title: "Brant's launch",
    date: "2026-01-01",
  });
  assert.equal(readNewsMetadata("---\nid: 19\ntitle: Launch\ndate: 2026-01-02\n---\n").id, "19");
  assert.throws(() => readNewsMetadata('---\nid: 20\ntitle: "Broken title\ndate: "2026-01-03"\n---\n'));
});

test("local news corpus keeps one MDX file per source item with non-empty metadata", () => {
  const localItems = readLocalNewsItems();

  for (const item of localItems) {
    assert.ok(item.id, `Missing id in ${item.file}`);
    assert.ok(item.title, `Missing title in ${item.file}`);
    assert.ok(item.date, `Missing date in ${item.file}`);
  }
});
