import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("AIP demo public list page and canonical routes are driven by AIP demo MDX publication records", () => {
  const listPage = readSource("src/app/demo/aip/page.tsx");
  const canonicalRoute = readSource("src/app/demo/aip/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/demo/aip/[id]/page.tsx");
  const loader = readSource("src/lib/publications/demo/aip/get-post.ts");
  const records = readSource("src/lib/publications/demo/aip/records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const categories = readSource("src/lib/publications/types.ts");

  assert.equal(sourceExists("src/app/demo/aip/page.tsx"), true);
  assert.equal(sourceExists("src/app/t/demo/aip/page.tsx"), false);
  assert.equal(sourceExists("src/app/demo/aip/[id]/page.tsx"), true);
  assert.equal(sourceExists("src/lib/publications/demo/aip/records.ts"), true);
  assert.equal(sourceExists("src/lib/publications/demo/aip/get-post.ts"), true);

  assert.match(listPage, /listAipDemoPublicationItems\(\)/);
  assert.match(listPage, /canonical: "\/demo\/aip"/);
  assert.doesNotMatch(listPage, /index: false/);

  assert.match(canonicalRoute, /getAipDemoPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getAipDemoPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getAipDemoPublicationPost\(id\);/);

  assert.match(idRoute, /listAipDemoPublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getAipDemoPublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /categoryLabel: "AIP機能"/);
  assert.match(records, /src\/content\/demo\/aip/);
  assert.match(records, /badge: "AIP機能"/);
  assert.match(hrefs, /"aip-demo": "\/demo\/aip"/);
  assert.match(categories, /"aip-demo"/);
});

test("AIP demo MDX loader supports the imported corpus component set and route-aligned assets", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const demo1 = readSource("src/content/demo/aip/1-google-oauth-demo.mdx");

  assert.match(mdxComponents, /Youtube/);
  assert.match(demo1, /heroImageSrc: "\/demo\/aip\/1\/thumbnail\.png"/);
  assert.match(demo1, /relatedIds:/);
  assert.match(demo1, /<Youtube/);
  assert.match(demo1, /hideHeroImageOnDetail: true/);
  assert.doesNotMatch(demo1, /public\/demo\//);
});
