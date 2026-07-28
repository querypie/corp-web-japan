import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildGlobalInventory, buildGlobalOnlyReport, buildJapanInventory } from "../../scripts/global-content-diff-report/report.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-documentation-sync/source-family-map.mjs";

async function withTempRepos(run) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "global-content-diff-report-"));
  const globalRepo = path.join(tempRoot, "global");
  const targetRepo = path.join(tempRoot, "target");
  await mkdir(globalRepo, { recursive: true });
  await mkdir(targetRepo, { recursive: true });
  try {
    return await run({ globalRepo, targetRepo });
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function descriptorFor(category) {
  const descriptor = SOURCE_FAMILIES.find((value) => value.sourceCategory === category);
  if (!descriptor) throw new Error(`missing descriptor: ${category}`);
  return descriptor;
}

async function writeGlobalSource(globalRepo, {
  sourceId,
  category,
  slug,
  dateIso = "2026-01-01",
  status = "published",
  contentType = "content",
  title,
  summary,
  externalUrl,
  body = `<p>${slug}</p>`,
}) {
  const descriptor = descriptorFor(category);
  const directory = path.join(globalRepo, descriptor.relativeRoot, sourceId);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "meta.json"), `${JSON.stringify({
    storageId: sourceId,
    id: slug,
    section: descriptor.sourceSection === "news" ? "news" : undefined,
    categorySlug: category,
    status,
    contentType,
    dateIso,
    title,
    summary,
    externalUrl,
  }, null, 2)}\n`);
  if (contentType === "content" && body !== null) {
    await writeFile(path.join(directory, "ja.html"), body);
  }
}

async function writeManifest(targetRepo, name, records) {
  const directory = path.join(targetRepo, ".github/content-sync");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, `${name}.json`), `${JSON.stringify(records, null, 2)}\n`);
}

async function writeTargetFile(targetRepo, relativePath) {
  const file = path.join(targetRepo, relativePath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, "---\nid: \"1\"\nslug: \"fixture\"\ntitle: \"Fixture\"\n---\n");
}

function baselineMapping(sourceSection, sourceId, sourceCategory, targetFamily, targetId, targetSlug, sourceSlug = targetSlug) {
  return {
    sourceSection,
    sourceId,
    sourceCategory,
    sourceSlug,
    targetFamily,
    targetId,
    targetSlug,
  };
}

function ignored(sourceId, sourceCanonicalUrl, sourceSection) {
  return {
    sourceId,
    sourceSection,
    sourceCanonicalUrl,
    reasonCode: "manual-publication",
    reason: "Handled manually",
    addedBy: "worker",
    addedAt: "2026-01-01T00:00:00.000Z",
  };
}

function markerBody({ sourceSection, sourceId, targetFamily, targetId, branch }) {
  const payload = { sourceId, targetFamily, targetId, runId: `run-${targetId}`, branch };
  if (sourceSection) payload.sourceSection = sourceSection;
  return `<!-- global-documentation-sync:v1 ${JSON.stringify(payload)} -->`;
}

function mergedMarker(sourceSection, sourceId, targetFamily, targetId) {
  return {
    number: targetId,
    state: "MERGED",
    merged: true,
    headRefName: branchName(sourceSection, sourceId),
    body: markerBody({ sourceSection, sourceId, targetFamily, targetId, branch: branchName(sourceSection, sourceId) }),
  };
}

function legacyMergedMarker(sourceId, targetFamily, targetId) {
  return {
    number: targetId,
    state: "MERGED",
    merged: true,
    headRefName: `content-sync/${sourceId}`,
    body: markerBody({ sourceId, targetFamily, targetId, branch: `content-sync/${sourceId}` }),
  };
}

function draftMarker(sourceSection, sourceId, targetFamily, targetId, state = "OPEN") {
  return {
    number: targetId,
    state,
    merged: false,
    headRefName: branchName(sourceSection, sourceId),
    body: markerBody({ sourceSection, sourceId, targetFamily, targetId, branch: branchName(sourceSection, sourceId) }),
  };
}

function branchName(sourceSection, sourceId) {
  return `content-sync/${sourceSection}-${sourceId}`;
}

