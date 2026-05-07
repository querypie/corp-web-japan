import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/resources page is the public canonical route and /t/resources redirects to it", () => {
  const canonicalFile = "src/app/resources/page.tsx";
  const previewFile = "src/app/t/resources/page.tsx";
  assert.equal(existsSync(new URL(`../../../../../${canonicalFile}`, import.meta.url)), true, `${canonicalFile} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${previewFile}`, import.meta.url)), true, `${previewFile} should exist`);

  const canonicalSource = readSource(canonicalFile);
  const previewSource = readSource(previewFile);
  assert.match(canonicalSource, /canonical: "\/resources"/);
  assert.match(canonicalSource, /title: "ドキュメント \| QueryPie AI"/);
  assert.match(canonicalSource, /resourceCategorySidebarLinks/);
  assert.match(canonicalSource, /<ResourceCategorySidebar links=\{resourceCategorySidebarLinks\} activeLabel="全て" \/>/);
  assert.match(canonicalSource, /listResourcePreviewItems/);
  assert.match(previewSource, /redirect\("\/resources"\)/);
});
