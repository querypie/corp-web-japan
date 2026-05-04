import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const previewPages = [
  {
    file: "src/app/t/resources/page.tsx",
    canonical: 'canonical: "/t/resources"',
    title: "ドキュメント",
  },
  {
    file: "src/app/t/introduction-deck/page.tsx",
    canonical: 'canonical: "/t/introduction-deck"',
    title: "紹介資料",
  },
  {
    file: "src/app/t/glossary/page.tsx",
    canonical: 'canonical: "/t/glossary"',
    title: "用語集",
  },
  {
    file: "src/app/t/manuals/page.tsx",
    canonical: 'canonical: "/t/manuals"',
    title: "マニュアル",
  },
];

const detailRoutes = [
  {
    category: "introduction-deck",
    idPage: "src/app/t/introduction-deck/[id]/page.tsx",
    slugPage: "src/app/t/introduction-deck/[id]/[slug]/page.tsx",
    recordKey: 'getDocumentationPublicationRecordById("introduction-deck", id)',
  },
  {
    category: "glossary",
    idPage: "src/app/t/glossary/[id]/page.tsx",
    slugPage: "src/app/t/glossary/[id]/[slug]/page.tsx",
    recordKey: 'getDocumentationPublicationRecordById("glossary", id)',
  },
  {
    category: "manuals",
    idPage: "src/app/t/manuals/[id]/page.tsx",
    slugPage: "src/app/t/manuals/[id]/[slug]/page.tsx",
    recordKey: 'getDocumentationPublicationRecordById("manuals", id)',
  },
];

test("/t documentation preview pages exist with noindex metadata and canonical preview paths", () => {
  for (const page of previewPages) {
    assert.equal(existsSync(new URL(`../${page.file}`, import.meta.url)), true, `${page.file} should exist`);

    const source = readSource(page.file);

    assert.match(source, /export const metadata: Metadata = \{/);
    assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
    assert.match(source, new RegExp(page.canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(source, new RegExp(page.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(source, /<SiteHeader \/>/);
    assert.match(source, /<SiteFooter \/>/);
    assert.match(source, /sidebarBasePath="\/t"/);
  }
});

test("documentation preview pages are backed by local MDX publication loaders", () => {
  const source = readSource("src/lib/documentation-publications.ts");
  const postLoader = readSource("src/lib/get-documentation-publication-post.ts");

  assert.match(source, /src\/content\/documentation/);
  assert.match(source, /listDocumentationPublicationItems/);
  assert.match(source, /listDocumentationResourceItems/);
  assert.match(source, /getResourceItems\("whitepaper"\)/);
  assert.match(source, /getResourceItems\("blog"\)/);
  assert.match(postLoader, /renderPublicationMdx/);
  assert.match(postLoader, /splitMdxSourceAtGatingCut/);
  assert.match(postLoader, /buildGatingContentKey/);
});

test("documentation preview detail route families exist for introduction-deck, glossary, and manuals", () => {
  for (const route of detailRoutes) {
    assert.equal(existsSync(new URL(`../${route.idPage}`, import.meta.url)), true, `${route.idPage} should exist`);
    assert.equal(existsSync(new URL(`../${route.slugPage}`, import.meta.url)), true, `${route.slugPage} should exist`);

    const idSource = readSource(route.idPage);
    const slugSource = readSource(route.slugPage);

    assert.match(idSource, /redirect\(getDocumentationPublicationHref/);
    assert.match(idSource, new RegExp(route.recordKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(slugSource, /PublicationPostPage post=\{post\}/);
    assert.match(slugSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  }
});
