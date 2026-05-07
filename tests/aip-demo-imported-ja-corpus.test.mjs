import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const aipDemoDir = path.join(process.cwd(), "src/content/demo/aip");
const expectedIds = ["1"];
const aipDemoFilesById = new Map(
  readdirSync(aipDemoDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => [file.split("-", 1)[0], file]),
);

function listAipDemoIds() {
  return [...aipDemoFilesById.keys()]
    .sort((left, right) => Number(left) - Number(right));
}

test("AIP demo corpus includes every Japanese source with a local MDX file", () => {
  assert.deepEqual(listAipDemoIds(), expectedIds);
});

test("migrated AIP demo MDX files use local demo/aip routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(aipDemoDir, aipDemoFilesById.get(id)), "utf8");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/demo/aip/${id}/thumbnail\\.png"\\n`));
    assert.doesNotMatch(source, /public\/demo\//);
    assert.doesNotMatch(source, /\/features\/demo\/aip-features\//);
    assert.match(source, /relatedIds:/);

    if (source.includes("<Youtube")) {
      assert.match(source, /hideHeroImageOnDetail: true/);
    } else {
      assert.doesNotMatch(source, /hideHeroImageOnDetail: true/);
    }
  }
});
