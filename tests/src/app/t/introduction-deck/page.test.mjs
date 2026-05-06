import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/introduction-deck detail route family uses numeric ids with readable filenames", () => {
  const idPage = "src/app/t/introduction-deck/[id]/page.tsx";
  const slugPage = "src/app/t/introduction-deck/[id]/[slug]/page.tsx";
  const publicationFile = "src/lib/resources/introduction-deck-publications.ts";
  const contentFiles = [
    "src/content/introduction-deck/1-querypie-aip.mdx",
    "src/content/introduction-deck/2-querypie-acp.mdx",
  ];

  assert.equal(existsSync(new URL(`../../../../../${idPage}`, import.meta.url)), true, `${idPage} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${slugPage}`, import.meta.url)), true, `${slugPage} should exist`);
  contentFiles.forEach((file) => {
    assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);
  });

  const publicationSource = readSource(publicationFile);
  assert.match(publicationSource, /src\/content\/introduction-deck/);
});

