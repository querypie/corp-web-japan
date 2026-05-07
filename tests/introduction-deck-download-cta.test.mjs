import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("introduction deck models downloadable PDFs through frontmatter downloadCta instead of inline ButtonLink markup", () => {
  const aip = readSource("src/content/introduction-deck/1-querypie-aip.mdx");
  const acp = readSource("src/content/introduction-deck/2-querypie-acp.mdx");

  assert.match(aip, /downloadCta:\n  href: "\/introduction-deck\/1\/QueryPie_AIP_Intro_JP\.pdf"\n  label: "QueryPie AIP 製品紹介書を開く"\n  external: true/);
  assert.match(acp, /downloadCta:\n  href: "\/introduction-deck\/2\/QueryPie_ACP_Intro_JP\.pdf"\n  label: "QueryPie製品紹介を開く"\n  external: true/);
  assert.doesNotMatch(aip, /<ButtonLink href="\/introduction-deck\/1\/QueryPie_AIP_Intro_JP\.pdf"/);
  assert.doesNotMatch(acp, /<ButtonLink href="\/introduction-deck\/2\/QueryPie_ACP_Intro_JP\.pdf"/);
});

test("resource publication loaders parse and expose downloadCta for introduction deck posts", () => {
  const resourceTypes = readSource("src/lib/resources/types.ts");
  const resourceRepo = readSource("src/lib/resources/base-resource-publication.ts");
  const resourcePostLoader = readSource("src/lib/resources/base-resource-publication-post-loader.ts");
  const publicationPage = readSource("src/components/sections/publication-post-page.tsx");
  const gated = readSource("src/components/sections/resource-post-gated.tsx");

  assert.match(resourceTypes, /downloadCta\?: \{/);
  assert.match(resourceRepo, /const downloadCtaValue = frontmatter\.downloadCta/);
  assert.match(resourceRepo, /const downloadCta =/);
  assert.match(resourceRepo, /downloadCta,/);
  assert.match(resourcePostLoader, /downloadCta: previewEvaluation\.frontmatter\.downloadCta \?\? null,/);
  assert.match(resourcePostLoader, /downloadCta: evaluation\.frontmatter\.downloadCta \?\? null,/);
  assert.match(publicationPage, /post\.category === "whitepaper" && post\.gating && post\.downloadCta/);
  assert.match(publicationPage, /downloadCta=\{post\.category === "whitepaper" \? null : post\.downloadCta\}/);
  assert.match(gated, /downloadCta\?: PublicationPostDownloadCta \| null;/);
  assert.match(gated, /ResourceDownloadCta/);
  assert.match(gated, /\{gatedContent\}/);
  assert.match(gated, /\{downloadCta \? <ResourceDownloadCta downloadCta=\{downloadCta\} \/> : null\}/);
});
