import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper gating uses gated frontmatter and a GatingCut component instead of the legacy ArticleGatingForm wrapper", () => {
  const whitepaper24 = readSource("src/content/whitepapers/24.mdx");
  const whitepaper30 = readSource("src/content/whitepapers/30.mdx");
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");

  assert.match(whitepaper24, /\ngated:\s*true\n/);
  assert.match(whitepaper24, /<GatingCut\s*\/>/);
  assert.doesNotMatch(whitepaper24, /<ArticleGatingForm>/);
  assert.doesNotMatch(whitepaper24, /<\/ArticleGatingForm>/);
  assert.doesNotMatch(whitepaper24, /https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/24\/.+\/download/);

  assert.match(whitepaper30, /\ngated:\s*true\n/);
  assert.match(whitepaper30, /<GatingCut\s*\/>/);
  assert.doesNotMatch(whitepaper30, /https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/30\/.+\/download/);

  assert.match(mdxComponents, /function GatingCut\(/);
  assert.match(mdxComponents, /function Youtube\(/);
});

test("whitepaper publication loader carries a dedicated gated MDX contract and backend entrypoint", () => {
  const loader = readSource("src/lib/publications/get-whitepaper-publication-post.ts");
  const publicationTypes = readSource("src/lib/publications/types.ts");
  const publicationPage = readSource("src/components/PublicationPostPage.tsx");
  const gatingHelper = readSource("src/lib/publications/gating.ts");
  const gatingRoute = readSource("src/app/api/gating-form/unlock/route.ts");

  assert.match(loader, /gatedBodyMdx/);
  assert.match(loader, /contentKey/);
  assert.match(publicationTypes, /gatedBodyMdx: ReactNode \| null;/);
  assert.match(publicationTypes, /gating: PublicationPostGating \| null;/);
  assert.match(publicationPage, /post\.gating \? \(/);
  assert.match(gatingHelper, /import isProduction from "@\/lib\/is-production"/);
  assert.match(gatingHelper, /PRODUCTION_GATING_MAX_AGE_SECONDS/);
  assert.match(gatingHelper, /NON_PRODUCTION_GATING_MAX_AGE_SECONDS/);
  assert.match(gatingRoute, /submitGatingForm/);
  assert.match(gatingRoute, /response\.cookies\.set/);
});

test("internal gating demo page exists as an MDX-backed route under \/internal", () => {
  const internalPage = readSource("src/app/internal/whitepaper-gating-demo/page.tsx");
  const internalMdx = readSource("src/content/internal/whitepaper-gating-demo.mdx");

  assert.match(internalPage, /whitepaper-gating-demo/);
  assert.match(internalMdx, /\ngated:\s*true\n/);
  assert.match(internalMdx, /<GatingCut\s*\/>/);
});
