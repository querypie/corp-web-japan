import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("/t/manuals page exists with noindex metadata and canonical preview path", () => {
  const file = "src/app/t/manuals/page.tsx";
  assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);
  assert.match(source, /canonical: "\/t\/manuals"/);
  assert.match(source, /title: "マニュアル \| QueryPie AI"/);
  assert.match(source, /listManualPreviewItems/);
  assert.match(source, /sidebarBasePath="\/t"/);
});

test("/t/manuals detail route family exists and uses category-specific loaders", () => {
  const idPage = "src/app/t/manuals/[id]/page.tsx";
  const slugPage = "src/app/t/manuals/[id]/[slug]/page.tsx";
  const loaderFile = "src/lib/resources/manual-post-loader.ts";
  const publicationFile = "src/lib/resources/manual-publications.ts";

  assert.equal(existsSync(new URL(`../../../../../${idPage}`, import.meta.url)), true, `${idPage} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${slugPage}`, import.meta.url)), true, `${slugPage} should exist`);

  const idSource = readSource(idPage);
  const slugSource = readSource(slugPage);
  const loaderSource = readSource(loaderFile);
  const publicationSource = readSource(publicationFile);

  assert.match(idSource, /redirect\(getManualPublicationHref/);
  assert.match(idSource, new RegExp(escapeRegex('getManualPublicationRecordById(id)')));
  assert.match(slugSource, /PublicationPostPage post=\{post\}/);
  assert.match(loaderSource, /extends BaseResourcePublicationPostLoader/);
  assert.match(publicationSource, /extends BaseResourcePublicationRepository/);
});
