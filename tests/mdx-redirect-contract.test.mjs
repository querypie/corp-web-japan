import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const redirectAwareRecordFiles = [
  "src/lib/publications/blog-publication-records.ts",
  "src/lib/publications/whitepaper-publication-records.ts",
  "src/lib/publications/news-publication-records.ts",
  "src/lib/publications/use-case-publication-records.ts",
  "src/lib/publications/aip-demo-publication-records.ts",
  "src/lib/publications/acp-demo-publication-records.ts",
  "src/lib/publications/event-publication-records.ts",
];

const redirectAwareLoaderFiles = [
  "src/lib/publications/get-whitepaper-publication-post.ts",
  "src/lib/publications/get-news-publication-post.ts",
  "src/lib/publications/get-use-case-publication-post.ts",
  "src/lib/publications/get-aip-demo-publication-post.ts",
  "src/lib/publications/get-acp-demo-publication-post.ts",
  "src/lib/publications/get-event-publication-post.ts",
  "src/lib/publications/build-related-publication-items.ts",
];

test("all MDX publication record lists resolve hrefs through the redirectUrl contract", () => {
  const sharedRepositoryFiles = new Set([
    "src/lib/publications/blog-publication-records.ts",
    "src/lib/publications/whitepaper-publication-records.ts",
    "src/lib/publications/news-publication-records.ts",
    "src/lib/publications/use-case-publication-records.ts",
    "src/lib/publications/aip-demo-publication-records.ts",
    "src/lib/publications/acp-demo-publication-records.ts",
    "src/lib/publications/event-publication-records.ts",
  ]);

  for (const filePath of redirectAwareRecordFiles) {
    const source = readSource(filePath);

    if (sharedRepositoryFiles.has(filePath)) {
      assert.match(
        source,
        /createStandardPublicationRecordsRepository/,
        `${filePath} should delegate redirect-aware list href creation through the shared records repository`,
      );
      continue;
    }

    assert.match(
      source,
      /href:\s*resolveRedirectablePublicationHref\(/,
      `${filePath} should build list hrefs through resolveRedirectablePublicationHref()`,
    );
  }
});

test("all MDX publication related-item builders resolve hrefs through the redirectUrl contract", () => {
  const sharedLoaderFiles = new Set([
    "src/lib/publications/get-use-case-publication-post.ts",
    "src/lib/publications/get-aip-demo-publication-post.ts",
    "src/lib/publications/get-acp-demo-publication-post.ts",
    "src/lib/publications/get-event-publication-post.ts",
    "src/lib/publications/get-news-publication-post.ts",
    "src/lib/publications/get-publication-post.ts",
  ]);
  const sharedRelatedConsumerFiles = new Set([
    "src/lib/publications/get-whitepaper-publication-post.ts",
  ]);
  const sharedRelatedHelperFiles = new Set([
    "src/lib/publications/build-related-publication-items.ts",
  ]);

  for (const filePath of redirectAwareLoaderFiles) {
    const source = readSource(filePath);

    if (sharedLoaderFiles.has(filePath)) {
      assert.match(
        source,
        /createStandardPublicationPostLoader/,
        `${filePath} should delegate related href creation through the shared publication post loader`,
      );
      continue;
    }

    if (sharedRelatedHelperFiles.has(filePath)) {
      assert.match(
        source,
        /resolveRedirectablePublicationHref\(/,
        `${filePath} should centralize redirect-aware related href creation`,
      );
      continue;
    }

    if (sharedRelatedConsumerFiles.has(filePath)) {
      assert.match(
        source,
        /buildRelatedPublicationItems\(/,
        `${filePath} should delegate related href creation through the shared related-items helper`,
      );
      continue;
    }

    assert.match(
      source,
      /resolveRedirectablePublicationHref\(/,
      `${filePath} should build related hrefs through resolveRedirectablePublicationHref()`,
    );
  }
});

test("event detail routes match the redirectUrl contract used by the other MDX detail routes", () => {
  const canonicalRoute = readSource("src/app/events/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/events/[id]/page.tsx");

  assert.match(canonicalRoute, /if \(record\.redirectUrl\) \{\s*return \{\s*robots:/s);
  assert.match(canonicalRoute, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(idRoute, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
});
