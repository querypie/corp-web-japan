import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

import { readSource, sourcePath } from "./helpers/source-readers.mjs";

const mdxPublicationRoots = [
  "src/content/blog",
  "src/content/whitepapers",
  "src/content/news",
  "src/content/events",
  "src/content/use-cases",
  "src/content/demo/aip",
  "src/content/demo/acp",
  "src/content/introduction-deck",
  "src/content/glossary",
  "src/content/manuals",
];

const mdxDetailRoutes = [
  "src/app/blog/[id]/[slug]/page.tsx",
  "src/app/whitepapers/[id]/[slug]/page.tsx",
  "src/app/news/[id]/[slug]/page.tsx",
  "src/app/events/[id]/[slug]/page.tsx",
  "src/app/use-cases/[id]/[slug]/page.tsx",
  "src/app/demo/aip/[id]/[slug]/page.tsx",
  "src/app/demo/acp/[id]/[slug]/page.tsx",
  "src/app/introduction-deck/[id]/[slug]/page.tsx",
  "src/app/glossary/[id]/[slug]/page.tsx",
  "src/app/manuals/[id]/[slug]/page.tsx",
];

function listMdxFiles(root) {
  return readdirSync(sourcePath(root))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => `${root}/${file}`);
}

function readFrontmatter(relativePath) {
  const source = readSource(relativePath);
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  assert.ok(match, `${relativePath} should have frontmatter`);
  return parseYaml(match[1]);
}

test("public MDX detail routes expose Open Graph and Twitter preview metadata", () => {
  const helper = readSource("src/lib/publications/metadata.ts");
  assert.match(helper, /openGraph:/);
  assert.match(helper, /twitter:/);
  assert.match(helper, /OPEN_GRAPH_PNG_IMAGE_PATTERN/);
  assert.match(helper, /resolvePublicationOpenGraphImageSrc/);

  for (const routePath of mdxDetailRoutes) {
    const source = readSource(routePath);
    assert.match(source, /buildPublicationOpenGraphMetadata/, `${routePath} should build OG metadata`);
    assert.match(
      source,
      /imageSrc: resolvePublicationOpenGraphImageSrc\(record\)/,
      `${routePath} should prefer openGraphImageSrc over heroImageSrc`,
    );
  }
});

test("public MDX effective Open Graph images are existing PNG files", () => {
  const publicRoot = sourcePath("public");

  for (const root of mdxPublicationRoots) {
    for (const relativePath of listMdxFiles(root)) {
      const frontmatter = readFrontmatter(relativePath);
      const heroImageSrc = String(frontmatter.heroImageSrc ?? "");
      const openGraphImageSrc = typeof frontmatter.openGraphImageSrc === "string"
        ? frontmatter.openGraphImageSrc
        : null;
      const effectiveOpenGraphImageSrc = openGraphImageSrc ?? heroImageSrc;

      assert.ok(heroImageSrc.startsWith("/"), `${relativePath} should use a public-root heroImageSrc`);
      assert.match(
        effectiveOpenGraphImageSrc,
        /\.png(?:[?#].*)?$/i,
        `${relativePath} should use a PNG effective Open Graph image`,
      );
      assert.equal(
        existsSync(join(publicRoot, effectiveOpenGraphImageSrc.slice(1))),
        true,
        `${relativePath} should reference an existing effective Open Graph image`,
      );

      if (!/\.png(?:[?#].*)?$/i.test(heroImageSrc)) {
        assert.ok(openGraphImageSrc, `${relativePath} should add openGraphImageSrc when heroImageSrc is not PNG`);
      }
    }
  }
});
