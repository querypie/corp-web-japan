import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const eventsDir = path.join(process.cwd(), "src/content/events");
const expectedIds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "8",
  "10",
  "12",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
];

function listEventIds() {
  return readdirSync(eventsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"))
    .sort((left, right) => Number(left) - Number(right));
}

test("event corpus includes every Japanese webinar source with a local MDX file", () => {
  assert.deepEqual(listEventIds(), expectedIds);
});

test("migrated event MDX files use local event routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(eventsDir, `${id}.mdx`), "utf8");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/events/${id}/thumbnail\\.png"\\n`));
    assert.doesNotMatch(source, /public\/webinar\//);
    assert.doesNotMatch(source, /\/features\/demo\/webinars\//);

    if (/ArticleFileImage|ArticleYoutubeGatingForm|ButtonLink|EmailLink/.test(source)) {
      assert.ok(source.length > 0);
    }
  }
});
