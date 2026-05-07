import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const redirectAwareRecordFiles = [
  "src/lib/publications/blog/records.ts",
  "src/lib/publications/whitepapers/records.ts",
  "src/lib/publications/news/records.ts",
  "src/lib/publications/use-cases/records.ts",
  "src/lib/publications/demo/aip/records.ts",
  "src/lib/publications/demo/acp/records.ts",
  "src/lib/publications/events/records.ts",
];

const redirectAwareLoaderFiles = [
  "src/lib/publications/whitepapers/get-post.ts",
  "src/lib/publications/news/get-post.ts",
  "src/lib/publications/use-cases/get-post.ts",
  "src/lib/publications/demo/aip/get-post.ts",
  "src/lib/publications/demo/acp/get-post.ts",
  "src/lib/publications/events/get-post.ts",
  "src/lib/publications/build-related-publication-items.ts",
];

test("all MDX publication record lists resolve hrefs through the redirectUrl contract", () => {
  const sharedRepositoryFiles = new Set(redirectAwareRecordFiles);

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
    "src/lib/publications/use-cases/get-post.ts",
    "src/lib/publications/demo/aip/get-post.ts",
    "src/lib/publications/demo/acp/get-post.ts",
    "src/lib/publications/events/get-post.ts",
    "src/lib/publications/news/get-post.ts",
    "src/lib/publications/blog/get-post.ts",
  ]);
  const gatedLoaderFiles = new Set([
    "src/lib/publications/whitepapers/get-post.ts",
  ]);
  const sharedRelatedConsumerFiles = new Set([]);

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

    if (gatedLoaderFiles.has(filePath)) {
      assert.match(
        source,
        /createGatedPublicationPostLoader/,
        `${filePath} should delegate related href creation through the dedicated gated publication post loader`,
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

test("redirect-backed detail routes share the bot-aware redirect contract", () => {
  const helper = readSource("src/lib/publications/redirectable-publication-request.ts");
  const canonicalRoute = readSource("src/app/events/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/events/[id]/page.tsx");

  assert.match(helper, /isSearchBotUserAgent/);
  assert.match(helper, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(canonicalRoute, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(canonicalRoute, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(idRoute, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
});
