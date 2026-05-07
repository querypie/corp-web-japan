import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("blog publication MDX uses an RSC evaluate renderer instead of compileMDX", () => {
  const publicationLoader = readSource("src/lib/publications/get-publication-post.ts");
  const packageJson = readSource("package.json");

  assert.doesNotMatch(publicationLoader, /compileMDX/);
  assert.doesNotMatch(publicationLoader, /next-mdx-remote\/rsc/);
  assert.doesNotMatch(packageJson, /"next-mdx-remote"/);
  assert.match(packageJson, /"next-mdx-remote-client"/);
});

test("blog publication MDX has dedicated renderer and heading extraction utilities", () => {
  const renderer = readSource("src/lib/publications/mdx/renderer.ts");
  const headings = readSource("src/lib/publications/mdx/headings.ts");

  assert.match(renderer, /from "next-mdx-remote-client\/rsc"/);
  assert.match(renderer, /evaluate/);
  assert.match(renderer, /remarkGfm/);
  assert.match(headings, /extractHeadingsFromMdx/);
  assert.match(headings, /slugifyHeadingText/);
});

test("blog detail page and publication page consume structured MDX toc data", () => {
  const publicationTypes = readSource("src/lib/publications/types.ts");
  const publicationLoader = readSource("src/lib/publications/get-publication-post.ts");
  const publicationPage = readSource("src/components/sections/publication-post-page.tsx");
  const tocComponent = readSource("src/components/sections/resource-post-toc.tsx");

  assert.match(publicationTypes, /toc: PublicationTocItem\[\]/);
  assert.match(publicationLoader, /extractHeadingsFromMdx/);
  assert.match(publicationPage, /post\.toc\.length > 0/);
  assert.match(tocComponent, /items: PublicationTocItem\[\]/);
  assert.doesNotMatch(tocComponent, /dangerouslySetInnerHTML/);
});

test("blog publication metadata lives in MDX frontmatter instead of blog-posts.ts", () => {
  const renderer = readSource("src/lib/publications/mdx/renderer.ts");
  const publicationLoader = readSource("src/lib/publications/get-publication-post.ts");
  const mdx21 = readSource("src/content/blog/21-why-we-need-ai-red-teaming.mdx");
  const mdx22 = readSource("src/content/blog/22-ai-agent-security-replit-case.mdx");
  const mdx23 = readSource("src/content/blog/23-querypie-payroll-partnership.mdx");
  const mdx25 = readSource("src/content/blog/25-terrasky-mitoco-buddy.mdx");
  const mdx27 = readSource("src/content/blog/27-shadow-ai-risk-cxo-countermeasures.mdx");
  const mdx28 = readSource("src/content/blog/28-ai-security-threat-map-2026-cxo.mdx");

  assert.match(renderer, /parseFrontmatter\?:\s*boolean/);
  assert.match(renderer, /\{\s*parseFrontmatter\s*=\s*true\s*\}/);
  assert.match(renderer, /parseFrontmatter,/);
  assert.doesNotMatch(publicationLoader, /content\/publications\/blog-posts/);
  assert.match(publicationLoader, /frontmatter/);

  for (const mdx of [mdx21, mdx22, mdx23, mdx25, mdx27, mdx28]) {
    assert.match(mdx, /^---\nid:/);
    assert.match(mdx, /\nslug:/);
    assert.match(mdx, /\ntitle:/);
    assert.match(mdx, /\ndescription:/);
    assert.match(mdx, /\ndate:/);
    assert.match(mdx, /\nheroImageSrc:/);
    assert.match(mdx, /\nrelatedIds:/);
  }

  assert.match(mdx21, /\nauthor:/);
  assert.match(mdx22, /\nauthor:/);
});
