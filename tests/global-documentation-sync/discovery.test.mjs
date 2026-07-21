import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { discoverNextCandidate, parseSyncMarker, validateDecisionManifest } from "../../scripts/global-documentation-sync/discovery.mjs";
import { discoverLive } from "../../scripts/global-documentation-sync/live-discovery.mjs";

async function source(root, category, id, slug, overrides = {}) {
  const relativeRoot = category === "news"
    ? path.join("src/content/news", id)
    : path.join("src/content/documentation", category, id);
  const dir = path.join(root, relativeRoot);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "meta.json"),
    JSON.stringify({
      storageId: id,
      id: slug,
      section: category === "news" ? "news" : undefined,
      categorySlug: category,
      status: "published",
      contentType: "content",
      dateIso: "2026-01-01",
      ...overrides,
    }),
  );
  if (overrides.contentType !== "outlink") {
    await writeFile(path.join(dir, "ja.html"), "<p>本文</p>");
  }
}

async function manifests(targetRepo, { baseline = [], ignore = [] } = {}) {
  await mkdir(path.join(targetRepo, ".github/content-sync"), { recursive: true });
  await writeFile(path.join(targetRepo, ".github/content-sync/baseline.json"), JSON.stringify(baseline));
  await writeFile(path.join(targetRepo, ".github/content-sync/ignore.json"), JSON.stringify(ignore));
}

function byUrl(entries) {
  return Object.fromEntries(entries);
}

test("selects at most one exact production candidate after all decision records", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-discovery-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-discovery-"));
  await source(globalRepo, "blogs", "cnt_1", "handled", { dateIso: "2026-01-01" });
  await source(globalRepo, "blogs", "cnt_2", "ignored", { dateIso: "2026-02-01" });
  await source(globalRepo, "blogs", "cnt_3", "newest", { dateIso: "2026-03-01" });
  await manifests(targetRepo, {
    baseline: [{ sourceId: "cnt_1", sourceCategory: "blogs", sourceSlug: "handled", targetFamily: "blog", targetId: 1, targetSlug: "handled" }],
    ignore: [{ sourceId: "cnt_2", sourceCanonicalUrl: "https://www.querypie.com/en/blog/ignored", reasonCode: "not-for-japan", reason: "rejected", addedBy: "owner", addedAt: "2026-01-01" }],
  });
  const urls = ["handled", "ignored", "newest"].map((slug) => `https://www.querypie.com/en/blog/${slug}`);
  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: urls.map((url) => `<url><loc>${url}</loc></url>`).join(""),
    productionListHtmlByUrl: byUrl([["https://www.querypie.com/en/documentation", urls.map((url) => `<a href="${url}">${url}</a>`).join("")]]),
    prRecords: [],
    branchNames: [],
  });
  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceId, "cnt_3");
});

test("ignore uses sourceId, blocks URL drift, and expires temporary decisions", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-ignore-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-ignore-"));
  await source(globalRepo, "blogs", "cnt_8", "current-slug");
  await manifests(targetRepo);
  const ignoreFile = path.join(targetRepo, ".github/content-sync/ignore.json");
  const ignored = { sourceId: "cnt_8", sourceCanonicalUrl: "https://www.querypie.com/en/blog/old-slug", reasonCode: "launch-gated", reason: "wait", addedBy: "owner", addedAt: "2026-01-01" };
  await writeFile(ignoreFile, JSON.stringify([ignored]));
  const common = {
    globalRepo,
    targetRepo,
    sitemapXml: '<loc>https://www.querypie.com/en/blog/current-slug</loc>',
    productionListHtmlByUrl: byUrl([["https://www.querypie.com/en/documentation", '<a href="/en/blog/current-slug">current</a>']]),
    prRecords: [],
    branchNames: [],
  };
  assert.equal((await discoverNextCandidate(common)).status, "blocked_ignore_url_drift");
  await writeFile(ignoreFile, JSON.stringify([{ ...ignored, sourceCanonicalUrl: "https://www.querypie.com/en/blog/current-slug", expiresAt: "2000-01-01T00:00:00Z" }]));
  assert.equal((await discoverNextCandidate(common)).status, "candidate");
});

