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
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
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
  "28",
];
const expectedEventDates = {
  "15": "2024-12-18",
  "16": "2025-05-29",
  "17": "2025-06-04",
  "18": "2025-07-03",
  "19": "2025-08-05",
  "20": "2025-09-25",
  "21": "2025-10-23",
  "22": "2025-11-20",
  "23": "2025-12-18",
  "24": "2026-01-22",
  "25": "2026-02-19",
  "26": "2026-03-19",
  "27": "2026-04-16",
  "28": "2026-05-21",
};
const eventFilesById = new Map(
  readdirSync(eventsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => [file.split("-", 1)[0], file]),
);

function extractExplicitBodyEventDate(source) {
  const body = source.startsWith("---") ? source.split("---").slice(2).join("---") : source;
  const match = body.match(/(20\d{2})年\s*(\d{1,2})月\s*(\d{1,2})日/);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function listEventIds() {
  return [...eventFilesById.keys()]
    .sort((left, right) => Number(left) - Number(right));
}

test("event corpus includes every Japanese webinar source with a local MDX file", () => {
  assert.deepEqual(listEventIds(), expectedIds);
});

test("migrated event MDX files use local event routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(eventsDir, eventFilesById.get(id)), "utf8");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/events/${id}/thumbnail\\.png"\\n`));
    assert.match(source, /\neventLabel: "ウェビナー"\n/);
    assert.match(source, /\ndate: "\d{4}-\d{2}-\d{2}"\n/);

    const expectedEventDate = expectedEventDates[id];
    const explicitBodyEventDate = extractExplicitBodyEventDate(source);

    if (expectedEventDate) {
      assert.equal(explicitBodyEventDate, expectedEventDate, `event body date mismatch for event ${id}`);
      assert.match(source, new RegExp(`\\neventDate: "${expectedEventDate}"\\n`));
    } else {
      assert.equal(explicitBodyEventDate, null, `unexpected explicit body event date for event ${id}`);
      assert.doesNotMatch(source, /\neventDate: "\d{4}-\d{2}-\d{2}"\n/);
    }

    const heroImageMatch = source.match(/\nheroImageSrc: "(\/events\/(\d+)\/thumbnail\.png)"\n/);
    assert.ok(heroImageMatch, `missing heroImageSrc for event ${id}`);

    const duplicatedHeroInBody = source.includes(`filepath="public${heroImageMatch[1]}"`);

    if (duplicatedHeroInBody) {
      assert.match(source, /\nhideHeroImageOnDetail: true\n/);
    }

    assert.doesNotMatch(source, /public\/webinar\//);
    assert.doesNotMatch(source, /\/features\/demo\/webinars\//);

    if (/ArticleFileImage|ArticleYoutubeGatingForm|ButtonLink|EmailLink/.test(source)) {
      assert.ok(source.length > 0);
    }
  }
});
