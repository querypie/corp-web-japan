import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const newsDir = path.join(process.cwd(), "src/content/news");
const expectedIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

function listNewsIds() {
  return readdirSync(newsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"))
    .sort((left, right) => Number(left) - Number(right));
}

test("news corpus includes every imported news record as a local MDX file", () => {
  assert.deepEqual(listNewsIds(), expectedIds);
});

test("migrated news MDX files use local news routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(newsDir, `${id}.mdx`), "utf8");
    const thumbnailPath = path.join(process.cwd(), "public", "news", id, "thumbnail.png");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/news/${id}/thumbnail\\.png"\\n`));
    assert.doesNotMatch(source, new RegExp(`filepath="public/news/${id}/thumbnail\\.png"`));
    assert.ok(existsSync(thumbnailPath), `Missing thumbnail for news ${id}`);
    assert.doesNotMatch(source, /public\/assets\//);

    if (id !== "13" && id !== "14") {
      assert.match(source, /## 掲載情報/);
      assert.match(source, /区分: ニュース/);
    }
  }
});
