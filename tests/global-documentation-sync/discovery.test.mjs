import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { discoverNextCandidate, parseSyncMarker, validateDecisionManifest } from "../../scripts/global-documentation-sync/discovery.mjs";

async function source(root, id, slug, overrides = {}) {
  const dir = path.join(root, "src/content/documentation/blogs", id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "meta.json"), JSON.stringify({ storageId: id, id: slug, categorySlug: "blogs", status: "published", contentType: "content", dateIso: "2026-01-01", ...overrides }));
  await writeFile(path.join(dir, "ja.html"), "<p>本文</p>");
}

test("selects at most one exact production candidate after all decision records", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-discovery-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-discovery-"));
  await source(globalRepo, "cnt_1", "handled", { dateIso: "2026-01-01" });
  await source(globalRepo, "cnt_2", "ignored", { dateIso: "2026-02-01" });
  await source(globalRepo, "cnt_3", "newest", { dateIso: "2026-03-01" });
  await mkdir(path.join(targetRepo, ".github/content-sync"), { recursive: true });
  await writeFile(path.join(targetRepo, ".github/content-sync/baseline.json"), JSON.stringify([{ sourceId: "cnt_1", sourceCategory: "blogs", sourceSlug: "handled", targetFamily: "blog", targetId: 1, targetSlug: "handled" }]));
  await writeFile(path.join(targetRepo, ".github/content-sync/ignore.json"), JSON.stringify([{ sourceId: "cnt_2", reason: "rejected", addedBy: "owner", addedAt: "2026-01-01" }]));
  const urls = ["handled", "ignored", "newest"].map((slug) => `https://www.querypie.com/en/blog/${slug}`);
  const result = await discoverNextCandidate({ globalRepo, targetRepo, sitemapXml: urls.map((url) => `<url><loc>${url}</loc></url>`).join(""), documentationListHtml: urls.map((url) => `<a href="${url}">${url}</a>`).join("") , prRecords: [], branchNames: [] });
  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceId, "cnt_3");
});

test("closed PR markers and branch-only states suppress regeneration", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-pr-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-pr-"));
  await source(globalRepo, "cnt_9", "nine");
  await mkdir(path.join(targetRepo, ".github/content-sync"), { recursive: true });
  await writeFile(path.join(targetRepo, ".github/content-sync/baseline.json"), "[]");
  await writeFile(path.join(targetRepo, ".github/content-sync/ignore.json"), "[]");
  const marker = '<!-- global-documentation-sync:v1 {"sourceId":"cnt_9","targetFamily":"blog","targetId":9,"runId":"r","branch":"content-sync/cnt_9"} -->';
  const common = { globalRepo, targetRepo, sitemapXml: '<loc>https://www.querypie.com/en/blog/nine</loc>', documentationListHtml: '<a href="/en/blog/nine">nine</a>' };
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [{ body: marker, state: "CLOSED", headRefName: "content-sync/cnt_9" }], branchNames: [] })).status, "no_candidate");
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [{ number: 9, body: "", state: "CLOSED", headRefName: "content-sync/cnt_9" }], branchNames: [] })).status, "blocked_invalid_pr_marker");
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [], branchNames: ["content-sync/cnt_9"] })).status, "blocked_branch_only");
  assert.equal(parseSyncMarker(marker).sourceId, "cnt_9");
});

test("rejects unsorted or duplicate decision manifests", () => {
  assert.throws(() => validateDecisionManifest([{ sourceId: "cnt_2" }, { sourceId: "cnt_1" }], "baseline"), /sorted/);
  assert.throws(() => validateDecisionManifest([{ sourceId: "cnt_1" }, { sourceId: "cnt_1" }], "baseline"), /duplicate/);
});
