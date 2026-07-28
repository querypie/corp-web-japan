import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildGlobalInventory, buildGlobalOnlyReport, buildJapanInventory } from "../../scripts/global-content-diff-report/report.mjs";
import { buildSlackPayloads, sendSlackPayloads } from "../../scripts/global-content-diff-report/slack.mjs";
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
    number: 687,
    state: "MERGED",
    merged: true,
    headRefName: `content-sync/${sourceId}`,
    body: markerBody({ sourceId, targetFamily, targetId, branch: `content-sync/${sourceId}` }),
  };
}

function draftMarker(sourceSection, sourceId, targetFamily, targetId, state = "OPEN", overrides = {}) {
  return {
    number: targetId,
    state,
    merged: false,
    isDraft: true,
    headRefName: branchName(sourceSection, sourceId),
    body: markerBody({ sourceSection, sourceId, targetFamily, targetId, branch: branchName(sourceSection, sourceId) }),
    ...overrides,
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

function reportItem(index, overrides = {}) {
  return {
    identity: `news:cnt_${String(index).padStart(6, "0")}`,
    sourceSection: "news",
    sourceId: `cnt_${String(index).padStart(6, "0")}`,
    sourceCategory: "news",
    targetFamily: "news",
    title: `QueryPie selected & <${index}>`,
    dateIso: `2026-04-${String((index % 28) + 1).padStart(2, "0")}`,
    sourceUrl: `https://finance.yahoo.com/story-${index}`,
    status: "Untracked",
    ...overrides,
  };
}

function reportWithItems(count, options = {}) {
  const items = Array.from({ length: count }, (_, index) => reportItem(index + 1));
  const familyCounts = items.reduce((accumulator, item) => {
    accumulator[item.targetFamily] = (accumulator[item.targetFamily] || 0) + 1;
    return accumulator;
  }, {});
  return {
    generatedAt: "2026-04-30T00:00:00.000Z",
    counts: {
      globalPublished: count,
      japanPresent: 0,
      globalOnly: count,
    },
    familyCounts,
    items,
    mappingDrift: [],
    ...options,
  };
}

function reportWithSevenItems() {
  return {
    ...reportWithItems(7),
    familyCounts: { news: 3, blog: 2, whitepapers: 2 },
    items: [
      reportItem(1, { targetFamily: "news", dateIso: "2026-04-07" }),
      reportItem(2, { targetFamily: "news", dateIso: "2026-04-06" }),
      reportItem(3, { targetFamily: "news", dateIso: "2026-04-05" }),
      reportItem(4, { targetFamily: "blog", identity: "documentation:cnt_000004", sourceSection: "documentation", sourceCategory: "blogs", targetFamily: "blog", dateIso: "2026-04-04" }),
      reportItem(5, { targetFamily: "blog", identity: "documentation:cnt_000005", sourceSection: "documentation", sourceCategory: "blogs", targetFamily: "blog", dateIso: "2026-04-03" }),
      reportItem(6, { targetFamily: "whitepapers", identity: "documentation:cnt_000006", sourceSection: "documentation", sourceCategory: "white-papers", targetFamily: "whitepapers", dateIso: "2026-04-02" }),
      reportItem(7, { targetFamily: "whitepapers", identity: "documentation:cnt_000007", sourceSection: "documentation", sourceCategory: "white-papers", targetFamily: "whitepapers", dateIso: "2026-04-01", title: `A very long title ${"x".repeat(220)}` }),
    ],
  };
}

function emptyReport() {
  return {
    generatedAt: "2026-04-30T00:00:00.000Z",
    counts: {
      globalPublished: 0,
      japanPresent: 0,
      globalOnly: 0,
    },
    familyCounts: {},
    items: [],
    mappingDrift: [],
  };
}

const slackMetadata = {
  globalSha: "abc1234",
  japanSha: "def5678",
};

test("reports all listed Global-only identities and preserves cross-section IDs", async () => {
  const report = await fixtureWith({
    global: [
      publishedBlog("cnt_000001", "doc-one"),
      publishedNews("cnt_000001", "news-one"),
      staleNews("cnt_000002", "not-listed"),
    ],
    japan: [baselineMapping("documentation", "cnt_000001", "blogs", "blog", 1, "doc-one")],
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

test("keeps ignored items in the diff and ignores unmerged PR state", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000177", "real-madrid")],
    ignore: [ignored("cnt_000177", "https://www.querypie.com/en/news/real-madrid")],
    pulls: [draftMarker("news", "cnt_000177", "news", 24, "CLOSED")],
  });

  assert.equal(report.items[0].status, "Ignored");
});

test("treats all draft and closed-unmerged PR-only items as Untracked", async () => {
  const malformedMarker = "<!-- global-documentation-sync:v1 {not-json} -->";
  const report = await fixtureWith({
    global: [
      publishedNews("cnt_000178", "trusted-open"),
      publishedNews("cnt_000179", "trusted-closed"),
      publishedNews("cnt_000180", "fork-spoof"),
      publishedNews("cnt_000181", "not-draft"),
      publishedNews("cnt_000182", "malformed-marker"),
    ],
    pulls: [
      draftMarker("news", "cnt_000178", "news", 25),
      draftMarker("news", "cnt_000179", "news", 26, "CLOSED"),
      draftMarker("news", "cnt_000180", "news", 27, "OPEN"),
      draftMarker("news", "cnt_000181", "news", 28, "OPEN", { isDraft: false }),
      draftMarker("news", "cnt_000182", "news", 29, "OPEN", { body: malformedMarker }),
    ],
  });

  assert.deepEqual(report.items.map(({ status }) => status), ["Untracked", "Untracked", "Untracked", "Untracked", "Untracked"]);
});

test("reports missing mapped targets as mapping drift evidence with Untracked status", async () => {
  const report = await fixtureWith({
    global: [publishedBlog("cnt_000010", "missing-target")],
    japan: [baselineMapping("documentation", "cnt_000010", "blogs", "blog", 10, "missing-target")],
    targetFiles: [],
  });

  assert.equal(report.items[0].status, "Untracked");
  assert.equal(report.counts.japanPresent, 0);
  assert.deepEqual(report.mappingDrift, [{ identity: "documentation:cnt_000010", expectedPath: "src/content/blog/10-missing-target.mdx" }]);
});

test("rejects duplicate Global composite identities across documentation categories", async () => {
  await withTempRepos(async ({ globalRepo }) => {
    await writeGlobalSource(globalRepo, publishedBlog("cnt_000499", "duplicate-blog"));
    await writeGlobalSource(globalRepo, publishedDocumentation("cnt_000499", "duplicate-manual"));

    await assert.rejects(
      () => buildGlobalInventory({
        globalRepo,
        sitemapXml: [
          "https://www.querypie.com/en/blog/duplicate-blog",
          "https://www.querypie.com/en/manual/duplicate-manual",
        ].map((url) => `<loc>${url}</loc>`).join(""),
        productionListHtmlByUrl: {
          "https://www.querypie.com/en/documentation": [
            '<a href="/en/blog/duplicate-blog">blog</a>',
            '<a href="/en/manual/duplicate-manual">manual</a>',
          ].join(""),
        },
      }),
      /duplicate Global identity: documentation:cnt_000499/,
    );
  });
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

test("excludes unlisted and unsitemapped stale sources from Global inventory", async () => {
  const report = await fixtureWith({
    global: [{ ...publishedBlog("cnt_000302", "draft-story"), status: "draft" }],
    productionListHtmlByUrl: {
      "https://www.querypie.com/en/news": "",
      "https://www.querypie.com/en/documentation": "",
    },
    sitemapXml: "",
  });

  assert.equal(report.counts.globalPublished, 0);
  assert.equal(report.items.length, 0);
});

test("throws for listed and sitemapped invalid Documentation sources", async () => {
  await withTempRepos(async ({ globalRepo }) => {
    await writeGlobalSource(globalRepo, { ...publishedBlog("cnt_000303", "listed-draft"), status: "draft" });

    await assert.rejects(
      () => buildGlobalInventory({
        globalRepo,
        productionListHtmlByUrl: {
          "https://www.querypie.com/en/documentation": '<a href="/en/blog/listed-draft">draft</a>',
        },
        sitemapXml: "<loc>https://www.querypie.com/en/blog/listed-draft</loc>",
      }),
      /documentation:cnt_000303: status must equal published: draft/,
    );
  });
});

test("promotes stale baseline drift when a merged marker confirms the same existing allocation", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000400", "repaired-target")],
    japan: [baselineMapping("news", "cnt_000400", "news", "news", 40, "stale-slug")],
    mergedPulls: [mergedMarker("news", "cnt_000400", "news", 40)],
    targetFiles: ["src/content/news/40-repaired-target.mdx"],
  });

  assert.equal(report.counts.japanPresent, 1);
  assert.equal(report.items.length, 0);
  assert.deepEqual(report.mappingDrift, []);
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

test("rejects malformed baseline mappings at the report trust boundary before stat", async () => {
  const cases = [
    {
      record: baselineMapping("news", "cnt_000414", "blogs", "blog", 44, "valid-slug"),
      pattern: /baseline record sourceSection must equal descriptor section: documentation/,
    },
    {
      record: baselineMapping("documentation", "cnt_000415", "blogs", "news", 45, "valid-slug"),
      pattern: /baseline record targetFamily must equal descriptor target family: blog/,
    },
    {
      record: baselineMapping("news", "cnt_000416", "news", "news", 46, "..\/escape", "safe-source"),
      pattern: /baseline record has unsafe targetSlug/,
    },
    {
      record: baselineMapping("news", "cnt_000417", "news", "news", "47", "valid-slug"),
      pattern: /baseline record targetId must be a positive integer number/,
    },
    {
      record: baselineMapping("news", "cnt_000418", "news", "news", 0, "valid-slug"),
      pattern: /baseline record targetId must be a positive integer number/,
    },
  ];

  for (const { record, pattern } of cases) {
    await withTempRepos(async ({ targetRepo }) => {
      await writeManifest(targetRepo, "baseline", [record]);
      let statCalled = false;
      await assert.rejects(
        () => buildJapanInventory({
          targetRepo,
          prRecords: [],
          statFile: async () => {
            statCalled = true;
            return { isFile: () => true };
          },
        }),
        pattern,
      );
      assert.equal(statCalled, false);
    });
  }
});

test("rejects target ownership conflicts across trusted mappings", async () => {
  await withTempRepos(async ({ targetRepo }) => {
    await writeManifest(targetRepo, "baseline", [
      baselineMapping("news", "cnt_000410", "news", "news", 41, "first"),
    ]);
    await writeTargetFile(targetRepo, "src/content/news/41-first.mdx");

    await assert.rejects(
      () => buildJapanInventory({
        targetRepo,
        prRecords: [mergedMarker("news", "cnt_000411", "news", 41)],
      }),
      /target mapping conflict: news:41 is claimed by news:cnt_000410 and news:cnt_000411/,
    );
  });

  await withTempRepos(async ({ targetRepo }) => {
    await writeManifest(targetRepo, "baseline", [
      baselineMapping("news", "cnt_000412", "news", "news", 42, "first"),
      baselineMapping("news", "cnt_000413", "news", "news", 42, "second"),
    ]);
    await assert.rejects(
      () => buildJapanInventory({ targetRepo, prRecords: [] }),
      /duplicate target identity|target mapping conflict/,
    );
  });
});

test("propagates non-ENOENT target stat failures and requires a regular file", async () => {
  await withTempRepos(async ({ targetRepo }) => {
    await writeManifest(targetRepo, "baseline", [
      baselineMapping("news", "cnt_000420", "news", "news", 42, "target"),
    ]);
    const denied = Object.assign(new Error("denied"), { code: "EACCES" });
    await assert.rejects(
      () => buildJapanInventory({ targetRepo, prRecords: [], statFile: async () => { throw denied; } }),
      /denied/,
    );
  });

  await withTempRepos(async ({ targetRepo }) => {
    await writeManifest(targetRepo, "baseline", [
      baselineMapping("news", "cnt_000421", "news", "news", 43, "directory"),
    ]);
    await mkdir(path.join(targetRepo, "src/content/news/43-directory.mdx"), { recursive: true });
    const inventory = await buildJapanInventory({ targetRepo, prRecords: [] });
    assert.equal(inventory.present.size, 0);
    assert.equal(inventory.mappingDrift.has("news:cnt_000421"), true);
  });
});

test("rejects untrusted merged marker branch and target shapes", async () => {
  const invalidPulls = [
    { ...mergedMarker("news", "cnt_000430", "news", 43), headRefName: "content-sync/news-cnt_999999" },
    { ...mergedMarker("news", "cnt_000431", "news", 44), body: markerBody({ sourceSection: "news", sourceId: "cnt_000431", targetFamily: "unsupported", targetId: 44, branch: branchName("news", "cnt_000431") }) },
    { ...mergedMarker("news", "cnt_000432", "news", 45), body: markerBody({ sourceSection: "news", sourceId: "cnt_000432", targetFamily: "news", targetId: 0, branch: branchName("news", "cnt_000432") }) },
    { ...mergedMarker("news", "cnt_000433", "news", 46), body: markerBody({ sourceSection: "news", sourceId: "cnt_000433", targetFamily: "news", targetId: 46, branch: branchName("documentation", "cnt_000433") }), headRefName: branchName("documentation", "cnt_000433") },
    { ...legacyMergedMarker("cnt_000434", "news", 47), number: 688 },
  ];

  for (const pull of invalidPulls) {
    await withTempRepos(async ({ targetRepo }) => {
      await writeManifest(targetRepo, "baseline", []);
      await assert.rejects(
        () => buildJapanInventory({ targetRepo, prRecords: [pull] }),
        /invalid merged mapping PR/,
      );
    });
  }
});

test("retains documented legacy merged marker #687", async () => {
  await withTempRepos(async ({ targetRepo }) => {
    await writeManifest(targetRepo, "baseline", []);
    await writeTargetFile(targetRepo, "src/content/news/19-legacy.mdx");
    const inventory = await buildJapanInventory({
      targetRepo,
      prRecords: [{ ...legacyMergedMarker("cnt_000212", "news", 19), number: 687 }],
    });
    assert.equal(inventory.present.has("news:cnt_000212"), true);
  });
});

test("baseline mappings require the exact recorded target path", async () => {
  const report = await fixtureWith({
    global: [publishedNews("cnt_000402", "same-id")],
    japan: [baselineMapping("news", "cnt_000402", "news", "news", 18, "canonical-slug", "same-id")],
    targetFiles: ["src/content/news/18-other-slug.mdx"],
  });

  assert.equal(report.items[0].status, "Untracked");
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

test("renders status-first collapsible containers and original links", () => {
  const report = reportWithSevenItems();
  const [payload] = buildSlackPayloads(report, slackMetadata);

  assert.equal(payload.blocks[0].text.text, "🌐 Global-only content report");
  assert.equal(
    payload.blocks[1].text.text,
    "Global published 7 · Japan present 0 · Global-only 7 · Blog 2 · Whitepapers 2 · News 3",
  );
  const containers = payload.blocks.filter((block) => block.type === "container");
  assert.deepEqual(containers.map((block) => block.title.text), ["Untracked · 7 items"]);
  assert.equal(containers[0].default_collapsed, false);
  assert.match(containers[0].child_blocks[0].text.text, /^\*Blog\* · `documentation:cnt_000004` · 2026-04-04 · Untracked/);
  assert.match(containers[0].child_blocks[0].text.text, /<https:\/\/finance\.yahoo\.com\/story-4\|QueryPie selected/);
  assert.doesNotMatch(containers[0].title.text, /:newspaper:|📰/);
  assert.match(containers[0].child_blocks[0].text.text, /&amp; &lt;4&gt;/);
  assert.match(JSON.stringify(payload), /Part 1 of 1/);
  assert.match(JSON.stringify(payload.blocks.slice(0, 3)), /2026-04-30T00:00:00\.000Z/);
  assert.doesNotMatch(JSON.stringify(payload), /button|ignore_content|<@|Draft open|Draft closed|Mapping drift/i);

  const longTitleBlock = containers
    .flatMap((block) => block.child_blocks)
    .find((block) => block.text.text.includes("A very long title"));
  const renderedTitle = longTitleBlock.text.text.split("|", 2)[1].split(">", 1)[0];
  assert.equal(renderedTitle.length, 180);
});

test("paginates without dropping or duplicating identities", () => {
  const report = reportWithItems(83);
  const payloads = buildSlackPayloads(report, slackMetadata);
  const rendered = JSON.stringify(payloads);

  for (const item of report.items) {
    assert.equal(rendered.split(item.identity).length - 1, 1);
  }

  assert.match(payloads[0].text, /Part 1 of/);
  assert.equal(payloads.length, 2);
});

function reportWithMixedStatuses() {
  return {
    ...reportWithItems(6),
    familyCounts: { news: 3, blog: 2, whitepapers: 1 },
    items: [
      reportItem(1, { targetFamily: "news", dateIso: "2026-04-06", status: "Ignored" }),
      reportItem(2, { targetFamily: "blog", identity: "documentation:cnt_000002", sourceSection: "documentation", sourceCategory: "blogs", targetFamily: "blog", dateIso: "2026-04-05", status: "Untracked" }),
      reportItem(3, { targetFamily: "whitepapers", identity: "documentation:cnt_000003", sourceSection: "documentation", sourceCategory: "white-papers", targetFamily: "whitepapers", dateIso: "2026-04-04", status: "Ignored" }),
      reportItem(4, { targetFamily: "news", dateIso: "2026-04-03", status: "Untracked" }),
      reportItem(5, { targetFamily: "blog", identity: "documentation:cnt_000005", sourceSection: "documentation", sourceCategory: "blogs", targetFamily: "blog", dateIso: "2026-04-02", status: "Ignored" }),
      reportItem(6, { targetFamily: "news", dateIso: "2026-04-01", status: "Untracked" }),
    ],
  };
}

test("renders a compact zero-difference success", () => {
  const [payload] = buildSlackPayloads(emptyReport(), slackMetadata);

  assert.match(payload.text, /No Global-only content/);
  assert.match(JSON.stringify(payload), /2026-04-30T00:00:00\.000Z/);
  assert.equal(payload.blocks.some(({ type }) => type === "container"), false);
});

test("groups by status first, then target family order, then newest date", () => {
  const [payload] = buildSlackPayloads(reportWithMixedStatuses(), slackMetadata);
  const containers = payload.blocks.filter((block) => block.type === "container");

  assert.deepEqual(containers.map((block) => block.title.text), [
    "Untracked · 3 items",
    "Ignored · 3 items",
  ]);
  assert.equal(containers[0].default_collapsed, false);
  assert.equal(containers[1].default_collapsed, true);
  assert.match(containers[0].child_blocks[0].text.text, /^\*Blog\* · `documentation:cnt_000002` · 2026-04-05 · Untracked/);
  assert.match(containers[0].child_blocks[1].text.text, /^\*News\* · `news:cnt_000004` · 2026-04-03 · Untracked/);
  assert.match(containers[0].child_blocks[2].text.text, /^\*News\* · `news:cnt_000006` · 2026-04-01 · Untracked/);
  assert.match(containers[1].child_blocks[0].text.text, /^\*Blog\* · `documentation:cnt_000005` · 2026-04-02 · Ignored/);
  assert.match(containers[1].child_blocks[1].text.text, /^\*Whitepapers\* · `documentation:cnt_000003` · 2026-04-04 · Ignored/);
  assert.match(containers[1].child_blocks[2].text.text, /^\*News\* · `news:cnt_000001` · 2026-04-06 · Ignored/);
  assert.doesNotMatch(JSON.stringify(payload), /Draft open|Draft closed|Mapping drift/);
});

test("rejects non-Slack webhook URLs", async () => {
  await assert.rejects(
    () => sendSlackPayloads({
      webhookUrl: "https://example.com/services/T000/B000/XXXX",
      payloads: [{ text: "fixture", blocks: [] }],
      fetchImpl: async () => {
        throw new Error("should not fetch");
      },
    }),
    /GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL must be a Slack Incoming Webhook URL/,
  );
});

test("propagates webhook failures", async () => {
  await assert.rejects(
    () => sendSlackPayloads({
      webhookUrl: "https://hooks.slack.com/services/T000/B000/XXXX",
      payloads: [{ text: "fixture", blocks: [] }],
      fetchImpl: async () => ({ ok: false, status: 500, text: async () => "nope" }),
    }),
    /Slack rejected Global content diff payload: HTTP 500/,
  );
});