test("closed PR markers and branch-only states suppress regeneration", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-pr-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-pr-"));
  await source(globalRepo, "blogs", "cnt_9", "nine");
  await manifests(targetRepo);
  const marker = '<!-- global-documentation-sync:v1 {"sourceSection":"documentation","sourceId":"cnt_9","targetFamily":"blog","targetId":9,"runId":"r","branch":"content-sync/documentation-cnt_9"} -->';
  const common = {
    globalRepo,
    targetRepo,
    sitemapXml: '<loc>https://www.querypie.com/en/blog/nine</loc>',
    productionListHtmlByUrl: byUrl([["https://www.querypie.com/en/documentation", '<a href="/en/blog/nine">nine</a>']]),
  };
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [{ number: 9, body: marker, state: "CLOSED", headRefName: "content-sync/documentation-cnt_9" }], branchNames: [] })).status, "no_candidate");
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [{ number: 9, body: "", state: "CLOSED", headRefName: "content-sync/documentation-cnt_9" }], branchNames: [] })).status, "blocked_invalid_pr_marker");
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [], branchNames: ["content-sync/documentation-cnt_9"] })).status, "blocked_branch_only");
  assert.equal(parseSyncMarker(marker).sourceId, "cnt_9");
});

test("allows different sections to reuse the same sourceId", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-duplicate-id-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-duplicate-id-"));
  await source(globalRepo, "manuals", "cnt_000001", "manual-one", { dateIso: "2026-01-02" });
  await source(globalRepo, "news", "cnt_000001", "news-one", { dateIso: "2026-01-01" });
  await manifests(targetRepo, {
    baseline: [{ sourceId: "cnt_000001", sourceCategory: "manuals", sourceSlug: "manual-one", targetFamily: "manuals", targetId: 1, targetSlug: "manual-one" }],
  });

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/manual/manual-one</loc><loc>https://www.querypie.com/en/news/news-one</loc>",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="/en/news/news-one">News</a>',
      "https://www.querypie.com/en/documentation": '<a href="/en/manual/manual-one">Manual</a>',
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceSection, "news");
  assert.equal(result.source.sourceId, "cnt_000001");
});

test("suppresses legacy PR marker #687 for matching composite identity and blocks duplicate PR identities", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-legacy-pr-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-legacy-pr-"));
  await source(globalRepo, "manuals", "cnt_000212", "manual-212", { dateIso: "2026-01-02" });
  await source(globalRepo, "news", "cnt_000212", "news-212", { dateIso: "2026-01-01" });
  await manifests(targetRepo);
  const common = {
    globalRepo,
    targetRepo,
    sitemapXml: [
      "https://www.querypie.com/en/manual/manual-212",
      "https://www.querypie.com/en/news/news-212",
    ].map((url) => `<loc>${url}</loc>`).join(""),
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="/en/news/news-212">News</a>',
      "https://www.querypie.com/en/documentation": '<a href="/en/manual/manual-212">Manual</a>',
    },
    branchNames: [],
  };
  const legacyMarker687 = '<!-- global-documentation-sync:v1 {"sourceId":"cnt_000212","targetFamily":"news","targetId":212,"runId":"r687","branch":"content-sync/cnt_000212"} -->';
  const suppressed = await discoverNextCandidate({ ...common, prRecords: [{ number: 687, body: legacyMarker687, state: "CLOSED", headRefName: "content-sync/cnt_000212" }], branchNames: ["content-sync/cnt_000212"] });
  assert.equal(suppressed.status, "candidate");
  assert.equal(suppressed.source.sourceSection, "documentation");
  assert.equal((await discoverNextCandidate({ ...common, prRecords: [{ number: 687, body: legacyMarker687, state: "CLOSED", headRefName: "content-sync/cnt_000212" }, { number: 688, body: '<!-- global-documentation-sync:v1 {"sourceSection":"news","sourceId":"cnt_000212","targetFamily":"news","targetId":999,"runId":"r688","branch":"content-sync/news-cnt_000212"} -->', state: "OPEN", headRefName: "content-sync/news-cnt_000212" }] })).status, "blocked_duplicate_pr_identity");
});

test("blocks ambiguous legacy branch identities when sourceId is duplicated across sections", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-ambiguous-branch-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-ambiguous-branch-"));
  await source(globalRepo, "manuals", "cnt_000001", "manual-one");
  await source(globalRepo, "news", "cnt_000001", "news-one");
  await manifests(targetRepo);
  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/manual/manual-one</loc><loc>https://www.querypie.com/en/news/news-one</loc>",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="/en/news/news-one">News</a>',
      "https://www.querypie.com/en/documentation": '<a href="/en/manual/manual-one">Manual</a>',
    },
    prRecords: [],
    branchNames: ["content-sync/cnt_000001"],
  });
  assert.equal(result.status, "blocked_ambiguous_legacy_identity");
});

test("selects listed and sitemapped News content from the flat News root", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-listed-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-listed-"));
  await source(globalRepo, "news", "cnt_10", "news-one");
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/news/news-one</loc>",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="/en/news/news-one">News</a>',
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceSection, "news");
  assert.equal(result.source.targetFamily, "news");
  assert.deepEqual(result.source.production, {
    canonicalUrl: "https://www.querypie.com/en/news/news-one",
    listed: true,
    listUrl: "https://www.querypie.com/en/news",
    sitemap: true,
  });
});

