import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { validateDecisionManifest } from "../../scripts/global-content-diff-report/discovery.mjs";

const root = path.resolve(".");

test("checked-in baseline and ignore manifests are sorted, unique, and exact targets exist", async () => {
  const baseline = validateDecisionManifest(JSON.parse(await readFile(path.join(root, ".github/content-sync/baseline.json"), "utf8")), "baseline");
  const ignore = validateDecisionManifest(JSON.parse(await readFile(path.join(root, ".github/content-sync/ignore.json"), "utf8")), "ignore");
  assert.ok(baseline.length > 0);
  assert.ok(baseline.every(({ sourceSection }) => ["documentation", "news"].includes(sourceSection)));
  assert.ok(ignore.every(({ sourceSection }) => ["documentation", "news"].includes(sourceSection)));
  for (const item of baseline) {
    const exactPath = path.join(root, "src/content", item.targetFamily, `${item.targetId}-${item.targetSlug}.mdx`);
    assert.equal((await stat(exactPath)).isFile(), true, `missing exact baseline target ${item.targetFamily}:${item.targetId}`);
  }
});
