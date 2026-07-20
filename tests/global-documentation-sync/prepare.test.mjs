import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { assetHrefs, prepare } from "../../scripts/global-documentation-sync/cli.mjs";

test("collects only declared Global public media paths", () => {
  const assets = assetHrefs(
    { imageSrc: "/news/hero.webp", downloadPdfSrc: "/shared/guide.pdf" },
    '<img src="/documentation/blogs/figure.webp"><a href="/blog/article">Read</a>',
  );
  assert.deepEqual(assets, ["/news/hero.webp", "/shared/guide.pdf", "/documentation/blogs/figure.webp"]);
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