test("selects a listed HTTPS News external destination without sitemap detail evidence", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-outlink-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-outlink-"));
  await source(globalRepo, "news", "cnt_11", "news-outlink", {
    contentType: "outlink",
    externalUrl: "https://media.example/news-one",
    title: { ja: "ニュース1" },
    summary: { ja: "要約1" },
  });
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="https://media.example/news-one">News</a>',
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceSection, "news");
  assert.equal(result.source.sourceLocale, "ja");
  assert.equal(result.source.production.sitemap, false);
  assert.equal(result.source.production.listed, true);
  assert.equal(result.source.production.listUrl, "https://www.querypie.com/en/news");
});

test("documentation discovery still uses documentation list and sitemap evidence", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-doc-listed-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-doc-listed-"));
  await source(globalRepo, "blogs", "cnt_12", "doc-one");
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/blog/doc-one</loc>",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/documentation": '<a href="/en/blog/doc-one">Doc</a>',
      "https://www.querypie.com/en/news": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceSection, "documentation");
  assert.deepEqual(result.source.production, {
    canonicalUrl: "https://www.querypie.com/en/blog/doc-one",
    listed: true,
    listUrl: "https://www.querypie.com/en/documentation",
    sitemap: true,
  });
});

test("documentation discovery skips hidden and unsupported newer records before selecting an eligible published candidate", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-doc-skip-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-doc-skip-"));
  await source(globalRepo, "blogs", "cnt_120", "hidden-newer", { status: "hidden", dateIso: "2026-01-03" });
  await source(globalRepo, "blogs", "cnt_121", "unsupported-newer", { contentType: "video", dateIso: "2026-01-02" });
  await source(globalRepo, "blogs", "cnt_122", "eligible", { dateIso: "2026-01-01" });
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: [
      "https://www.querypie.com/en/blog/hidden-newer",
      "https://www.querypie.com/en/blog/unsupported-newer",
      "https://www.querypie.com/en/blog/eligible",
    ].map((url) => `<loc>${url}</loc>`).join(""),
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/documentation": [
        '<a href="/en/blog/hidden-newer">hidden</a>',
        '<a href="/en/blog/unsupported-newer">unsupported</a>',
        '<a href="/en/blog/eligible">eligible</a>',
      ].join(""),
      "https://www.querypie.com/en/news": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceId, "cnt_122");
});

test("skips News content missing list evidence", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-no-list-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-no-list-"));
  await source(globalRepo, "news", "cnt_13", "news-missing-list");
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/news/news-missing-list</loc>",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": "",
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "no_candidate");
});

test("skips News content missing sitemap evidence", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-no-sitemap-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-no-sitemap-"));
  await source(globalRepo, "news", "cnt_14", "news-missing-sitemap");
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="/en/news/news-missing-sitemap">News</a>',
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "no_candidate");
});

test("blocks News content missing Japanese and English body before candidate selection", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-no-body-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-no-body-"));
  await source(globalRepo, "news", "cnt_15", "news-no-body");
  await writeFile(path.join(globalRepo, "src/content/news/cnt_15/ja.html"), "");
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/news/news-no-body</loc>",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="/en/news/news-no-body">News</a>',
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.deepEqual(result, {
    status: "blocked_source_contract",
    sourceId: "cnt_15",
    sourceSection: "news",
    reason: "content requires non-empty ja.html or en.html",
  });
});

test("blocks News section or category mismatch before candidate selection", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-contract-mismatch-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-contract-mismatch-"));
  await source(globalRepo, "news", "cnt_16", "news-wrong-section", { section: "documentation", dateIso: "2026-01-03" });
  await source(globalRepo, "news", "cnt_17", "news-wrong-category", { categorySlug: "blogs", dateIso: "2026-01-02" });
  await manifests(targetRepo);

  const productionListHtmlByUrl = {
    "https://www.querypie.com/en/news": '<a href="/en/news/news-wrong-section">News</a><a href="/en/news/news-wrong-category">News</a>',
    "https://www.querypie.com/en/documentation": "",
  };

  assert.deepEqual(await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/news/news-wrong-section</loc><loc>https://www.querypie.com/en/news/news-wrong-category</loc>",
    productionListHtmlByUrl,
    prRecords: [],
    branchNames: [],
  }), {
    status: "blocked_source_contract",
    sourceId: "cnt_16",
    sourceSection: "news",
    reason: "section must equal news: documentation",
  });

  await writeFile(path.join(globalRepo, "src/content/news/cnt_16/meta.json"), JSON.stringify({
    storageId: "cnt_16",
    id: "news-wrong-section",
    section: "news",
    categorySlug: "news",
    status: "published",
    contentType: "content",
    dateIso: "2026-01-01",
  }));

  assert.deepEqual(await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/news/news-wrong-section</loc><loc>https://www.querypie.com/en/news/news-wrong-category</loc>",
    productionListHtmlByUrl,
    prRecords: [],
    branchNames: [],
  }), {
    status: "blocked_source_contract",
    sourceId: "cnt_17",
    sourceSection: "news",
    reason: "categorySlug must equal news: blogs",
  });
});

