import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const useCasesDir = path.join(process.cwd(), "src/content/use-cases");
const expectedIds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
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
  "29",
];

function listUseCaseIds() {
  return readdirSync(useCasesDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"))
    .sort((left, right) => Number(left) - Number(right));
}

test("use-case corpus includes every Japanese use-case source with a local MDX file", () => {
  assert.deepEqual(listUseCaseIds(), expectedIds);
});

test("migrated use-case MDX files use local use-case routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(useCasesDir, `${id}.mdx`), "utf8");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/use-cases/${id}/thumbnail\\.png"\\n`));
    assert.doesNotMatch(source, /public\/demo\//);
    assert.doesNotMatch(source, /public\/customer-success-cases\//);
    assert.doesNotMatch(source, /\/features\/demo\/use-cases\//);
    assert.match(source, /relatedIds:/);

    if (source.includes("<Youtube")) {
      assert.match(source, /<Youtube/);
    }
  }
});
