import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/glossary detail route family uses numeric ids with readable filenames", () => {
  const idPage = "src/app/t/glossary/[id]/page.tsx";
  const slugPage = "src/app/t/glossary/[id]/[slug]/page.tsx";
  const publicationFile = "src/lib/resources/glossary-publications.ts";
  const contentFile = "src/content/glossary/1-querypie-ai-glossary-main-terms-definitions.mdx";

  assert.equal(existsSync(new URL(`../../../../../${idPage}`, import.meta.url)), true, `${idPage} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${slugPage}`, import.meta.url)), true, `${slugPage} should exist`);
  assert.equal(existsSync(new URL(`../../../../../${contentFile}`, import.meta.url)), true, `${contentFile} should exist`);

  const publicationSource = readSource(publicationFile);
  assert.match(publicationSource, /src\/content\/glossary/);
});

