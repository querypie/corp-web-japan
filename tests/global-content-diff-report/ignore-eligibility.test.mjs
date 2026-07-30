import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assessIgnoreEligibility,
  formatIgnoreEligibilityResult,
} from "../../scripts/global-content-diff-report/ignore-eligibility.mjs";
import { addedActiveIgnoreRecords, runValidateIgnorePrCli } from "../../scripts/global-content-diff-report/validate-ignore-pr.mjs";

const now = "2026-07-30T00:00:00.000Z";
const item = (identity, overrides = {}) => ({
  identity,
  sourceSection: identity.split(":")[0],
  sourceId: identity.split(":")[1],
  sourceUrl: `https://www.querypie.com/en/news/${identity.split(":")[1]}`,
  status: "Untracked",
  possibleJapanMatches: [],
  ...overrides,
});
const report = (items, mappingDrift = []) => ({ items, mappingDrift });

function assess(sourceIdentity, reportValue, baseIgnoreRecords = []) {
  return assessIgnoreEligibility({ sourceIdentity, report: reportValue, baseIgnoreRecords, now });
}

test("rejects unsupported and malformed composite identities", () => {
  for (const identity of ["cnt_000180", "blog:cnt_000180", "news:180", "news:cnt_1 extra"]) {
    const result = assess(identity, report([]));
    assert.equal(result.allowed, false);
    assert.equal(result.reasonCode, "invalid-source-identity");
  }
});

test("requires exactly one live report item", () => {
  assert.equal(assess("news:cnt_000180", report([])).reasonCode, "live-item-count");
  assert.equal(assess("news:cnt_000180", report([
    item("news:cnt_000180"), item("news:cnt_000180"),
  ])).reasonCode, "live-item-count");
});

test("rejects mapping drift with structured path evidence", () => {
  const result = assess("news:cnt_000180", report(
    [item("news:cnt_000180")],
    [{ identity: "news:cnt_000180", expectedPath: "src/content/news/8-existing.mdx" }],
  ));
  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, "mapping-drift");
  assert.deepEqual(result.details, { expectedPath: "src/content/news/8-existing.mdx" });
});

test("rejects non-Untracked and active base Ignore decisions", () => {
  assert.equal(assess("news:cnt_000180", report([
    item("news:cnt_000180", { status: "Ignored" }),
  ])).reasonCode, "not-untracked");
  const result = assess("news:cnt_000180", report([item("news:cnt_000180")]), [{
    sourceSection: "news", sourceId: "cnt_000180", reasonCode: "other", reason: "x", addedBy: "owner", addedAt: now,
  }]);
  assert.equal(result.reasonCode, "active-base-ignore");
});

test("expired base Ignore decision does not block", () => {
  const result = assess("news:cnt_000180", report([item("news:cnt_000180")]), [{
    sourceSection: "news", sourceId: "cnt_000180", reasonCode: "other", reason: "x", addedBy: "owner", addedAt: now,
    expiresAt: "2026-07-29T00:00:00.000Z",
  }]);
  assert.equal(result.allowed, true);
});

test("fails closed on malformed candidate evidence", () => {
  for (const evidence of [undefined, null, {}, [{ targetPath: "../escape.mdx", targetId: 1, targetSlug: "x", signals: ["exact-slug"] }], [{ targetPath: "src/content/news/1-x.mdx", targetId: 1, targetSlug: "x", signals: [] }]]) {
    const result = assess("news:cnt_000180", report([item("news:cnt_000180", { possibleJapanMatches: evidence })]));
    assert.equal(result.allowed, false);
    assert.equal(result.reasonCode, "malformed-candidate-evidence");
  }
});

test("rejects one or multiple deterministic candidates", () => {
  const candidates = [
    { targetPath: "src/content/news/1-one.mdx", targetId: 1, targetSlug: "one", signals: ["exact-slug"] },
    { targetPath: "src/content/news/2-two.mdx", targetId: 2, targetSlug: "two", signals: ["exact-source-url"] },
  ];
  for (const selected of [candidates.slice(0, 1), candidates]) {
    const result = assess("news:cnt_000180", report([item("news:cnt_000180", { possibleJapanMatches: selected })]));
    assert.equal(result.allowed, false);
    assert.equal(result.reasonCode, "possible-japan-match");
    assert.deepEqual(result.details.candidates, selected);
  }
});

test("known zero-deterministic-candidate fixtures remain eligible without claiming absence", () => {
  for (const identity of ["news:cnt_000180", "news:cnt_000181"]) {
    const result = assess(identity, report([item(identity)]));
    assert.deepEqual(result, { allowed: true, sourceIdentity: identity, item: item(identity) });
  }
});

test("failure formatter includes both SHAs, identity, evidence, and remediation", () => {
  const denied = assess("news:cnt_000180", report([item("news:cnt_000180", {
    possibleJapanMatches: [{ targetPath: "src/content/news/1-one.mdx", targetId: 1, targetSlug: "one", signals: ["exact-slug"] }],
  })]));
  const text = formatIgnoreEligibilityResult(denied, { globalSha: "a".repeat(40), japanSha: "b".repeat(40) });
  assert.match(text, /Global SHA: a{40}/);
  assert.match(text, /Japan SHA: b{40}/);
  assert.match(text, /news:cnt_000180/);
  assert.match(text, /src\/content\/news\/1-one\.mdx.*exact-slug/);
  assert.match(text, /baseline\/content PR/);
});

test("validator invokes shared eligibility for each newly added row", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ignore-pr-validator-"));
  const targetRepo = path.join(root, "japan");
  await mkdir(path.join(targetRepo, ".github/content-sync"), { recursive: true });
  const added = { sourceSection: "news", sourceId: "cnt_000180", sourceCanonicalUrl: "https://www.querypie.com/en/news/new", reasonCode: "other", reason: "new", addedBy: "x", addedAt: now };
  await writeFile(path.join(root, "base.json"), "[]\n");
  await writeFile(path.join(targetRepo, ".github/content-sync/ignore.json"), `${JSON.stringify([added], null, 2)}\n`);
  await writeFile(path.join(root, "report.json"), JSON.stringify({
    metadata: { globalSha: "a".repeat(40), japanSha: "b".repeat(40) },
    report: report([item("news:cnt_000180", {
      possibleJapanMatches: [{ targetPath: "src/content/news/1-one.mdx", targetId: 1, targetSlug: "one", signals: ["exact-slug"] }],
    })]),
  }));
  try {
    await assert.rejects(() => runValidateIgnorePrCli([
      "--target-repo", targetRepo,
      "--base-ignore", path.join(root, "base.json"),
      "--report-envelope", path.join(root, "report.json"),
    ], { stdout: { write() {} }, now }), /validation denied news:cnt_000180/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validator detects only newly added active rows", () => {
  const old = { sourceSection: "news", sourceId: "cnt_000180", sourceCanonicalUrl: "https://www.querypie.com/en/news/old", reasonCode: "other", reason: "old", addedBy: "x", addedAt: now };
  const added = { sourceSection: "news", sourceId: "cnt_000181", sourceCanonicalUrl: "https://www.querypie.com/en/news/new", reasonCode: "other", reason: "new", addedBy: "x", addedAt: now };
  assert.deepEqual(addedActiveIgnoreRecords({ baseIgnoreRecords: [old], currentIgnoreRecords: [old, added], now }), [added]);
  assert.throws(() => addedActiveIgnoreRecords({ baseIgnoreRecords: [], currentIgnoreRecords: [added, { ...added }], now }), /duplicate/);
});
