import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/glossary page exists with noindex metadata and canonical preview path", () => {
  const file = "src/app/t/glossary/page.tsx";
  assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);
  assert.match(source, /canonical: "\/t\/glossary"/);
  assert.match(source, /title: "用語集 \| QueryPie AI"/);
  assert.match(source, /listGlossaryPublicationItems/);
  assert.match(source, /previewResourceCategorySidebarLinks/);
  assert.match(source, /<ResourceCategorySidebar links=\{previewResourceCategorySidebarLinks\} activeLabel="用語集" \/>/);
});

test("/t/glossary detail route family exists and uses category-specific loaders", () => {
  const idPage = "src/app/t/glossary/[id]/page.tsx";
  const slugPage = "src/app/t/glossary/[id]/[slug]/page.tsx";
  const loaderFile = "src/lib/resources/glossary-post-loader.ts";
  const publicationFile = "src/lib/resources/glossary-publications.ts";

  assert.equal(existsSync(new URL(`../../../../../${idPage}`, import.meta.url)), true, `${idPage} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${slugPage}`, import.meta.url)), true, `${slugPage} should exist`);

  const idSource = readSource(idPage);
  const slugSource = readSource(slugPage);
  const loaderSource = readSource(loaderFile);
  const publicationSource = readSource(publicationFile);

  assert.match(idSource, /redirect\(getGlossaryPublicationHref/);
  assert.match(idSource, /getGlossaryPublicationRecordById\(id\)/);
  assert.match(slugSource, /PublicationPostPage post=\{post\}/);
  assert.match(loaderSource, /extends BaseResourcePublicationPostLoader/);
  assert.match(publicationSource, /extends BaseResourcePublicationRepository/);
});
