import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const newsDir = path.join(process.cwd(), "src/content/news");
const expectedIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
const migratedExternalIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const newsFilesById = new Map(
  readdirSync(newsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => [file.split("-", 1)[0], file]),
);

function listNewsIds() {
  return [...newsFilesById.keys()]
    .sort((left, right) => Number(left) - Number(right));
}

test("news corpus includes every imported news record as a local MDX file", () => {
  assert.deepEqual(listNewsIds(), expectedIds);
});

test("migrated news MDX files use local news routes, route-aligned assets, and no duplicated leading H1", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(newsDir, newsFilesById.get(id)), "utf8");
    const thumbnailPath = path.join(process.cwd(), "public", "news", id, "thumbnail.png");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/news/${id}/thumbnail\\.png"\\n`));
    assert.ok(existsSync(thumbnailPath), `Missing thumbnail for news ${id}`);
    assert.doesNotMatch(source, new RegExp(`filepath="public/news/${id}/thumbnail\\.png"`));
    assert.doesNotMatch(source, /public\/assets\//);
    assert.doesNotMatch(source, /^---\n[\s\S]*?\n---\n+# /);
  }
});

test("formerly redirect-backed external news posts now render local article bodies", () => {
  for (const id of migratedExternalIds) {
    const source = readFileSync(path.join(newsDir, newsFilesById.get(id)), "utf8");

    assert.match(source, /\nsourceLabel: "メディア掲載"\n/);
    assert.doesNotMatch(source, /\nredirectUrl: "https?:\/\//);
    assert.doesNotMatch(source, /## 掲載情報/);
    assert.doesNotMatch(source, /区分: ニュース/);
    assert.match(source, /> (Source article|Original source): /);
  }
});
