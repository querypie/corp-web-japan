import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper gating uses gated frontmatter and a GatingCut component instead of the legacy ArticleGatingForm wrapper", () => {
  const whitepaper24 = readSource("src/content/whitepapers/24.mdx");
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");

  assert.match(whitepaper24, /\ngated:\s*true\n/);
  assert.match(whitepaper24, /<GatingCut\s*\/>/);
  assert.doesNotMatch(whitepaper24, /<ArticleGatingForm>/);
  assert.doesNotMatch(whitepaper24, /<\/ArticleGatingForm>/);
  assert.match(mdxComponents, /function GatingCut\(/);
});

test("whitepaper publication loader carries a dedicated gated MDX contract", () => {
  const loader = readSource("src/lib/publications/get-whitepaper-publication-post.ts");
  const publicationTypes = readSource("src/lib/publications/types.ts");
  const publicationPage = readSource("src/components/PublicationPostPage.tsx");

  assert.match(loader, /gatedBodyMdx/);
  assert.match(loader, /contentKey/);
  assert.match(publicationTypes, /gatedBodyMdx: ReactNode \| null;/);
  assert.match(publicationTypes, /gating: PublicationPostGating \| null;/);
  assert.match(publicationPage, /post\.gating \? \(/);
});

test("internal gating demo page exists as an MDX-backed route under \/internal", () => {
  const internalPage = readSource("src/app/internal/whitepaper-gating-demo/page.tsx");
  const internalMdx = readSource("src/content/internal/whitepaper-gating-demo.mdx");

  assert.match(internalPage, /whitepaper-gating-demo/);
  assert.match(internalMdx, /\ngated:\s*true\n/);
  assert.match(internalMdx, /<GatingCut\s*\/>/);
});
