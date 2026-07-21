import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateDecisionManifest } from "../../scripts/global-documentation-sync/discovery.mjs";
import { generateBaseline, mergeBaselineRecords } from "../../scripts/global-documentation-sync/generate-baseline.mjs";

const root = process.cwd();

async function withTempRepos(run) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "baseline-test-"));
  const globalRepo = path.join(tempRoot, "global");
  const targetRepo = path.join(tempRoot, "target");
  await mkdir(globalRepo, { recursive: true });
  await mkdir(targetRepo, { recursive: true });
  try {
    await run({ globalRepo, targetRepo });
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function writeSourceRecord(globalRepo, descriptor, sourceId, meta, html = "") {
  const directory = path.join(globalRepo, descriptor.relativeRoot, sourceId);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "meta.json"), `${JSON.stringify({ storageId: sourceId, ...meta }, null, 2)}\n`);
  if (meta.contentType === "content") await writeFile(path.join(directory, "ja.html"), html || `<p>${meta.title?.ja || meta.id}</p>`);
}

async function writeTargetRecord(targetRepo, family, file, body) {
  const directory = path.join(targetRepo, "src/content", family);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, file), body);
}

test("generateBaseline matches flat news records by slug", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeSourceRecord(globalRepo, { relativeRoot: "src/content/news" }, "cnt_000200", {
      id: "iso-42001-certification-announcement",
      contentType: "content",
      title: { ja: "QueryPie、AIマネジメントシステムにおいてISO/IEC 42001認証を取得" },
    });
    await writeTargetRecord(targetRepo, "news", "16-iso-42001-certification-announcement.mdx", `---
id: "16"
slug: "iso-42001-certification-announcement"
title: "QueryPie AI、AIマネジメントシステムの国際規格 ISO/IEC 42001 認証を取得"
---
`);

    const { baseline, ambiguous } = await generateBaseline(globalRepo, targetRepo);
    assert.deepEqual(baseline, [
      { sourceSection: "news", sourceId: "cnt_000200", sourceCategory: "news", sourceSlug: "iso-42001-certification-announcement", targetFamily: "news", targetId: 16, targetSlug: "iso-42001-certification-announcement" },
    ]);
    assert.deepEqual(ambiguous, []);
  });
});

test("generateBaseline matches news outlinks by exact external destination", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeSourceRecord(globalRepo, { relativeRoot: "src/content/news" }, "cnt_000210", {
      id: "external-news-story",
      contentType: "outlink",
      externalUrl: "https://www.querypie.com/ja/news/external-news-story?utm_source=test",
      title: { ja: "External title" },
    });
    await writeTargetRecord(targetRepo, "news", "21-external-news-story.mdx", `---
id: "21"
slug: "different-target-slug"
title: "External title"
---
<ButtonLink href="https://www.querypie.com/en/news/external-news-story" />
`);

    const { baseline, ambiguous } = await generateBaseline(globalRepo, targetRepo);
    assert.deepEqual(baseline, [
      { sourceSection: "news", sourceId: "cnt_000210", sourceCategory: "news", sourceSlug: "external-news-story", targetFamily: "news", targetId: 21, targetSlug: "different-target-slug" },
    ]);
    assert.deepEqual(ambiguous, []);
  });
});

test("generateBaseline prefers visible news target before reporting ambiguity", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeSourceRecord(globalRepo, { relativeRoot: "src/content/news" }, "cnt_000211", {
      id: "visible-news-story",
      contentType: "content",
      title: { ja: "Visible story" },
    });
    await writeTargetRecord(targetRepo, "news", "22-visible-news-story-hidden.mdx", `---
id: "22"
slug: "visible-news-story"
title: "Visible story"
hidden: true
---
`);
    await writeTargetRecord(targetRepo, "news", "23-visible-news-story.mdx", `---
id: "23"
slug: "visible-news-story"
title: "Visible story"
---
`);

    const { baseline, ambiguous } = await generateBaseline(globalRepo, targetRepo);
    assert.deepEqual(baseline, [
      { sourceSection: "news", sourceId: "cnt_000211", sourceCategory: "news", sourceSlug: "visible-news-story", targetFamily: "news", targetId: 23, targetSlug: "visible-news-story" },
    ]);
    assert.deepEqual(ambiguous, []);
  });
});

