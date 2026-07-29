import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { validateDecisionManifest } from "../../scripts/global-content-diff-report/discovery.mjs";

const root = path.resolve(".");

const validBaselineRecord = {
  sourceSection: "news",
  sourceId: "cnt_000001",
  sourceCategory: "news",
  sourceSlug: "source-slug",
  targetFamily: "news",
  targetId: 1,
  targetSlug: "target-slug",
};

const validIgnoreRecord = {
  sourceSection: "news",
  sourceId: "cnt_000001",
  sourceCanonicalUrl: "https://www.querypie.com/en/news/source-slug",
  reasonCode: "other",
  reason: "fixture",
  addedBy: "owner",
  addedAt: "2026-01-01T00:00:00Z",
};

function withField(record, field, value) {
  return { ...record, [field]: value };
}

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

test("rejects non-object baseline and ignore rows", () => {
  for (const name of ["baseline", "ignore"]) {
    for (const row of [null, [], [validBaselineRecord]]) {
      assert.throws(() => validateDecisionManifest([row], name), /record must be a plain object/);
    }
  }
});

test("rejects coercible baseline scalar values before validation logic", () => {
  const cases = [
    ["sourceSection", ["news"]],
    ["sourceSection", null],
    ["sourceId", ["cnt_000001"]],
    ["sourceId", { toString: () => "cnt_000001" }],
    ["sourceCategory", ["news"]],
    ["sourceCategory", ""],
    ["sourceSlug", ["source-slug"]],
    ["sourceSlug", ""],
    ["targetFamily", ["news"]],
    ["targetFamily", ""],
    ["targetId", "1"],
    ["targetId", true],
    ["targetId", 0],
    ["targetSlug", ["target-slug"]],
    ["targetSlug", ""],
  ];
  for (const [field, value] of cases) {
    assert.throws(
      () => validateDecisionManifest([withField(validBaselineRecord, field, value)], "baseline"),
      undefined,
      `${field} accepted ${JSON.stringify(value)}`,
    );
  }
});

test("rejects coercible ignore scalar values and invalid timestamps", () => {
  const cases = [
    ["sourceSection", ["news"]],
    ["sourceSection", ""],
    ["sourceId", ["cnt_000001"]],
    ["sourceCanonicalUrl", [validIgnoreRecord.sourceCanonicalUrl]],
    ["sourceCanonicalUrl", 1],
    ["reasonCode", ["other"]],
    ["reason", { text: "fixture" }],
    ["reason", ""],
    ["addedBy", ["owner"]],
    ["addedBy", ""],
    ["addedAt", 1767225600000],
    ["addedAt", "2026-02-30T00:00:00Z"],
    ["addedAt", "2026-01-01T09:00:00+09:00"],
    ["expiresAt", ""],
    ["expiresAt", null],
    ["expiresAt", ["2026-02-01T00:00:00Z"]],
  ];
  for (const [field, value] of cases) {
    assert.throws(
      () => validateDecisionManifest([withField(validIgnoreRecord, field, value)], "ignore"),
      undefined,
      `${field} accepted ${JSON.stringify(value)}`,
    );
  }
});

test("accepts exact seconds and milliseconds UTC timestamps", () => {
  for (const addedAt of ["2026-01-01T00:00:00Z", "2026-01-01T00:00:00.123Z"]) {
    assert.deepEqual(validateDecisionManifest([{ ...validIgnoreRecord, addedAt }], "ignore"), [
      { ...validIgnoreRecord, addedAt },
    ]);
  }
});
