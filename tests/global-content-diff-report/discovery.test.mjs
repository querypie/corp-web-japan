import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { canonicalSourceUrl, enumerateSources, productionSets, sourceContractFailure, validateDecisionManifest } from "../../scripts/global-content-diff-report/discovery.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-content-diff-report/source-family-map.mjs";

async function withGlobalRepo(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), "global-diff-discovery-"));
  await Promise.all(SOURCE_FAMILIES.map(({ relativeRoot }) => mkdir(path.join(root, relativeRoot), { recursive: true })));
  try { await run(root); } finally { await rm(root, { recursive: true, force: true }); }
}

async function writeSource(root, category, sourceId, meta, body = "<p>body</p>") {
  const descriptor = SOURCE_FAMILIES.find((item) => item.sourceCategory === category);
  const directory = path.join(root, descriptor.relativeRoot, sourceId);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "meta.json"), JSON.stringify({ storageId: sourceId, categorySlug: category, status: "published", contentType: "content", ...meta }));
  if (body !== null) await writeFile(path.join(directory, "ja.html"), body);
}

test("enumerates Documentation and flat News source inventories", async () => {
  await withGlobalRepo(async (root) => {
    await writeSource(root, "blogs", "cnt_000001", { id: "blog-one" });
    await writeSource(root, "news", "cnt_000002", { id: "news-one", section: "news" });
    const sources = await enumerateSources(root);
    assert.deepEqual(sources.map(({ sourceSection, sourceId, sourceCanonicalUrl }) => ({ sourceSection, sourceId, sourceCanonicalUrl })), [
      { sourceSection: "documentation", sourceId: "cnt_000001", sourceCanonicalUrl: "https://www.querypie.com/en/blog/blog-one" },
      { sourceSection: "news", sourceId: "cnt_000002", sourceCanonicalUrl: "https://www.querypie.com/en/news/news-one" },
    ]);
    assert.equal(sources.every(({ selected }) => selected.locale === "ja"), true);
  });
});

test("retains query-bearing outlink production evidence", () => {
  const meta = { storageId: "cnt_000003", id: "story", contentType: "outlink", externalUrl: "https://media.example/story?a=1&b=2" };
  assert.equal(canonicalSourceUrl("news", meta), "https://media.example/story");
  assert.equal(canonicalSourceUrl("news", meta, { preserveQuery: true }), "https://media.example/story?a=1&b=2");
  const production = productionSets("", { "https://www.querypie.com/en/news": '<a href="https://media.example/story?a=1&amp;b=2">Story</a>' }, { preserveQuery: true });
  assert.equal(production.listByUrl.get("https://www.querypie.com/en/news").has("https://media.example/story?a=1&b=2"), true);
});

test("validates retained source and decision-manifest contracts", () => {
  assert.equal(sourceContractFailure({ descriptor: { sourceSection: "news" }, category: "news", selected: null, meta: { section: "news", categorySlug: "news", status: "published", contentType: "content", id: "news-one" } }), "content requires non-empty ja.html or en.html");
  assert.throws(() => validateDecisionManifest([{ sourceSection: "news", sourceId: "cnt_000011", sourceCanonicalUrl: "https://media.example/article?no=169", reasonCode: "other", reason: "fixture", addedBy: "owner", addedAt: "2026-01-01T00:00:00.000Z" }], "ignore"), /normalized HTTPS/);
});
