import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

const gatedLoaderPath = "src/lib/publications/create-gated-publication-post-loader.ts";

test("whitepaper post loading isolates gating-specific rendering behind a dedicated gated publication post loader helper", () => {
  assert.equal(existsSync(new URL("../../../../src/lib/publications/create-gated-publication-post-loader.ts", import.meta.url)), true);

  const gatedLoader = readSource(gatedLoaderPath);
  const whitepaperLoader = readSource("src/lib/publications/get-whitepaper-publication-post.ts");

  assert.match(gatedLoader, /export function createGatedPublicationPostLoader/);
  assert.match(gatedLoader, /splitMdxSourceAtGatingCut/);
  assert.match(gatedLoader, /buildGatingContentKey/);
  assert.match(gatedLoader, /buildRelatedPublicationItems/);
  assert.match(whitepaperLoader, /createGatedPublicationPostLoader/);
  assert.match(whitepaperLoader, /from "@\/lib\/publications\/create-gated-publication-post-loader"/);
  assert.doesNotMatch(whitepaperLoader, /function readWhitepaperPublicationBodySource/);
});
