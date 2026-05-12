import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("use-case public list page and canonical routes are driven by use-case MDX publication records", () => {
  const listPage = readSource("src/app/demo/use-cases/page.tsx");
  const canonicalRoute = readSource("src/app/use-cases/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/use-cases/[id]/page.tsx");
  const loader = readSource("src/lib/publications/use-cases/get-post.ts");
  const records = readSource("src/lib/publications/use-cases/records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const categories = readSource("src/lib/publications/types.ts");

  assert.equal(existsSync(new URL("../../../../../src/app/demo/use-cases/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../../../../src/app/t/use-cases/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../../../../../src/app/use-cases/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../../../../src/lib/publications/use-cases/records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../../../../src/lib/publications/use-cases/get-post.ts", import.meta.url)), true);

  assert.match(listPage, /listUseCasePublicationItems\(\)/);
  assert.match(listPage, /canonical: "\/demo\/use-cases"/);
  assert.doesNotMatch(listPage, /index: false/);

  assert.match(canonicalRoute, /getUseCasePublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getUseCasePublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getUseCasePublicationPost\(id\);/);

  assert.match(idRoute, /listUseCasePublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getUseCasePublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /categoryLabel: "活用事例"/);
  assert.match(records, /src\/content\/use-cases/);
  assert.match(records, /badge: "活用事例"/);
  assert.match(hrefs, /"use-case": "\/use-cases"/);
  assert.match(categories, /"use-case"/);
});

test("use-case MDX loader supports the imported corpus component set and route-aligned assets", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const useCase1 = readSource("src/content/use-cases/1-allganize-changsu-lee.mdx");
  const useCase29 = readSource("src/content/use-cases/29-seo-analyst.mdx");

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
