import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("/t/introduction-deck page exists with noindex metadata and canonical preview path", () => {
  const file = "src/app/t/introduction-deck/page.tsx";
  assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);
  assert.match(source, /canonical: "\/t\/introduction-deck"/);
  assert.match(source, /title: "紹介資料 \| QueryPie AI"/);
  assert.match(source, /listIntroductionDeckPublicationItems/);
  assert.match(source, /const sidebarLinks: readonly ResourceCategoryLink\[] = \[/);
  assert.match(source, /\{ label: "紹介資料", href: "\/t\/introduction-deck" \}/);
});

test("/t/introduction-deck detail route family exists and uses category-specific loaders", () => {
  const idPage = "src/app/t/introduction-deck/[id]/page.tsx";
  const slugPage = "src/app/t/introduction-deck/[id]/[slug]/page.tsx";
  const loaderFile = "src/lib/resources/introduction-deck-post-loader.ts";
  const publicationFile = "src/lib/resources/introduction-deck-publications.ts";

  assert.equal(existsSync(new URL(`../../../../../${idPage}`, import.meta.url)), true, `${idPage} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${slugPage}`, import.meta.url)), true, `${slugPage} should exist`);

  const idSource = readSource(idPage);
  const slugSource = readSource(slugPage);
  const loaderSource = readSource(loaderFile);
  const publicationSource = readSource(publicationFile);

  assert.match(idSource, /redirect\(getIntroductionDeckPublicationHref/);
  assert.match(idSource, new RegExp(escapeRegex('getIntroductionDeckPublicationRecord(id)')));
  assert.match(slugSource, /PublicationPostPage post=\{post\}/);
  assert.match(loaderSource, /extends BaseResourcePublicationPostLoader/);
  assert.match(publicationSource, /extends BaseResourcePublicationRepository/);
});
