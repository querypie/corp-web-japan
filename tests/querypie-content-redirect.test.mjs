import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("querypie content redirect helper covers sitemap-derived top-level and locale-aware namespaces", () => {
  const file = "src/lib/querypie-content-redirect.ts";

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);

  assert.match(source, /"company"/);
  assert.match(source, /"features"/);
  assert.match(source, /"solutions"/);
  assert.match(source, /"cookie-preference"/);
  assert.match(source, /"eula"/);
  assert.match(source, /"plans"/);
  assert.match(source, /"sales-deck"/);
  assert.match(source, /"search"/);
  assert.match(source, /"en"/);
  assert.match(source, /"ja"/);
  assert.match(source, /"ko"/);
  assert.match(source, /"\/rss\.xml"/);
  assert.match(source, /"\/rss-ja-blog\.xml"/);
  assert.match(source, /new URL\(redirectPath, querypieOrigin\)/);
});

test("missing route redirects sitemap-matching namespaces to querypie.com before falling back to 404", () => {
  const file = "src/app/[...missing]/page.tsx";
  const source = readSource(file);

  assert.match(source, /buildQueryPieContentRedirectUrl/);
  assert.match(source, /\[runtime-missing-redirect\]/);
  assert.match(source, /redirect\(redirectTarget\.toString\(\)\)/);
  assert.match(source, /\[runtime-404\]/);
  assert.match(source, /notFound\(\);/);
});

test("querypie locale catch-all sends non-local ja paths to querypie.com after checking local content first", () => {
  const file = "src/app/ja/[[...path]]/route.ts";
  const source = readSource(file);

  assert.match(source, /isCorpWebJapanInternalContentPath/);
  assert.match(source, /if \(isCorpWebJapanInternalContentPath\(strippedPath\)\)/);
  assert.match(source, /new URL\(request\.nextUrl\.pathname, querypieOrigin\)/);
  assert.match(source, /NextResponse\.redirect\(querypieRedirectedUrl, 307\)/);
});
