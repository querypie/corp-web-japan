import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("ACP demo public list page and canonical routes are driven by ACP demo MDX publication records", () => {
  const listPage = readSource("src/app\/demo\/acp/page.tsx");
  const canonicalRoute = readSource("src/app\/demo\/acp/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app\/demo\/acp/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-acp-demo-publication-post.ts");
  const records = readSource("src/lib/publications/acp-demo-publication-records.ts");
  const hrefs = readSource("src/lib/publications/get-publication-href.ts");
  const categories = readSource("src/lib/publications/types.ts");
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");

  assert.equal(existsSync(new URL("../src/app\/demo\/acp/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/t\/demo\/acp/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app\/demo\/acp/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/acp-demo-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/get-acp-demo-publication-post.ts", import.meta.url)), true);

  assert.match(listPage, /listAcpDemoPublicationItems\(\)/);
  assert.match(listPage, /canonical: "\/demo\/acp"/);
  assert.doesNotMatch(listPage, /index: false/);

  assert.match(canonicalRoute, /getAcpDemoPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getAcpDemoPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getAcpDemoPublicationPost\(id\);/);

  assert.match(idRoute, /listAcpDemoPublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getAcpDemoPublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /categoryLabel: "ACP機能"/);
  assert.match(records, /src\/content\/demo\/acp/);
  assert.match(records, /badge: "ACP機能"/);
  assert.match(hrefs, /"acp-demo": "\/demo\/acp"/);
  assert.match(categories, /"acp-demo"/);
  assert.match(mdxComponents, /BlueState/);
  assert.match(mdxComponents, /User/);
});

test("ACP demo MDX loader supports the imported corpus component set and route-aligned assets", () => {
  const demo4 = readSource("src/content\/demo\/acp/4.mdx");
  const demo26 = readSource("src/content\/demo\/acp/26.mdx");

  assert.match(demo4, /heroImageSrc: "\/demo\/acp\/4\/thumbnail\.png"/);
  assert.match(demo4, /hideHeroImageOnDetail: true/);
  assert.match(demo4, /<BlueState>/);
  assert.match(demo4, /<InfoNote>/);
  assert.doesNotMatch(demo4, /public\/tutorial\//);

  assert.match(demo26, /heroImageSrc: "\/demo\/acp\/26\/thumbnail\.png"/);
  assert.match(demo26, /<Youtube/);
  assert.match(demo26, /hideHeroImageOnDetail: true/);
  assert.doesNotMatch(demo26, /public\/tutorial\//);
});
