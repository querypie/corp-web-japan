import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const previewPages = [
  { file: "src/app/t/resources/page.tsx", canonical: 'canonical: "/t/resources"', title: "ドキュメント" },
  { file: "src/app/t/introduction-deck/page.tsx", canonical: 'canonical: "/t/introduction-deck"', title: "紹介資料" },
  { file: "src/app/t/glossary/page.tsx", canonical: 'canonical: "/t/glossary"', title: "用語集" },
  { file: "src/app/t/manuals/page.tsx", canonical: 'canonical: "/t/manuals"', title: "マニュアル" },
];

const detailRoutes = [
  {
    category: "introduction-deck",
    idPage: "src/app/t/introduction-deck/[id]/page.tsx",
    slugPage: "src/app/t/introduction-deck/[id]/[slug]/page.tsx",
    recordKey: 'getIntroductionDeckPublicationRecord(id)',
    loaderFile: "src/lib/resources/introduction-deck-post-loader.ts",
    publicationFile: "src/lib/resources/introduction-deck-publications.ts",
  },
  {
    category: "glossary",
    idPage: "src/app/t/glossary/[id]/page.tsx",
    slugPage: "src/app/t/glossary/[id]/[slug]/page.tsx",
    recordKey: 'getGlossaryPublicationRecordById(id)',
    loaderFile: "src/lib/resources/glossary-post-loader.ts",
    publicationFile: "src/lib/resources/glossary-publications.ts",
  },
  {
    category: "manuals",
    idPage: "src/app/t/manuals/[id]/page.tsx",
    slugPage: "src/app/t/manuals/[id]/[slug]/page.tsx",
    recordKey: 'getManualPublicationRecordById(id)',
    loaderFile: "src/lib/resources/manual-post-loader.ts",
    publicationFile: "src/lib/resources/manual-publications.ts",
  },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("/t documentation preview pages exist with noindex metadata and canonical preview paths", () => {
  for (const page of previewPages) {
    assert.equal(existsSync(new URL(`../${page.file}`, import.meta.url)), true, `${page.file} should exist`);
    const source = readSource(page.file);
    assert.match(source, /export const metadata: Metadata = \{/);
    assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
    assert.match(source, new RegExp(escapeRegex(page.canonical)));
    assert.match(source, new RegExp(escapeRegex(page.title)));
    assert.match(source, /<SiteHeader \/>/);
    assert.match(source, /<SiteFooter \/>/);
    assert.match(source, /sidebarBasePath="\/t"/);
  }
});

test("resource preview loaders are split into an abstract base plus category-specific concrete implementations", () => {
  const basePublication = readSource("src/lib/resources/base-resource-publication.ts");
  const basePostLoader = readSource("src/lib/resources/base-resource-publication-post-loader.ts");
  const previewItems = readSource("src/lib/resources/resource-preview-items.ts");

  assert.match(basePublication, /export abstract class BaseResourcePublicationRepository/);
  assert.match(basePostLoader, /export abstract class BaseResourcePublicationPostLoader/);
  assert.match(previewItems, /listResourcePreviewItems/);
  assert.match(previewItems, /listManualPreviewItems/);
  assert.doesNotMatch(previewItems, /documentation-publications/);
});

test("documentation preview detail route families exist for introduction-deck, glossary, and manuals", () => {
  for (const route of detailRoutes) {
    assert.equal(existsSync(new URL(`../${route.idPage}`, import.meta.url)), true, `${route.idPage} should exist`);
    assert.equal(existsSync(new URL(`../${route.slugPage}`, import.meta.url)), true, `${route.slugPage} should exist`);

    const idSource = readSource(route.idPage);
    const slugSource = readSource(route.slugPage);
    const loaderSource = readSource(route.loaderFile);
    const publicationSource = readSource(route.publicationFile);

    assert.match(idSource, /redirect\(get/);
    assert.match(idSource, new RegExp(escapeRegex(route.recordKey)));
    assert.match(slugSource, /PublicationPostPage post=\{post\}/);
    assert.match(loaderSource, /extends BaseResourcePublicationPostLoader/);
    assert.match(publicationSource, /extends BaseResourcePublicationRepository/);
  }
});
