import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("resource preview loaders are split into an abstract base plus category-specific concrete implementations", () => {
  const basePublication = readSource("src/lib/resources/base-resource-publication.ts");
  const basePostLoader = readSource("src/lib/resources/base-resource-publication-post-loader.ts");
  const previewItems = readSource("src/lib/resources/resource-preview-items.ts");
  const introPublications = readSource("src/lib/resources/introduction-deck-publications.ts");
  const glossaryPublications = readSource("src/lib/resources/glossary-publications.ts");
  const manualPublications = readSource("src/lib/resources/manual-publications.ts");

  assert.match(basePublication, /export abstract class BaseResourcePublicationRepository/);
  assert.match(basePostLoader, /export abstract class BaseResourcePublicationPostLoader/);
  assert.match(previewItems, /listResourcePreviewItems/);
  assert.match(previewItems, /listManualPreviewItems/);
  assert.doesNotMatch(previewItems, /documentation-publications/);
  assert.match(introPublications, /extends BaseResourcePublicationRepository/);
  assert.match(glossaryPublications, /extends BaseResourcePublicationRepository/);
  assert.match(manualPublications, /extends BaseResourcePublicationRepository/);
  assert.doesNotMatch(introPublications, /src\/content\/documentation\//);
  assert.doesNotMatch(glossaryPublications, /src\/content\/documentation\//);
  assert.doesNotMatch(manualPublications, /src\/content\/documentation\//);
  assert.doesNotMatch(introPublications, /src\/content\/docs/);
  assert.doesNotMatch(glossaryPublications, /src\/content\/docs/);
  assert.doesNotMatch(manualPublications, /src\/content\/docs/);
  assert.match(introPublications, /src\/content\/introduction-deck/);
  assert.match(glossaryPublications, /src\/content\/glossary/);
  assert.match(manualPublications, /src\/content\/manuals/);
  assert.match(manualPublications, /1-acp-community-install-guide\.mdx/);
  assert.match(manualPublications, /2-acp-administrator-manual\.mdx/);
  assert.match(manualPublications, /3-acp-user-manual\.mdx/);
  assert.match(manualPublications, /4-acp-api-reference\.mdx/);
  assert.match(manualPublications, /5-acp-manual\.mdx/);
  assert.match(manualPublications, /6-aip-manual\.mdx/);
  assert.match(manualPublications, /7-acp-release-notes\.mdx/);
});
