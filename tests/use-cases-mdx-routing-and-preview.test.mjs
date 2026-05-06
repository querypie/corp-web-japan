import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("use-case preview page and canonical routes are driven by use-case MDX publication records", () => {
  const previewPage = readSource("src/app/t/use-cases/page.tsx");
  const canonicalRoute = readSource("src/app/use-cases/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/use-cases/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-use-case-publication-post.ts");
  const records = readSource("src/lib/publications/use-case-publication-records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const categories = readSource("src/lib/publications/types.ts");

  assert.equal(existsSync(new URL("../src/app/t/use-cases/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/use-cases/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/use-case-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/get-use-case-publication-post.ts", import.meta.url)), true);

  assert.match(previewPage, /listUseCasePublicationItems\(\)/);
  assert.match(previewPage, /canonical: "\/t\/use-cases"/);
  assert.match(previewPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);

  assert.match(canonicalRoute, /getUseCasePublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getUseCasePublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getUseCasePublicationPost\(id\);/);

  assert.match(idRoute, /listUseCasePublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getUseCasePublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /renderPublicationMdx/);
  assert.match(loader, /hideHeroImageOnDetail: frontmatter\.hideHeroImageOnDetail === true/);
  assert.match(loader, /extractHeadingsFromMdx/);
  assert.match(records, /src\/content\/use-cases/);
  assert.match(records, /badge: "活用事例"/);
  assert.match(hrefs, /"use-case": "\/use-cases"/);
  assert.match(categories, /"use-case"/);
});

test("use-case MDX loader supports the imported corpus component set and route-aligned assets", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const useCase1 = readSource("src/content/use-cases/1.mdx");
  const useCase29 = readSource("src/content/use-cases/29.mdx");

  assert.match(mdxComponents, /Youtube/);

  assert.match(useCase1, /heroImageSrc: "\/use-cases\/1\/thumbnail\.png"/);
  assert.match(useCase1, /relatedIds:/);
  assert.match(useCase1, /<Youtube/);
  assert.match(useCase1, /hideHeroImageOnDetail: true/);
  assert.doesNotMatch(useCase1, /public\/customer-success-cases\//);

  assert.match(useCase29, /heroImageSrc: "\/use-cases\/29\/thumbnail\.png"/);
  assert.match(useCase29, /<Youtube/);
  assert.match(useCase29, /hideHeroImageOnDetail: true/);
  assert.doesNotMatch(useCase29, /public\/demo\//);
});
