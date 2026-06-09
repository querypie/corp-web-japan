import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("glossary now uses only canonical public routes and does not keep a /t/glossary preview route family", () => {
  const canonicalIdPage = "src/app/glossary/[id]/page.tsx";
  const canonicalSlugPage = "src/app/glossary/[id]/[slug]/page.tsx";
  const previewListPage = "src/app/t/glossary/page.tsx";
  const previewIdPage = "src/app/t/glossary/[id]/page.tsx";
  const previewSlugPage = "src/app/t/glossary/[id]/[slug]/page.tsx";
  const publicationFile = "src/lib/resources/glossary-publications.ts";
  const contentFile = "src/content/glossary/1-querypie-ai-glossary.mdx";

  for (const file of [canonicalIdPage, canonicalSlugPage, contentFile]) {
    assert.equal(sourceExists(file), true, `${file} should exist`);
  }

  for (const file of [previewListPage, previewIdPage, previewSlugPage]) {
    assert.equal(sourceExists(file), false, `${file} should be removed`);
  }

  const canonicalSlugSource = readSource(canonicalSlugPage);
  const publicationSource = readSource(publicationFile);

  assert.match(canonicalSlugSource, /canonicalUrl = absoluteUrl\(getGlossaryPublicationHref/);
  assert.match(canonicalSlugSource, /canonical: canonicalUrl/);
  assert.match(publicationSource, /src\/content\/glossary/);
});
