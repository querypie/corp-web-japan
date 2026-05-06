import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("AIP demo preview page and canonical routes are driven by AIP demo MDX publication records", () => {
  const previewPage = readSource("src/app/t/demo/aip/page.tsx");
  const canonicalRoute = readSource("src/app/demo/aip/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/demo/aip/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-aip-demo-publication-post.ts");
  const records = readSource("src/lib/publications/aip-demo-publication-records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const categories = readSource("src/lib/publications/types.ts");

  assert.equal(existsSync(new URL("../src/app/t/demo/aip/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/demo/aip/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/aip-demo-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/get-aip-demo-publication-post.ts", import.meta.url)), true);

  assert.match(previewPage, /listAipDemoPublicationItems\(\)/);
  assert.match(previewPage, /canonical: "\/t\/demo\/aip"/);
  assert.match(previewPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);

  assert.match(canonicalRoute, /getAipDemoPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getAipDemoPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getAipDemoPublicationPost\(id\);/);

  assert.match(idRoute, /listAipDemoPublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getAipDemoPublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /renderPublicationMdx/);
  assert.match(loader, /hideHeroImageOnDetail: frontmatter\.hideHeroImageOnDetail === true/);
  assert.match(loader, /extractHeadingsFromMdx/);
  assert.match(records, /src\/content\/demo\/aip/);
  assert.match(records, /badge: "AIP機能"/);
  assert.match(hrefs, /"aip-demo": "\/demo\/aip"/);
  assert.match(categories, /"aip-demo"/);
});

test("AIP demo MDX loader supports the imported corpus component set and route-aligned assets", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const demo1 = readSource("src/content/demo/aip/1.mdx");

  assert.match(mdxComponents, /Youtube/);
  assert.match(demo1, /heroImageSrc: "\/demo\/aip\/1\/thumbnail\.png"/);
  assert.match(demo1, /relatedIds:/);
  assert.match(demo1, /<Youtube/);
  assert.match(demo1, /hideHeroImageOnDetail: true/);
  assert.doesNotMatch(demo1, /public\/demo\//);
});
