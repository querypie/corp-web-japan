import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("manuals now uses only canonical public routes and does not keep a /t preview route family", () => {
  const canonicalFile = "src/app/manuals/page.tsx";
  const previewFile = "src/app/t/manuals/page.tsx";
  const previewItemsFile = "src/lib/resources/resource-preview-items.ts";
  assert.equal(existsSync(new URL(`../../../../../${canonicalFile}`, import.meta.url)), true, `${canonicalFile} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${previewFile}`, import.meta.url)), false, `${previewFile} should be removed`);

  const canonicalSource = readSource(canonicalFile);
  const previewItemsSource = readSource(previewItemsFile);
  assert.match(canonicalSource, /canonical: "\/manuals"/);
  assert.match(canonicalSource, /title: "マニュアル \| QueryPie AI"/);
  assert.match(canonicalSource, /listManualPreviewItems/);
  assert.match(canonicalSource, /resourceCategorySidebarLinks/);
  assert.match(canonicalSource, /<ResourceCategorySidebar links=\{resourceCategorySidebarLinks\} activeLabel="マニュアル" \/>/);
  assert.doesNotMatch(previewItemsSource, /manualExternalItems/);
  assert.match(previewItemsSource, /return listManualPublicationItems\(\)/);
});

test("manual detail route family now uses only canonical public paths and no /t routes remain", () => {
  const canonicalIdPage = "src/app/manuals/[id]/page.tsx";
  const canonicalSlugPage = "src/app/manuals/[id]/[slug]/page.tsx";
  const previewIdPage = "src/app/t/manuals/[id]/page.tsx";
  const previewSlugPage = "src/app/t/manuals/[id]/[slug]/page.tsx";
  const loaderFile = "src/lib/resources/manual-post-loader.ts";
  const publicationFile = "src/lib/resources/manual-publications.ts";
  const contentFiles = [
    "src/content/manuals/1-acp-community-install-guide.mdx",
    "src/content/manuals/2-acp-administrator-manual.mdx",
    "src/content/manuals/3-acp-user-manual.mdx",
    "src/content/manuals/4-acp-api-reference.mdx",
    "src/content/manuals/5-acp-manual.mdx",
    "src/content/manuals/6-aip-manual.mdx",
    "src/content/manuals/7-acp-release-notes.mdx",
  ];

  for (const file of [canonicalIdPage, canonicalSlugPage, ...contentFiles]) {
    assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);
  }

  for (const file of [previewIdPage, previewSlugPage]) {
    assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), false, `${file} should be removed`);
  }

  const canonicalSlugSource = readSource(canonicalSlugPage);
  const loaderSource = readSource(loaderFile);
  const publicationSource = readSource(publicationFile);

  assert.match(canonicalSlugSource, /canonical: getManualPublicationHref/);
  assert.match(canonicalSlugSource, /PublicationPostPage post=\{post\}/);
  assert.match(loaderSource, /extends BaseResourcePublicationPostLoader/);
  assert.match(publicationSource, /extends BaseResourcePublicationRepository/);
  assert.match(publicationSource, /src\/content\/manuals/);
  assert.match(publicationSource, /1-acp-community-install-guide\.mdx/);
  assert.match(publicationSource, /2-acp-administrator-manual\.mdx/);
  assert.match(publicationSource, /3-acp-user-manual\.mdx/);
  assert.match(publicationSource, /4-acp-api-reference\.mdx/);
  assert.match(publicationSource, /5-acp-manual\.mdx/);
  assert.match(publicationSource, /6-aip-manual\.mdx/);
  assert.match(publicationSource, /7-acp-release-notes\.mdx/);
});
