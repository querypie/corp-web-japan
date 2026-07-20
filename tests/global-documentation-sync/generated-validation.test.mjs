import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateGeneratedPublication } from "../../scripts/global-documentation-sync/generated-validation.mjs";

const frontmatter = (hero = "/blog/1/thumbnail.png") => `---\nid: "1"\nslug: one\ntitle: テスト\ndescription: 説明\ndate: "2026-01-01"\nheroImageSrc: ${hero}\n---\n`;

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
