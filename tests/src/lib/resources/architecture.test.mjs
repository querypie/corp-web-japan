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
});