function publishedBlog(sourceId, slug, overrides = {}) {
  return { sourceId, category: "blogs", slug, title: { en: `${slug} en`, ja: `${slug} ja`, ko: `${slug} ko` }, ...overrides };
}

function publishedDocumentation(sourceId, slug, overrides = {}) {
  return { sourceId, category: "manuals", slug, title: { en: `${slug} en`, ja: `${slug} ja`, ko: `${slug} ko` }, ...overrides };
}

function publishedNews(sourceId, slug, overrides = {}) {
  return { sourceId, category: "news", slug, title: { en: `${slug} en`, ja: `${slug} ja`, ko: `${slug} ko` }, ...overrides };
}

function staleNews(sourceId, slug, overrides = {}) {
  return { sourceId, category: "news", slug, status: "draft", title: { en: `${slug} en` }, ...overrides };
}

async function fixtureWith({
  global = [],
  japan = [],
  targetFiles = [],
  ignore = [],
  pulls = [],
  mergedPulls = [],
  sitemapXml,
  productionListHtmlByUrl,
  now = "2026-03-01T00:00:00.000Z",
}) {
  return withTempRepos(async ({ globalRepo, targetRepo }) => {
    for (const source of global) {
      await writeGlobalSource(globalRepo, source);
    }
    await writeManifest(targetRepo, "baseline", japan);
    await writeManifest(targetRepo, "ignore", ignore);
    for (const relativePath of targetFiles) {
      await writeTargetFile(targetRepo, relativePath);
    }

    const listHtmlByUrl = productionListHtmlByUrl || buildProductionListHtml(global);
    const sitemap = sitemapXml ?? buildSitemapXml(global);

    return buildGlobalOnlyReport({
      globalRepo,
      targetRepo,
      sitemapXml: sitemap,
      productionListHtmlByUrl: listHtmlByUrl,
      prRecords: [...pulls, ...mergedPulls],
      now,
    });
  });
}

function buildSitemapXml(global) {
  return global
    .filter(({ contentType = "content", status = "published" }) => status === "published" && contentType !== "outlink")
    .map((source) => `<loc>${canonicalUrl(source.category, source.slug)}</loc>`)
    .join("");
}

function buildProductionListHtml(global) {
  const entries = new Map(SOURCE_FAMILIES.map((descriptor) => [descriptor.productionListUrl, []]));
  for (const source of global) {
    const descriptor = descriptorFor(source.category);
    const href = source.contentType === "outlink" ? source.externalUrl : canonicalUrl(source.category, source.slug);
    entries.get(descriptor.productionListUrl).push(`<a href="${href}">${source.slug}</a>`);
  }
  return Object.fromEntries([...entries.entries()].map(([url, links]) => [url, links.join("")]));
}

function canonicalUrl(category, slug) {
  const descriptor = descriptorFor(category);
  return `https://www.querypie.com/en/${descriptor.canonicalSegment}/${slug}`;
}

test("reports all listed Global-only identities and preserves cross-section IDs", async () => {
  const report = await fixtureWith({
    global: [
      publishedDocumentation("cnt_000001", "doc-one"),
      publishedNews("cnt_000001", "news-one"),
      staleNews("cnt_000002", "not-listed"),
    ],
    japan: [baselineMapping("documentation", "cnt_000001", "manuals", "blog", 1, "doc-one")],
    targetFiles: ["src/content/blog/1-doc-one.mdx"],
  });

  assert.deepEqual(report.items.map(({ identity }) => identity), ["news:cnt_000001"]);
  assert.equal(report.items[0].sourceUrl, "https://www.querypie.com/en/news/news-one");
});

test("counts baseline and merged marker mappings only when target MDX exists", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000212", "ai-pack")],
    mergedPulls: [legacyMergedMarker("cnt_000212", "news", 19)],
    targetFiles: ["src/content/news/19-ai-pack.mdx"],
  });

  assert.equal(report.items.length, 0);
  assert.equal(report.counts.japanPresent, 1);
});

test("keeps ignored and closed Draft items in the diff with status", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000177", "real-madrid")],
    ignore: [ignored("cnt_000177", "https://www.querypie.com/en/news/real-madrid")],
    pulls: [draftMarker("news", "cnt_000177", "news", 24, "CLOSED")],
  });

  assert.equal(report.items[0].status, "Ignored");
});

