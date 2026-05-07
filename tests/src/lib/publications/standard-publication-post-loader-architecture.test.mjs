import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

const sharedLoaderPath = "src/lib/publications/create-standard-publication-post-loader.ts";
const standardLoaderFiles = [
  "src/lib/publications/get-use-case-publication-post.ts",
  "src/lib/publications/get-aip-demo-publication-post.ts",
  "src/lib/publications/get-acp-demo-publication-post.ts",
  "src/lib/publications/get-event-publication-post.ts",
];

test("use-case, AIP demo, ACP demo, and event post loaders share a common standard publication post loader helper", () => {
  assert.equal(existsSync(new URL("../../../../src/lib/publications/create-standard-publication-post-loader.ts", import.meta.url)), true);

  const sharedLoader = readSource(sharedLoaderPath);
  assert.match(sharedLoader, /export function createStandardPublicationPostLoader/);
  assert.match(sharedLoader, /renderPublicationMdx/);
  assert.match(sharedLoader, /extractHeadingsFromMdx/);
  assert.match(sharedLoader, /resolveRedirectablePublicationHref/);
  assert.match(sharedLoader, /buildPublicationAuthor/);
  assert.match(sharedLoader, /buildRelatedItems/);

  for (const filePath of standardLoaderFiles) {
    const source = readSource(filePath);

    assert.match(source, /createStandardPublicationPostLoader/);
    assert.match(source, /from "@\/lib\/publications\/create-standard-publication-post-loader"/);
    assert.doesNotMatch(source, /function read[A-Za-z]+BodySource/);
    assert.doesNotMatch(source, /function buildRelatedItems/);
  }

  const useCaseSource = readSource("src/lib/publications/get-use-case-publication-post.ts");
  const eventSource = readSource("src/lib/publications/get-event-publication-post.ts");
  const aipSource = readSource("src/lib/publications/get-aip-demo-publication-post.ts");
  const acpSource = readSource("src/lib/publications/get-acp-demo-publication-post.ts");

  assert.match(useCaseSource, /fallbackToAllRecords: true/);
  assert.match(eventSource, /fallbackToAllRecords: true/);
  assert.doesNotMatch(aipSource, /fallbackToAllRecords: true/);
  assert.doesNotMatch(acpSource, /fallbackToAllRecords: true/);
});
