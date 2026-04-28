import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper detail routes implement id-only canonical redirects", () => {
  const canonicalRoute = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/whitepapers/[id]/page.tsx");
  const helper = readSource("src/lib/publications/get-whitepaper-publication-post.ts");
  const content = readSource("src/content/publications/whitepapers.ts");

  assert.equal(existsSync(new URL("../src/app/whitepapers/[id]/[slug]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/whitepapers/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/content/whitepapers/28.mdx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/content/publications/whitepapers.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/content/publications/whitepaper.ts", import.meta.url)), false);

  assert.match(canonicalRoute, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getWhitepaperPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getWhitepaperPublicationPost\(id\)/);

  assert.match(idRoute, /listWhitepaperPublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getWhitepaperPublicationHref\(id, record\.slug\)\)/);

  assert.match(helper, /renderPublicationMdx/);
  assert.match(helper, /extractHeadingsFromMdx/);
  assert.match(content, /const WHITEPAPER_POSTS_ROOT = path\.join\(process\.cwd\(\), "src\/content\/whitepapers"\)/);
  assert.match(content, /filter\(\(file\) => file\.endsWith\("\.mdx"\)\)/);
  assert.match(content, /listDescription/);
});

test("whitepaper list page is now driven by MDX-derived whitepaper items", () => {
  const whitepapersPage = readSource("src/app/whitepapers/page.tsx");
  const resources = readSource("src/content/resources.ts");

  assert.match(whitepapersPage, /import \{ whitepaperItems \} from "@\/content\/publications\/whitepapers"/);
  assert.match(whitepapersPage, /items=\{whitepaperItems\}/);
  assert.match(resources, /export \{ whitepaperItems \} from "@\/content\/publications\/whitepapers"/);
  assert.doesNotMatch(resources, /publications\/whitepaper"/);
});
