import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper gating uses gated frontmatter and a GatingCut component instead of the legacy ArticleGatingForm wrapper", () => {
  const whitepaper13 = readSource("src/content/whitepapers/13-seamless-ssh-connection.mdx");
  const whitepaper14 = readSource("src/content/whitepapers/14-reverse-tunneling-jumphost-solution.mdx");
  const whitepaper24 = readSource("src/content/whitepapers/24-ai-transformation-japan.mdx");
  const whitepaper30 = readSource("src/content/whitepapers/30-saas-end-or-evolution.mdx");
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");

  assert.doesNotMatch(whitepaper13, /\ngated:\s*true\n/);
  assert.doesNotMatch(whitepaper13, /<GatingCut\s*\/>/);
  assert.doesNotMatch(whitepaper13, /<ArticleGatingForm>/);
  assert.doesNotMatch(whitepaper13, /<\/ArticleGatingForm>/);

  assert.doesNotMatch(whitepaper14, /\ngated:\s*true\n/);
  assert.doesNotMatch(whitepaper14, /<GatingCut\s*\/>/);
  assert.doesNotMatch(whitepaper14, /<ArticleGatingForm>/);
  assert.doesNotMatch(whitepaper14, /<\/ArticleGatingForm>/);

  assert.match(whitepaper24, /\ngated:\s*true\n/);
  assert.match(whitepaper24, /<GatingCut\s*\/>/);
  assert.doesNotMatch(whitepaper24, /<ArticleGatingForm>/);
  assert.doesNotMatch(whitepaper24, /<\/ArticleGatingForm>/);
  assert.match(whitepaper24, /downloadCta:\n  href: "\/whitepapers\/24\/download\.pdf"\n  label: "ホワイトペーパーを入手する 🚀"\n  external: true/);
  assert.doesNotMatch(whitepaper24, /<ButtonLink href=/);

  assert.match(whitepaper30, /\ngated:\s*true\n/);
  assert.match(whitepaper30, /<GatingCut\s*\/>/);
  assert.match(whitepaper30, /downloadCta:\n  href: "\/whitepapers\/30\/download\.pdf"\n  label: "ホワイトペーパーを入手する 🚀"\n  external: true/);
  assert.doesNotMatch(whitepaper30, /<ButtonLink href=/);

  assert.match(mdxComponents, /function GatingCut\(/);
  assert.match(mdxComponents, /function Youtube\(/);
});

test("whitepaper publication loader carries a dedicated gated MDX contract and backend entrypoint", () => {
  const loader = readSource("src/lib/publications/whitepapers/get-post.ts");
  const gatedLoader = readSource("src/lib/publications/create-gated-publication-post-loader.ts");
  const publicationTypes = readSource("src/lib/publications/types.ts");
  const publicationPage = readSource("src/components/sections/publication-post-page.tsx");
  const gatingHelper = readSource("src/lib/publications/gating.ts");
  const gatingRoute = readSource("src/app/api/gating-form/unlock/route.ts");

  assert.match(loader, /createGatedPublicationPostLoader/);
  assert.match(loader, /from "@\/lib\/publications\/create-gated-publication-post-loader"/);
  assert.match(gatedLoader, /gatedBodyMdx/);
  assert.match(gatedLoader, /contentKey/);
  assert.match(gatedLoader, /normalizeDownloadCta/);
  assert.match(publicationTypes, /gatedBodyMdx: ReactNode \| null;/);
  assert.match(publicationTypes, /gating: PublicationPostGating \| null;/);
  assert.match(publicationTypes, /downloadCta: PublicationPostDownloadCta \| null;/);
  assert.match(publicationPage, /post\.downloadCta \? <PublicationDownloadCta downloadCta=\{post\.downloadCta\} \/> : null/);
  assert.match(publicationPage, /post\.gating \? \(/);
  assert.match(gatingHelper, /import isProduction from "@\/lib\/is-production"/);
  assert.match(gatingHelper, /PRODUCTION_GATING_MAX_AGE_SECONDS/);
  assert.match(gatingHelper, /NON_PRODUCTION_GATING_MAX_AGE_SECONDS/);
  assert.match(gatingRoute, /submitGatingForm/);
  assert.match(gatingRoute, /response\.cookies\.set/);
});

test("internal gating demo page exists as an MDX-backed route under /internal", () => {
  const internalPage = readSource("src/app/internal/whitepaper-gating-demo/page.tsx");
  const internalMdx = readSource("src/content/internal/whitepaper-gating-demo.mdx");

  assert.match(internalPage, /whitepaper-gating-demo/);
  assert.match(internalMdx, /\ngated:\s*true\n/);
  assert.match(internalMdx, /<GatingCut\s*\/>/);
});

test("gating pages bypass the form when preview navigation is enabled", () => {
  const whitepaperDetailPage = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");
  const internalDemoPage = readSource("src/app/internal/whitepaper-gating-demo/page.tsx");
  const introductionDeckDetailPage = readSource("src/app/introduction-deck/[id]/[slug]/page.tsx");

  for (const source of [whitepaperDetailPage, internalDemoPage, introductionDeckDetailPage]) {
    assert.match(source, /PREVIEW_NAVIGATION_COOKIE/);
    assert.match(source, /getPreviewNavigationState/);
    assert.match(source, /previewModeEnabled \|\| cookieStore\.has\(buildGatingCookieName\(post\.gating\.contentKey\)\)/);
  }
});
