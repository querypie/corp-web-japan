import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("introduction deck detail route family now uses canonical public paths while /t routes redirect", () => {
  const canonicalIdPage = "src/app/introduction-deck/[id]/page.tsx";
  const canonicalSlugPage = "src/app/introduction-deck/[id]/[slug]/page.tsx";
  const previewIdPage = "src/app/t/introduction-deck/[id]/page.tsx";
  const previewSlugPage = "src/app/t/introduction-deck/[id]/[slug]/page.tsx";
  const publicationFile = "src/lib/resources/introduction-deck-publications.ts";
  const contentFiles = [
    "src/content/introduction-deck/1-querypie-aip.mdx",
    "src/content/introduction-deck/2-querypie-acp.mdx",
  ];

  for (const file of [canonicalIdPage, canonicalSlugPage, previewIdPage, previewSlugPage]) {
    assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);
  }
  contentFiles.forEach((file) => {
    assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);
  });

  const canonicalSlugSource = readSource(canonicalSlugPage);
  const previewSlugSource = readSource(previewSlugPage);
  const publicationSource = readSource(publicationFile);

  assert.match(canonicalSlugSource, /canonical: getIntroductionDeckPublicationHref/);
  assert.match(canonicalSlugSource, /PublicationPostPage post=\{post\}/);
  assert.match(previewSlugSource, /redirect\(getIntroductionDeckPublicationHref\(id, record\.slug\)\)/);
  assert.match(publicationSource, /src\/content\/introduction-deck/);
});
