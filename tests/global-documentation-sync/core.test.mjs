import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  SCHEMA_VERSION,
  allocateTargetId,
  assertDryRunOperation,
  chooseLocale,
  hasBlockingFindings,
  hasExactProductionEvidence,
  mapCategory,
  normalizeUrl,
  resolveOwnedAsset,
  validateArtifact,
} from "../../scripts/global-documentation-sync/lib.mjs";

test("validates versioned review artifacts and blocking severities", () => {
  const review = {
    schemaVersion: SCHEMA_VERSION,
    artifactType: "japanese-editorial-review",
    runId: "run-1",
    sourceId: "cnt_000211",
    verdict: "revise",
    findings: [{ severity: "minor", message: "表記揺れ" }],
  };
  assert.doesNotThrow(() => validateArtifact("japanese-editorial-review", review));
  assert.equal(hasBlockingFindings(review), false);
  assert.equal(hasBlockingFindings({ ...review, findings: [{ severity: "major", message: "誤訳" }] }), true);
  assert.throws(() => validateArtifact("japanese-editorial-review", { ...review, schemaVersion: "v0" }), /schemaVersion/);
  assert.throws(() => validateArtifact("japanese-editorial-review", { ...review, findings: [{ severity: "warning", message: "x" }] }), /severity/);
});

test("maps every Global category and prefers a non-empty Japanese body", () => {
  assert.deepEqual(
    ["introduction", "glossary", "manuals", "white-papers", "blogs", "voc", "events"].map(mapCategory),
    ["introduction-deck", "glossary", "manuals", "whitepapers", "blog", "use-cases", "events"],
  );
  assert.deepEqual(chooseLocale({ jaHtml: "  <p>日本語</p> ", enHtml: "<p>English</p>" }), { locale: "ja", html: "<p>日本語</p>" });
  assert.deepEqual(chooseLocale({ jaHtml: " ", enHtml: " <p>English</p> " }), { locale: "en", html: "<p>English</p>" });
  assert.throws(() => chooseLocale({ jaHtml: "", enHtml: "" }), /locale body/);
});

test("normalizes production URLs without query, hash, or trailing slash", () => {
  assert.equal(normalizeUrl("https://www.querypie.com/en/blog/example/?utm=x#top"), "https://www.querypie.com/en/blog/example");
});

test("requires the exact canonical URL in both production surfaces", () => {
  const expectedUrl = "https://www.querypie.com/en/blog/example";
  const valid = { sitemapXml: `<url><loc>${expectedUrl}/</loc></url>`, documentationListHtml: '<a href="/en/blog/example?x=1">Example</a>', expectedUrl };
  assert.equal(hasExactProductionEvidence(valid), true);
  assert.equal(hasExactProductionEvidence({ ...valid, sitemapXml: '<url><loc>https://www.querypie.com/en/blog/example-extra</loc></url>' }), false);
  assert.equal(hasExactProductionEvidence({ ...valid, documentationListHtml: '<a href="/en/blog/example-extra">Other</a>' }), false);
});

test("resolves declared assets inside the Global public root only", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "global-doc-assets-"));
  const documentation = path.join(root, "public/documentation/blogs");
  const news = path.join(root, "public/news");
  const shared = path.join(root, "public/shared");
  await mkdir(documentation, { recursive: true });
  await mkdir(news, { recursive: true });
  await mkdir(shared, { recursive: true });
  await writeFile(path.join(documentation, "slide.webp"), "asset");
  await writeFile(path.join(news, "hero.webp"), "news");
  await writeFile(path.join(shared, "cover.webp"), "shared");
  await writeFile(path.join(root, "secret.webp"), "secret");
  await symlink(path.join(root, "secret.webp"), path.join(shared, "escape.webp"));
  const asset = await resolveOwnedAsset(root, "/documentation/blogs/slide.webp");
  assert.equal(asset.bytes, 5);
  assert.match(asset.sha256, /^[a-f0-9]{64}$/);
  assert.equal((await resolveOwnedAsset(root, "/news/hero.webp")).bytes, 4);
  assert.equal((await resolveOwnedAsset(root, "/shared/cover.webp")).bytes, 6);
  await assert.rejects(() => resolveOwnedAsset(root, "/shared/escape.webp"), /outside/);
  await assert.rejects(() => resolveOwnedAsset(root, "/documentation/../secret.txt"), /unsafe|outside|missing|unsupported/);
});

test("allocates IDs independently per target family", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "global-doc-ids-"));
  await mkdir(path.join(root, "src/content/blog"), { recursive: true });
  await mkdir(path.join(root, "src/content/whitepapers"), { recursive: true });
  await writeFile(path.join(root, "src/content/blog/7-seven.mdx"), "---\nid: 7\n---\n");
  await writeFile(path.join(root, "src/content/whitepapers/30-thirty.mdx"), "---\nid: 30\n---\n");
  assert.equal(await allocateTargetId(root, "blog"), 8);
  assert.equal(await allocateTargetId(root, "blog", [12]), 13);
  assert.equal(await allocateTargetId(root, "whitepapers"), 31);
});

test("dry-run rejects every remote mutation operation", () => {
  for (const operation of ["commit", "push", "pr", "remote-branch"]) {
    assert.throws(() => assertDryRunOperation(operation), /dry-run/);
  }
});
