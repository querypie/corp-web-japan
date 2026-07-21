import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { assetHrefs, prepare } from "../../scripts/global-documentation-sync/cli.mjs";

async function seedNewsSource(globalRepo, sourceId, slug, overrides = {}) {
  const source = path.join(globalRepo, "src/content/news", sourceId);
  await mkdir(source, { recursive: true });
  const meta = {
    storageId: sourceId,
    id: slug,
    categorySlug: "news",
    status: "published",
    contentType: "content",
    title: { ja: "ニュース1" },
    summary: { ja: "要約1" },
    relatedIds: [],
    ...overrides,
  };
  await writeFile(path.join(source, "meta.json"), JSON.stringify(meta));
  if (meta.contentType === "content") {
    await writeFile(path.join(source, "ja.html"), "<h1>ニュース1</h1>\n<p>本文</p>\n");
  }
  return { source, meta };
}

test("collects only declared Global public media paths", () => {
  const assets = assetHrefs(
    { imageSrc: "/news/hero.webp", downloadPdfSrc: "/shared/guide.pdf" },
    '<img src="/documentation/blogs/figure.webp"><a href="/blog/article">Read</a>',
  );
  assert.deepEqual(assets, ["/news/hero.webp", "/shared/guide.pdf", "/documentation/blogs/figure.webp"]);
});

test("prepares News content and outlink candidates with section-neutral production evidence", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "prepare-news-"));
  const globalRepo = path.join(root, "global");
  const targetRepo = path.join(root, "target");
  const reportsDir = path.join(root, "reports");
  const targetContentRoot = path.join(targetRepo, "src/content/news");
  await mkdir(targetContentRoot, { recursive: true });

  await seedNewsSource(globalRepo, "cnt_19", "news-one");
  await seedNewsSource(globalRepo, "cnt_20", "news-outlink", {
    contentType: "outlink",
    externalUrl: "https://media.example/news-one",
  });

  const contentEvidencePath = path.join(root, "content-evidence.json");
  await writeFile(contentEvidencePath, JSON.stringify({
    sourceId: "cnt_19",
    production: {
      canonicalUrl: "https://www.querypie.com/en/news/news-one",
      listed: true,
      listUrl: "https://www.querypie.com/en/news",
      sitemap: true,
    },
  }));
  const outlinkEvidencePath = path.join(root, "outlink-evidence.json");
  await writeFile(outlinkEvidencePath, JSON.stringify({
    sourceId: "cnt_20",
    production: {
      canonicalUrl: "https://media.example/news-one",
      listed: true,
      listUrl: "https://www.querypie.com/en/news",
      sitemap: false,
    },
  }));

  const { candidate: contentCandidate } = await prepare({
    dryRun: true,
    sourceId: "cnt_19",
    targetId: "19",
    globalRepo,
    targetRepo,
    reportsDir: path.join(reportsDir, "content"),
    productionEvidenceFile: contentEvidencePath,
  });
  const { candidate: outlinkCandidate } = await prepare({
    dryRun: true,
    sourceId: "cnt_20",
    targetId: "20",
    globalRepo,
    targetRepo,
    reportsDir: path.join(reportsDir, "outlink"),
    productionEvidenceFile: outlinkEvidencePath,
  });

  assert.equal(contentCandidate.sourceSection, "news");
  assert.equal(contentCandidate.targetFamily, "news");
  assert.equal(contentCandidate.resolvedSourceLabel, "公式発表");
  assert.equal(contentCandidate.resolvedRedirectUrl, null);
  assert.match(contentCandidate.targetMdxPath, /src\/content\/news\/19-news-one\.mdx$/);
  assert.deepEqual(contentCandidate.production, {
    canonicalUrl: "https://www.querypie.com/en/news/news-one",
    listed: true,
    listUrl: "https://www.querypie.com/en/news",
    sitemap: true,
  });

  assert.equal(outlinkCandidate.resolvedSourceLabel, "メディア掲載");
  assert.equal(outlinkCandidate.resolvedRedirectUrl, "https://media.example/news-one");
  assert.equal(outlinkCandidate.resolvedAuthor, null);
  assert.deepEqual(outlinkCandidate.production, {
    canonicalUrl: "https://media.example/news-one",
    listed: true,
    listUrl: "https://www.querypie.com/en/news",
    sitemap: false,
  });
});

test("prepares a published HTTPS outlink without a locale HTML file", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "prepare-outlink-"));
  const globalRepo = path.join(root, "global");
  const targetRepo = path.join(root, "target");
  const reportsDir = path.join(root, "reports");
  const source = path.join(globalRepo, "src/content/documentation/manuals/cnt_1");
  await mkdir(source, { recursive: true });
  await mkdir(path.join(globalRepo, "public/documentation/manuals"), { recursive: true });
  await mkdir(path.join(targetRepo, "src/content/manuals"), { recursive: true });
  await writeFile(path.join(globalRepo, "public/documentation/manuals/cover.webp"), "image");
  const staleMdx = path.join(targetRepo, "src/content/manuals/1-old-slug.mdx");
  await writeFile(staleMdx, "stale");
  await writeFile(path.join(source, "meta.json"), JSON.stringify({
    storageId: "cnt_1", id: "manual", categorySlug: "manuals", status: "published",
    contentType: "outlink", externalUrl: "https://docs.example.com/ja/manual",
    imageSrc: "", title: { ja: "マニュアル" },
    summary: { ja: "説明" }, relatedIds: [],
  }));
  const { candidate } = await prepare({ dryRun: true, productionCheck: false, sourceId: "cnt_1", targetId: "1", resetTarget: "true", globalRepo, targetRepo, reportsDir });
  assert.equal(candidate.sourceLocale, "ja");
  assert.equal(candidate.meta.contentType, "outlink");
  assert.match(candidate.sourceHtmlPath, /source\.html$/);
  await assert.rejects(() => access(staleMdx));
  assert.match(candidate.targetMdxPath, /1-manual\.mdx$/);
});
