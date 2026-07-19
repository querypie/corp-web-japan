import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { validateDecisionManifest } from "../../scripts/global-documentation-sync/discovery.mjs";

const root = process.cwd();

test("checked-in baseline and ignore manifests are sorted, unique, and point to existing target records", async () => {
  const baseline = validateDecisionManifest(JSON.parse(await readFile(path.join(root, ".github/content-sync/baseline.json"), "utf8")), "baseline");
  validateDecisionManifest(JSON.parse(await readFile(path.join(root, ".github/content-sync/ignore.json"), "utf8")), "ignore");
  assert.ok(baseline.length > 0);
  for (const item of baseline) {
    const directory = path.join(root, "src/content", item.targetFamily);
    const expectedPrefix = `${item.targetId}-`;
    const { readdir } = await import("node:fs/promises");
    assert.ok((await readdir(directory)).some((name) => name.startsWith(expectedPrefix) && name.endsWith(".mdx")), `missing baseline target ${item.targetFamily}:${item.targetId}`);
  }
});