test("generateBaseline reports ambiguous news title matches instead of guessing", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeSourceRecord(globalRepo, { relativeRoot: "src/content/news" }, "cnt_000212", {
      id: "ambiguous-news-story",
      contentType: "outlink",
      externalUrl: "https://example.com/story",
      title: { ja: "Same title" },
    });
    await writeTargetRecord(targetRepo, "news", "24-ambiguous-news-a.mdx", `---
id: "24"
slug: "ambiguous-news-a"
title: "Same title"
---
`);
    await writeTargetRecord(targetRepo, "news", "25-ambiguous-news-b.mdx", `---
id: "25"
slug: "ambiguous-news-b"
title: "Same title"
---
`);

    const { baseline, ambiguous } = await generateBaseline(globalRepo, targetRepo);
    assert.deepEqual(baseline, []);
    assert.equal(ambiguous.length, 1);
    assert.equal(ambiguous[0].sourceId, "cnt_000212");
    assert.equal(ambiguous[0].category, "news");
    assert.equal(ambiguous[0].slug, "ambiguous-news-story");
    assert.deepEqual(ambiguous[0].matches.map(({ id, slug }) => ({ id, slug })), [
      { id: 24, slug: "ambiguous-news-a" },
      { id: 25, slug: "ambiguous-news-b" },
    ]);
  });
});

test("generateBaseline keeps duplicate sourceIds from different sections", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeSourceRecord(globalRepo, { relativeRoot: "src/content/documentation/manuals" }, "cnt_000001", {
      id: "manual-one",
      contentType: "content",
      categorySlug: "manuals",
      title: { ja: "Manual one" },
    });
    await writeSourceRecord(globalRepo, { relativeRoot: "src/content/news" }, "cnt_000001", {
      id: "news-one",
      contentType: "content",
      categorySlug: "news",
      section: "news",
      title: { ja: "News one" },
    });
    await writeTargetRecord(targetRepo, "manuals", "1-manual-one.mdx", `---\nid: "1"\nslug: "manual-one"\ntitle: "Manual one"\n---\n`);
    await writeTargetRecord(targetRepo, "news", "2-news-one.mdx", `---\nid: "2"\nslug: "news-one"\ntitle: "News one"\n---\n`);

    const { baseline, ambiguous } = await generateBaseline(globalRepo, targetRepo);
    assert.deepEqual(baseline, [
      { sourceSection: "documentation", sourceId: "cnt_000001", sourceCategory: "manuals", sourceSlug: "manual-one", targetFamily: "manuals", targetId: 1, targetSlug: "manual-one" },
      { sourceSection: "news", sourceId: "cnt_000001", sourceCategory: "news", sourceSlug: "news-one", targetFamily: "news", targetId: 2, targetSlug: "news-one" },
    ]);
    assert.deepEqual(ambiguous, []);
  });
});

test("mergeBaselineRecords preserves accepted mappings when the source disappears", () => {
  const merged = mergeBaselineRecords(
    [
      { sourceId: "cnt_000214", sourceCategory: "blogs", sourceSlug: "iso-iec-42001-getting-started", targetFamily: "blog", targetId: 31, targetSlug: "iso-iec-42001-getting-started" },
    ],
    [
      { sourceSection: "news", sourceId: "cnt_000200", sourceCategory: "news", sourceSlug: "iso-42001-certification-announcement", targetFamily: "news", targetId: 16, targetSlug: "iso-42001-certification-announcement" },
    ],
  );
  assert.deepEqual(merged, [
    { sourceSection: "news", sourceId: "cnt_000200", sourceCategory: "news", sourceSlug: "iso-42001-certification-announcement", targetFamily: "news", targetId: 16, targetSlug: "iso-42001-certification-announcement" },
    { sourceId: "cnt_000214", sourceCategory: "blogs", sourceSlug: "iso-iec-42001-getting-started", targetFamily: "blog", targetId: 31, targetSlug: "iso-iec-42001-getting-started" },
  ]);
});

test("checked-in baseline and ignore manifests are sorted, unique, and point to existing target records", async () => {
  const baseline = validateDecisionManifest(JSON.parse(await readFile(path.join(root, ".github/content-sync/baseline.json"), "utf8")), "baseline");
  validateDecisionManifest(JSON.parse(await readFile(path.join(root, ".github/content-sync/ignore.json"), "utf8")), "ignore");
  assert.ok(baseline.length > 0);
  for (const item of baseline) {
    const directory = path.join(root, "src/content", item.targetFamily);
    const expectedPrefix = `${item.targetId}-`;
    assert.ok((await readdir(directory)).some((name) => name.startsWith(expectedPrefix) && name.endsWith(".mdx")), `missing baseline target ${item.targetFamily}:${item.targetId}`);
  }
});
