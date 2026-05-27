import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

const authorBuilderPath = "src/lib/publications/build-publication-author.ts";

test("publication post loaders share one author display builder", () => {
  assert.equal(sourceExists(authorBuilderPath), true);

  const authorBuilder = readSource(authorBuilderPath);
  const standardLoader = readSource("src/lib/publications/create-standard-publication-post-loader.ts");
  const gatedLoader = readSource("src/lib/publications/create-gated-publication-post-loader.ts");

  assert.match(authorBuilder, /export function buildPublicationAuthor/);
  assert.match(authorBuilder, /resolveArticleAuthors/);
  assert.match(authorBuilder, /getDisplayableArticleAuthors/);

  for (const source of [standardLoader, gatedLoader]) {
    assert.match(source, /import \{ buildPublicationAuthor \} from "@\/lib\/publications\/build-publication-author"/);
    assert.doesNotMatch(source, /function buildPublicationAuthor/);
    assert.doesNotMatch(source, /resolveArticleAuthors/);
    assert.doesNotMatch(source, /getDisplayableArticleAuthors/);
  }
});

test("resource MDX post loading accepts author frontmatter through the shared builder", () => {
  const resourceTypes = readSource("src/lib/resources/types.ts");
  const resourceRepository = readSource("src/lib/resources/base-resource-publication.ts");
  const resourcePostLoader = readSource("src/lib/resources/base-resource-publication-post-loader.ts");

  assert.match(resourceTypes, /author\?: string \| string\[\]/);
  assert.match(resourceRepository, /const authorValue = frontmatter\.author/);
  assert.match(resourcePostLoader, /import \{ buildPublicationAuthor \} from "@\/lib\/publications\/build-publication-author"/);
  assert.match(resourcePostLoader, /author: buildPublicationAuthor\(/);
  assert.doesNotMatch(resourcePostLoader, /author: null/);
});
