import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper detail routes implement id-only canonical redirects", () => {
  const canonicalRoute = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/whitepapers/[id]/page.tsx");
  const helper = readSource("src/lib/publications/get-whitepaper-publication-post.ts");
  const publicationRecords = readSource("src/lib/publications/whitepaper-publication-records.ts");

  assert.equal(existsSync(new URL("../src/app/whitepapers/[id]/[slug]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/whitepapers/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/content/whitepapers/25.mdx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/whitepaper-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/t/whitepapers/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/lib/publications/querypie-ja-whitepaper-links.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/content/publications/whitepapers.ts", import.meta.url)), false);

  assert.match(canonicalRoute, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.redirectUrl\) \{/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getWhitepaperPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getWhitepaperPublicationPost\(id\);/);

  assert.match(idRoute, /listWhitepaperPublicationIds\(\)/);
  assert.match(idRoute, /if \(record\.redirectUrl\) \{/);
  assert.match(idRoute, /redirect\(getWhitepaperPublicationHref\(id, record\.slug\)\)/);

  assert.match(helper, /renderPublicationMdx/);
  assert.match(helper, /extractHeadingsFromMdx/);
  assert.match(publicationRecords, /const WHITEPAPER_POSTS_ROOT = path\.join\(process\.cwd\(\), "src\/content\/whitepapers"\)/);
  assert.match(publicationRecords, /filter\(\(file\) => file\.endsWith\("\.mdx"\)\)/);
  assert.match(publicationRecords, /listDescription/);
});

test("whitepaper list page is driven by MDX-derived whitepaper items", () => {
  const whitepapersPage = readSource("src/app/whitepapers/page.tsx");
  const resources = readSource("src/content/resources.ts");

  assert.match(whitepapersPage, /import \{ listWhitepaperPublicationItems \} from "@\/lib\/publications\/whitepaper-publication-records"/);
  assert.match(whitepapersPage, /listWhitepaperPublicationItems\(/);
  assert.match(whitepapersPage, /const whitepaperItems = await listWhitepaperPublicationItems\(\);/);
  assert.match(whitepapersPage, /items=\{whitepaperItems\}/);
  assert.match(resources, /import \{ listWhitepaperPublicationItems \} from "@\/lib\/publications\/whitepaper-publication-records"/);
  assert.match(resources, /export const whitepaperItems = listWhitepaperPublicationItems\(\);/);
  assert.doesNotMatch(resources, /querypieJapanWhitepaperItems/);
  assert.doesNotMatch(resources, /publications\/whitepaper"/);
});

test("whitepaper index page directly composes the resource-list hero and uses the concrete public sidebar", () => {
  const source = readSource("src/app/whitepapers/page.tsx");

  assert.match(source, /ResourceListHeroSection/);
  assert.match(source, /ResourceListHeroTitle>ホワイトペーパー<\/ResourceListHeroTitle>/);
  assert.match(source, /ResourceListHeroDescription>/);
  assert.match(source, /ResourceCategorySidebar/);
  assert.match(source, /<ResourceCategorySidebar activeLabel="ホワイトペーパー" \/>/);
  assert.match(source, /ResourceListItems items=\{whitepaperItems\}/);
  assert.doesNotMatch(source, /ResourceListPage/);
});