test("blocks unsafe News source slug before candidate selection", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-unsafe-slug-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-unsafe-slug-"));
  await source(globalRepo, "news", "cnt_18", "bad slug");
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": "",
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.deepEqual(result, {
    status: "blocked_source_contract",
    sourceId: "cnt_18",
    sourceSection: "news",
    reason: 'unsafe source slug: bad slug',
  });
});

test("blocks News outlink when Japanese locale is selected without Japanese summary", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-ja-outlink-gap-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-ja-outlink-gap-"));
  await source(globalRepo, "news", "cnt_19", "news-ja-outlink-gap", {
    contentType: "outlink",
    externalUrl: "https://media.example/news-one",
    title: { ja: "ニュース1", en: "News 1" },
    summary: { en: "Summary 1" },
  });
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="https://media.example/news-one">News</a>',
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.deepEqual(result, {
    status: "blocked_source_contract",
    sourceId: "cnt_19",
    sourceSection: "news",
    reason: "outlink requires localized title/summary and HTTPS externalUrl",
  });
});

test("falls back to English News outlink title and summary when Japanese is absent", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-en-outlink-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-en-outlink-"));
  await source(globalRepo, "news", "cnt_20", "news-en-outlink", {
    contentType: "outlink",
    externalUrl: "https://media.example/news-en",
    title: { en: "News EN" },
    summary: { en: "Summary EN" },
  });
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": '<a href="https://media.example/news-en">News</a>',
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.source.sourceLocale, "en");
});

test("blocks non-HTTPS News external URL before candidate selection", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-news-http-outlink-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-news-http-outlink-"));
  await source(globalRepo, "news", "cnt_21", "news-http-outlink", {
    contentType: "outlink",
    externalUrl: "http://media.example/news-one",
    title: { ja: "ニュース1" },
    summary: { ja: "要約1" },
  });
  await manifests(targetRepo);

  const result = await discoverNextCandidate({
    globalRepo,
    targetRepo,
    sitemapXml: "",
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": "",
      "https://www.querypie.com/en/documentation": "",
    },
    prRecords: [],
    branchNames: [],
  });

  assert.deepEqual(result, {
    status: "blocked_source_contract",
    sourceId: "cnt_21",
    sourceSection: "news",
    reason: "non-HTTPS external URL: http://media.example/news-one",
  });
});

test("discoverLive fetches sitemap plus deduplicated list URLs once", async () => {
  const globalRepo = await mkdtemp(path.join(os.tmpdir(), "global-live-discovery-"));
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "target-live-discovery-"));
  await source(globalRepo, "news", "cnt_22", "news-live", {
    contentType: "outlink",
    externalUrl: "https://media.example/news-live",
    title: { ja: "ニュース live" },
    summary: { ja: "要約 live" },
  });
  await manifests(targetRepo);

  const fetchCalls = [];
  const executeCalls = [];
  const result = await discoverLive({
    globalRepo,
    targetRepo,
    githubRepo: "owner/repo",
    fetchText: async (url) => {
      fetchCalls.push(url);
      if (url === "https://www.querypie.com/sitemap.xml") return "";
      if (url === "https://www.querypie.com/en/documentation") return "";
      if (url === "https://www.querypie.com/en/news") return '<a href="https://media.example/news-live">News</a>';
      throw new Error(`unexpected fetch ${url}`);
    },
    execute: (command, args) => {
      executeCalls.push([command, args]);
      if (command === "gh") return JSON.stringify([[]]);
      if (command === "git") return "";
      throw new Error(`unexpected execute ${command}`);
    },
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(fetchCalls, [
    "https://www.querypie.com/sitemap.xml",
    "https://www.querypie.com/en/documentation",
    "https://www.querypie.com/en/news",
  ]);
  assert.equal(executeCalls.length, 2);
});

test("rejects unsorted or duplicate decision manifests", () => {
  const baselineRecord = { sourceId: "cnt_1", sourceCategory: "blogs", sourceSlug: "one", targetFamily: "blog", targetId: 1, targetSlug: "one" };
  assert.throws(() => validateDecisionManifest([{ ...baselineRecord, sourceId: "cnt_2", sourceSlug: "two", targetId: 2, targetSlug: "two" }, baselineRecord], "baseline"), /sorted/);
  assert.throws(() => validateDecisionManifest([baselineRecord, { ...baselineRecord, targetId: 2, targetSlug: "two" }], "baseline"), /duplicate/);
});
