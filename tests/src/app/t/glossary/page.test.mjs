import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("glossary detail route family now uses canonical public paths while /t routes redirect", () => {
  const canonicalIdPage = "src/app/glossary/[id]/page.tsx";
  const canonicalSlugPage = "src/app/glossary/[id]/[slug]/page.tsx";
  const previewIdPage = "src/app/t/glossary/[id]/page.tsx";
  const previewSlugPage = "src/app/t/glossary/[id]/[slug]/page.tsx";
  const publicationFile = "src/lib/resources/glossary-publications.ts";
  const contentFile = "src/content/glossary/1-querypie-ai-glossary.mdx";

  for (const file of [canonicalIdPage, canonicalSlugPage, previewIdPage, previewSlugPage, contentFile]) {
    assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);
  }

  const canonicalSlugSource = readSource(canonicalSlugPage);
  const previewSlugSource = readSource(previewSlugPage);
  const publicationSource = readSource(publicationFile);

  assert.match(canonicalSlugSource, /canonical: getGlossaryPublicationHref/);
  assert.match(previewSlugSource, /redirect\(getGlossaryPublicationHref\(id, record\.slug\)\)/);
  assert.match(publicationSource, /src\/content\/glossary/);
});
