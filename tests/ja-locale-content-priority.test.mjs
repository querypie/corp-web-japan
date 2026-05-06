import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("corp-web-japan internal content helper tracks the current local content paths", () => {
  const file = "src/lib/corp-web-japan-internal-content-path.ts";

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);

  assert.match(source, /"\/"/);
  assert.match(source, /"\/blog"/);
  assert.match(source, /"\/whitepapers"/);
  assert.match(source, /"\/solutions\/ai-crew"/);
  assert.match(source, /"\/solutions\/ai-dashi"/);
  assert.match(source, /eventItems\.map\(\(item\) => item\.href\)/);
  assert.match(source, /export function isCorpWebJapanInternalContentPath/);
});

test("ja locale catch-all prefers corp-web-japan local content before redirecting to querypie.com/ja", () => {
  const file = "src/app/ja/[[...path]]/route.ts";
  const source = readSource(file);

  assert.match(source, /isCorpWebJapanInternalContentPath/);
  assert.match(source, /const strippedPath = request\.nextUrl\.pathname\.replace/);
  assert.match(source, /if \(strippedPath === "\/company\/news"\)/);
  assert.match(source, /new URL\("\/news", request\.url\)/);
  assert.match(source, /if \(isCorpWebJapanInternalContentPath\(strippedPath\)\)/);
  assert.match(source, /new URL\(strippedPath, request\.url\)/);
  assert.match(source, /new URL\(request\.nextUrl\.pathname, querypieOrigin\)/);
});
