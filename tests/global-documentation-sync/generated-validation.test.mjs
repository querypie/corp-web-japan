import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateGeneratedPublication } from "../../scripts/global-documentation-sync/generated-validation.mjs";

const frontmatter = (hero = "/blog/1/thumbnail.png") => `---\nid: "1"\nslug: one\ntitle: テスト\ndescription: 説明\ndate: "2026-01-01"\nheroImageSrc: ${hero}\n---\n`;

const newsFrontmatter = (extra = "") => `---\nid: "1"\nslug: one\ntitle: ニュース\ndescription: 説明\ndate: "2026-01-01"\nheroImageSrc: "/news/1/thumbnail.png"\n${extra}---\n`;

test("accepts route-aligned local assets and rejects unresolved source paths or Korean residue", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "generated-validation-"));
  const assetRoot = path.join(root, "public/blog/1");
  const mdx = path.join(root, "src/content/blog/1-one.mdx");
  await mkdir(assetRoot, { recursive: true });
  await mkdir(path.dirname(mdx), { recursive: true });
  await writeFile(path.join(assetRoot, "thumbnail.png"), "png");
  await writeFile(path.join(assetRoot, "figure.webp"), "webp");
  const candidate = { targetRepo: root, targetFamily: "blog", targetId: 1, targetMdxPath: mdx, targetAssetRoot: assetRoot, heroImagePath: path.join(assetRoot, "thumbnail.png"), heroImagePublicPath: "/blog/1/thumbnail.png", resolvedAuthor: null, meta: { id: "one", hideHeroImage: false, relatedIds: [] }, externalMedia: [], assets: [{ targetPath: path.join(assetRoot, "figure.webp"), targetPublicPath: "/blog/1/figure.webp", sha256: createHash("sha256").update("webp").digest("hex") }] };
  await writeFile(mdx, `${frontmatter()}\n![図](/blog/1/figure.webp)\n`);
  assert.equal((await validateGeneratedPublication(candidate, { intentionalTransformations: [] })).status, "passed");
  await writeFile(mdx, frontmatter("/whitepapers/99/thumbnail.png"));
  await assert.rejects(() => validateGeneratedPublication(candidate, { intentionalTransformations: [] }), /allocated hero/);
  await writeFile(mdx, `${frontmatter()}\n<iframe src="https://attacker.example/video"></iframe>\n`);
  await assert.rejects(() => validateGeneratedPublication(candidate, { intentionalTransformations: [] }), /approved|source-approved/);
  await writeFile(mdx, `${frontmatter()}\n<img src={"https://attacker.example/x.png"} />\n`);
  await assert.rejects(() => validateGeneratedPublication(candidate, { intentionalTransformations: [] }), /remote images/);
  await writeFile(mdx, `${frontmatter()}\n<img src="/footer-assets/social-x.svg" />\n`);
  await assert.rejects(() => validateGeneratedPublication(candidate, { intentionalTransformations: [] }), /cross-publication/);
  await writeFile(mdx, `${frontmatter()}\n![](/blog/999/foreign.webp)\n`);
  await assert.rejects(() => validateGeneratedPublication(candidate, { intentionalTransformations: [] }), /cross-publication/);
  await writeFile(mdx, `${frontmatter()}\n/documentation/blogs/a.webp\n한국어\n`);
  await assert.rejects(() => validateGeneratedPublication(candidate, { intentionalTransformations: [] }), /documentation|Korean/);
});

test("enforces resolved News frontmatter contract for content and outlinks", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "generated-validation-news-"));
  const assetRoot = path.join(root, "public/news/1");
  const mdx = path.join(root, "src/content/news/1-one.mdx");
  await mkdir(assetRoot, { recursive: true });
  await mkdir(path.dirname(mdx), { recursive: true });
  await writeFile(path.join(assetRoot, "thumbnail.png"), "png");
  const base = {
    targetRepo: root,
    targetFamily: "news",
    targetId: 1,
    targetMdxPath: mdx,
    targetAssetRoot: assetRoot,
    heroImagePath: path.join(assetRoot, "thumbnail.png"),
    heroImagePublicPath: "/news/1/thumbnail.png",
    resolvedAuthor: null,
    externalMedia: [],
    assets: [],
  };
  const contentCandidate = {
    ...base,
    meta: { id: "one", hideHeroImage: false, relatedIds: ["2"] },
    resolvedSourceLabel: "公式発表",
    resolvedRedirectUrl: null,
  };
  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "公式発表"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  assert.equal((await validateGeneratedPublication(contentCandidate, { intentionalTransformations: [] })).status, "passed");

  const outlinkCandidate = {
    ...base,
    meta: { id: "one", hideHeroImage: false, relatedIds: ["2"] },
    resolvedSourceLabel: "メディア掲載",
    resolvedRedirectUrl: "https://media.example/news-one",
  };
  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "メディア掲載"\nredirectUrl: "https://media.example/news-one"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  assert.equal((await validateGeneratedPublication(outlinkCandidate, { intentionalTransformations: [] })).status, "passed");

  await writeFile(mdx, `${newsFrontmatter('author: "querypie"\nsourceLabel: "公式発表"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  await assert.rejects(() => validateGeneratedPublication(contentCandidate, { intentionalTransformations: [] }), /author is unsupported/);

  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "メディア掲載"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  await assert.rejects(() => validateGeneratedPublication(contentCandidate, { intentionalTransformations: [] }), /sourceLabel/);

  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "公式発表"\nredirectUrl: "https://media.example/news-one"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  await assert.rejects(() => validateGeneratedPublication(contentCandidate, { intentionalTransformations: [] }), /redirectUrl/);

  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "メディア掲載"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  await assert.rejects(() => validateGeneratedPublication(outlinkCandidate, { intentionalTransformations: [] }), /redirectUrl/);

  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "メディア掲載"\nredirectUrl: "http://media.example/news-one"\nrelatedIds:\n  - "2"\n')}\n本文\n`);
  await assert.rejects(() => validateGeneratedPublication(outlinkCandidate, { intentionalTransformations: [] }), /HTTPS|redirectUrl/);

  await writeFile(mdx, `${newsFrontmatter('sourceLabel: "公式発表"\nrelatedIds:\n  - "999"\n')}\n本文\n`);
  await assert.rejects(() => validateGeneratedPublication(contentCandidate, { intentionalTransformations: [] }), /relatedIds/);
});
