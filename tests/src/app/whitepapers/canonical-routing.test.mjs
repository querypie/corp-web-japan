import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("whitepaper canonical routing keeps the local MDX-backed detail flow and preserves hidden redirect records", () => {
  const whitepaper25 = readSource("src/content/whitepapers/25-ai-transformation-japan.mdx");
  const helper = readSource("src/lib/publications/whitepapers/get-post.ts");
  const gatedLoader = readSource("src/lib/publications/create-gated-publication-post-loader.ts");
  const publicationRecords = readSource("src/lib/publications/whitepapers/records.ts");

  assert.equal(existsSync(new URL("../../../../src/content/whitepapers/25-ai-transformation-japan.mdx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../../../src/lib/publications/whitepapers/records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../../../../src/app/t/whitepapers/page.tsx", import.meta.url)), false);

  assert.match(whitepaper25, /hidden:\s*true/);
  assert.match(whitepaper25, /redirectUrl:\s*"\/whitepapers\/24\/ai-transformation-japan"/);
  assert.match(helper, /createGatedPublicationPostLoader/);
  assert.match(helper, /from "@\/lib\/publications\/create-gated-publication-post-loader"/);
  assert.doesNotMatch(helper, /splitMdxSourceAtGatingCut/);
  assert.doesNotMatch(helper, /buildGatingContentKey\("whitepaper", id\)/);
  assert.match(gatedLoader, /splitMdxSourceAtGatingCut/);
  assert.match(gatedLoader, /buildGatingContentKey\(config\.category, id\)/);
  assert.match(publicationRecords, /createStandardPublicationRecordsRepository/);
  assert.match(publicationRecords, /listDescription/);
  assert.match(publicationRecords, /getListItemDescription: \(record\) => record\.listDescription \?\? record\.description/);
});

test("whitepaper list pages are driven by the shared list loader instead of legacy static arrays", () => {
  const whitepapersPage = readSource("src/app/whitepapers/page.tsx");

  assert.match(whitepapersPage, /import \{ listWhitepaperPublicationItems \} from "@\/lib\/publications\/whitepapers\/records"/);
  assert.match(whitepapersPage, /listWhitepaperPublicationItems\(/);
  assert.match(whitepapersPage, /const \[whitepaperItems, resolvedSearchParams\] = await Promise\.all\(\[listWhitepaperPublicationItems\(\), searchParams\]\);/);
  assert.match(whitepapersPage, /const initialVisibleCount = resolveResourceListVisibleCount\(whitepaperItems, resolvedSearchParams\?\.until\);/);
  assert.match(whitepapersPage, /items=\{whitepaperItems\}/);
});