test("reports missing mapped targets as mapping drift instead of Japan-present", async () => {
  const report = await fixtureWith({
    global: [publishedBlog("cnt_000010", "missing-target")],
    japan: [baselineMapping("documentation", "cnt_000010", "blogs", "blog", 10, "missing-target")],
    targetFiles: [],
  });

  assert.equal(report.items[0].status, "Mapping drift");
  assert.equal(report.counts.japanPresent, 0);
  assert.deepEqual(report.mappingDrift, [{ identity: "documentation:cnt_000010", expectedPath: "src/content/blog/10-missing-target.mdx" }]);
});

test("throws for listed invalid sources that are not skippable", async () => {
  await withTempRepos(async ({ globalRepo }) => {
    await writeGlobalSource(globalRepo, {
      sourceId: "cnt_000500",
      category: "news",
      slug: "broken-news",
      contentType: "content",
      title: { en: "Broken" },
      body: null,
    });
    await assert.rejects(
      () => buildGlobalInventory({
        globalRepo,
        sitemapXml: "<loc>https://www.querypie.com/en/news/broken-news</loc>",
        productionListHtmlByUrl: {
          "https://www.querypie.com/en/news": '<a href="/en/news/broken-news">broken</a>',
        },
      }),
      /news:cnt_000500: content requires non-empty ja.html or en.html/,
    );
  });
});

test("includes listed outlinks without sitemap detail evidence", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000301", "external-story", {
      contentType: "outlink",
      externalUrl: "https://example.com/story",
      title: { ja: "外部記事" },
      summary: { ja: "要約" },
    })],
    sitemapXml: "",
  });

  assert.equal(report.counts.globalPublished, 1);
  assert.equal(report.items[0].identity, "news:cnt_000301");
  assert.equal(report.items[0].sourceUrl, "https://example.com/story");
});

test("excludes stale sources from Global inventory", async () => {
  const report = await fixtureWith({
    global: [{ ...publishedBlog("cnt_000302", "draft-story"), status: "draft" }],
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": "",
      "https://www.querypie.com/en/documentation": '<a href="/en/blog/draft-story">draft</a>',
    },
    sitemapXml: "<loc>https://www.querypie.com/en/blog/draft-story</loc>",
  });

  assert.equal(report.counts.globalPublished, 0);
  assert.equal(report.items.length, 0);
});

test("rejects duplicate merged mappings when target allocation differs", async () => {
  await withTempRepos(async ({ targetRepo }) => {
    await writeManifest(targetRepo, "baseline", []);
    await writeManifest(targetRepo, "ignore", []);
    await assert.rejects(
      () => buildJapanInventory({
        targetRepo,
        prRecords: [
          mergedMarker("news", "cnt_000401", "news", 41),
          mergedMarker("news", "cnt_000401", "news", 42),
        ],
      }),
      /duplicate merged mapping: news:cnt_000401/,
    );
  });
});

test("baseline mappings require the exact recorded target path", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000402", "same-id")],
    japan: [baselineMapping("news", "cnt_000402", "news", "news", 18, "canonical-slug", "same-id")],
    targetFiles: ["src/content/news/18-other-slug.mdx"],
  });

  assert.equal(report.items[0].status, "Mapping drift");
  assert.equal(report.counts.japanPresent, 0);
});

test("sorts deterministically by date descending then identity and falls back title en-ja-ko-sourceId", async () => {
  const report = await fixtureWith({
    global: [
      publishedNews("cnt_000602", "later-b", { dateIso: "2026-04-02", title: { ja: "ja only" } }),
      publishedNews("cnt_000601", "later-a", { dateIso: "2026-04-02", title: { ko: "ko only" } }),
      publishedNews("cnt_000603", "earlier", { dateIso: "2026-04-01", title: {} }),
    ],
  });

  assert.deepEqual(report.items.map(({ identity }) => identity), [
    "news:cnt_000601",
    "news:cnt_000602",
    "news:cnt_000603",
  ]);
  assert.deepEqual(report.items.map(({ title }) => title), ["ko only", "ja only", "cnt_000603"]);
});
