import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("introduction deck now uses only canonical public routes and does not keep a /t preview route family", () => {
  const canonicalIdPage = "src/app/introduction-deck/[id]/page.tsx";
  const canonicalSlugPage = "src/app/introduction-deck/[id]/[slug]/page.tsx";
  const previewListPage = "src/app/t/introduction-deck/page.tsx";
  const previewIdPage = "src/app/t/introduction-deck/[id]/page.tsx";
  const previewSlugPage = "src/app/t/introduction-deck/[id]/[slug]/page.tsx";
  const publicationFile = "src/lib/resources/introduction-deck-publications.ts";
  const contentFiles = [
    "src/content/introduction-deck/1-querypie-aip.mdx",
    "src/content/introduction-deck/2-querypie-acp.mdx",
  ];

  for (const file of [canonicalIdPage, canonicalSlugPage, ...contentFiles]) {
    assert.equal(sourceExists(file), true, `${file} should exist`);
  }

  for (const file of [previewListPage, previewIdPage, previewSlugPage]) {
    assert.equal(sourceExists(file), false, `${file} should be removed`);
  }

  const canonicalSlugSource = readSource(canonicalSlugPage);
  const publicationSource = readSource(publicationFile);

  assert.match(canonicalSlugSource, /canonicalUrl = absoluteUrl\(getIntroductionDeckPublicationHref/);
  assert.match(canonicalSlugSource, /canonical: canonicalUrl/);
  assert.match(canonicalSlugSource, /PublicationPostPage post=\{post\}/);
  assert.match(publicationSource, /src\/content\/introduction-deck/);
});
