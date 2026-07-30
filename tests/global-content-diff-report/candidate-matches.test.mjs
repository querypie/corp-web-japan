import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  findPossibleJapanMatches,
  indexJapanCandidateRecords,
  normalizeCandidateText,
  normalizeCandidateUrl,
} from "../../scripts/global-content-diff-report/candidate-matches.mjs";

async function withTargetRepo(run) {
  const targetRepo = await mkdtemp(path.join(os.tmpdir(), "candidate-matches-"));
  try {
    return await run(targetRepo);
  } finally {
    await rm(targetRepo, { recursive: true, force: true });
  }
}

async function writeMdx(targetRepo, family, name, frontmatter, body = "") {
  const file = path.join(targetRepo, "src/content", family, name);
  await mkdir(path.dirname(file), { recursive: true });
  const lines = ["---", ...Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`), "---", body];
  await writeFile(file, `${lines.join("\n")}\n`);
}

const fdeItem = {
  targetFamily: "blog",
  sourceSlug: "what-is-forward-deployed-engineer-fde",
  sourceUrls: [],
  originalTitle: "What is Forward Deployed Engineer (FDE)?",
  dateIso: "2026-02-03",
};

test("normalizes candidate text with NFC, trim, and whitespace collapse only", () => {
  assert.equal(normalizeCandidateText("  Cafe\u0301\n\t au   lait  "), "Café au lait");
  assert.equal(normalizeCandidateText("QueryPie, Inc."), "QueryPie, Inc.");
});

test("normalizes HTTPS URLs by removing only tracking params while preserving identity-bearing query", () => {
  assert.equal(
    normalizeCandidateUrl("https://EXAMPLE.com/article.html?utm_source=x&no=169&guccounter=1&lang=en#section"),
    "https://example.com/article.html?lang=en&no=169",
  );
  assert.equal(
    normalizeCandidateUrl("https://example.com/article.html?no=169"),
    "https://example.com/article.html?no=169",
  );
  assert.equal(
    normalizeCandidateUrl("https://example.com/article.html?no=170"),
    "https://example.com/article.html?no=170",
  );
  assert.equal(normalizeCandidateUrl("http://example.com/article"), null);
  assert.equal(normalizeCandidateUrl("not a url"), null);
});

test("finds an exact slug candidate without changing ambiguous shape", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "blog", "33-what-is-forward-deployed-engineer-fde.mdx", {
      id: "33",
      slug: "what-is-forward-deployed-engineer-fde",
      title: "FDEとは？",
      date: "2026-02-03",
    });

    const japanIndex = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["blog"] });
    const matches = findPossibleJapanMatches({ globalItem: fdeItem, japanIndex });

    assert.deepEqual(matches, [{
      targetPath: "src/content/blog/33-what-is-forward-deployed-engineer-fde.mdx",
      targetId: 33,
      targetSlug: "what-is-forward-deployed-engineer-fde",
      signals: ["exact-slug"],
    }]);
  });
});

test("finds exact source URL after tracking allowlist removal and query sorting", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "news", "5-renamed-local-slug.mdx", {
      id: "5",
      slug: "renamed-local-slug",
      title: "News",
      date: "2026-02-04",
    }, "<a href=\"https://Media.Example.com/article.html?guce_referrer=x&no=169&utm_campaign=y&lang=en#top\">source</a>");

    const japanIndex = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["news"] });
    const matches = findPossibleJapanMatches({
      globalItem: {
        targetFamily: "news",
        sourceSlug: "global-news-slug",
        sourceUrls: ["https://media.example.com/article.html?lang=en&no=169"],
        originalTitle: "Different title",
        dateIso: "2026-02-04",
      },
      japanIndex,
    });

    assert.deepEqual(matches, [{
      targetPath: "src/content/news/5-renamed-local-slug.mdx",
      targetId: 5,
      targetSlug: "renamed-local-slug",
      signals: ["exact-source-url"],
    }]);
  });
});

test("preserves identity-bearing query parameters and rejects partial URL matches", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "news", "6-query-identity.mdx", {
      id: "6",
      slug: "query-identity",
      title: "News",
      date: "2026-02-04",
    }, "https://media.example.com/article.html?no=169");

    const japanIndex = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["news"] });
    const matches = findPossibleJapanMatches({
      globalItem: {
        targetFamily: "news",
        sourceSlug: "different",
        sourceUrls: ["https://media.example.com/article.html?no=170"],
        originalTitle: "News",
        dateIso: "2026-02-05",
      },
      japanIndex,
    });

    assert.deepEqual(matches, []);
  });
});

test("finds exact original English title plus date in raw MDX", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "news", "7-title-date.mdx", {
      id: "7",
      slug: "title-date",
      title: "Japanese title",
      date: "2026-03-01T09:00:00.000Z",
    }, "Original source title: QueryPie Announces ACP 5.0");

    const japanIndex = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["news"] });
    const matches = findPossibleJapanMatches({
      globalItem: {
        targetFamily: "news",
        sourceSlug: "no-slug-match",
        sourceUrls: [],
        originalTitle: "QueryPie Announces ACP 5.0",
        dateIso: "2026-03-01",
      },
      japanIndex,
    });

    assert.deepEqual(matches, [{
      targetPath: "src/content/news/7-title-date.mdx",
      targetId: 7,
      targetSlug: "title-date",
      signals: ["exact-original-title-and-date"],
    }]);
  });
});

test("isolates candidates to the requested target family", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "news", "8-same-slug.mdx", { id: "8", slug: "same-slug", title: "News", date: "2026-01-01" });
    await writeMdx(targetRepo, "blog", "8-same-slug.mdx", { id: "8", slug: "same-slug", title: "Blog", date: "2026-01-01" });

    const japanIndex = await indexJapanCandidateRecords({ targetRepo });
    const matches = findPossibleJapanMatches({
      globalItem: { targetFamily: "blog", sourceSlug: "same-slug", sourceUrls: [], originalTitle: "Same", dateIso: "2026-01-01" },
      japanIndex,
    });

    assert.deepEqual(matches.map(({ targetPath }) => targetPath), ["src/content/blog/8-same-slug.mdx"]);
  });
});

test("rejects partial slug and partial title matches", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "blog", "9-partial.mdx", {
      id: "9",
      slug: "what-is-forward-deployed-engineer-fde-overview",
      title: "Partial",
      date: "2026-02-03",
    }, "What is Forward Deployed Engineer");

    const japanIndex = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["blog"] });
    const matches = findPossibleJapanMatches({ globalItem: fdeItem, japanIndex });

    assert.deepEqual(matches, []);
  });
});

test("returns same-slug duplicates as multiple deterministic candidates", async () => {
  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "blog", "10-duplicate-slug-a.mdx", { id: "10", slug: "duplicate-slug", title: "A", date: "2026-01-01" });
    await writeMdx(targetRepo, "blog", "11-duplicate-slug-b.mdx", { id: "11", slug: "duplicate-slug", title: "B", date: "2026-01-01" });

    const japanIndex = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["blog"] });
    const matches = findPossibleJapanMatches({
      globalItem: { targetFamily: "blog", sourceSlug: "duplicate-slug", sourceUrls: [], originalTitle: "Duplicate", dateIso: "2026-01-01" },
      japanIndex,
    });

    assert.deepEqual(matches.map(({ targetId, signals }) => ({ targetId, signals })), [
      { targetId: 10, signals: ["exact-slug"] },
      { targetId: 11, signals: ["exact-slug"] },
    ]);
  });
});

test("fails closed on malformed MDX, duplicate target identity, and duplicate target path", async () => {
  await withTargetRepo(async (targetRepo) => {
    await mkdir(path.join(targetRepo, "src/content/news"), { recursive: true });
    await writeFile(path.join(targetRepo, "src/content/news/broken.mdx"), "---\nid: [\n---\n");
    await assert.rejects(
      () => indexJapanCandidateRecords({ targetRepo, targetFamilies: ["news"] }),
      /invalid MDX frontmatter/,
    );
  });

  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "news", "12-a.mdx", { id: "12", slug: "a", title: "A", date: "2026-01-01" });
    await writeMdx(targetRepo, "news", "12-b.mdx", { id: "12", slug: "b", title: "B", date: "2026-01-01" });
    await assert.rejects(
      () => indexJapanCandidateRecords({ targetRepo, targetFamilies: ["news"] }),
      /duplicate Japan target identity: news:12/,
    );
  });

  await withTargetRepo(async (targetRepo) => {
    await writeMdx(targetRepo, "news", "13-a.mdx", { id: "13", slug: "a", title: "A", date: "2026-01-01" });
    const index = await indexJapanCandidateRecords({ targetRepo, targetFamilies: ["news"] });
    index.records.push({ ...index.records[0], targetId: 14 });
    assert.throws(
      () => findPossibleJapanMatches({
        globalItem: { targetFamily: "news", sourceSlug: "a", sourceUrls: [], originalTitle: "A", dateIso: "2026-01-01" },
        japanIndex: index,
      }),
      /duplicate Japan target path: src\/content\/news\/13-a\.mdx/,
    );
  });
});
