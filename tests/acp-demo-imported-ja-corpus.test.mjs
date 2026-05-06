import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const acpDemoDir = path.join(process.cwd(), "src/content/demo/acp");
const expectedIds = [
  "1","2","3","4","5","6","7","8","9","10","11","12","13",
  "14","15","16","17","18","19","20","21","22","23","24","25","26",
];

function listAcpDemoIds() {
  return readdirSync(acpDemoDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"))
    .sort((left, right) => Number(left) - Number(right));
}

test("ACP demo corpus includes every Japanese source with a local MDX file", () => {
  assert.deepEqual(listAcpDemoIds(), expectedIds);
});

test("migrated ACP demo MDX files use local demo/acp routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(acpDemoDir, `${id}.mdx`), "utf8");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/demo/acp/${id}/thumbnail\\.png"\\n`));
    assert.doesNotMatch(source, /public\/demo\//);
    assert.doesNotMatch(source, /public\/tutorial\//);
    assert.doesNotMatch(source, /\/features\/demo\/acp-features\//);
    assert.match(source, /relatedIds:/);

    if (source.includes("<Youtube")) {
      assert.match(source, /hideHeroImageOnDetail: true/);
    } else {
      assert.doesNotMatch(source, /hideHeroImageOnDetail: true/);
    }
  }
});
