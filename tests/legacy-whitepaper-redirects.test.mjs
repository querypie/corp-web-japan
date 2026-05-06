import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("missing-route handling redirects legacy whitepaper paths to local canonical whitepaper detail routes", () => {
  assert.equal(
    existsSync(new URL("../src/lib/corp-web-japan-legacy-redirect.ts", import.meta.url)),
    true,
    "legacy redirect helper should exist",
  );

  const helper = readSource("src/lib/corp-web-japan-legacy-redirect.ts");
  const missingRoute = readSource("src/app/[...missing]/page.tsx");

  assert.match(helper, /\^\\\/resources\\\/discover\\\/whitepapers\\\/\(\?<id>/);
  assert.match(helper, /\^\\\/resources\\\/discover\\\/white-paper\\\/\(\?<id>/);
  assert.match(helper, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(helper, /return `\/whitepapers\/\$\{record\.id\}\/\$\{record\.slug\}`;/);

  assert.match(missingRoute, /buildCorpWebJapanLegacyRedirectPath/);
  assert.match(missingRoute, /const localRedirectPath = buildCorpWebJapanLegacyRedirectPath\(requestedPath\)/);
  assert.match(missingRoute, /redirect\(localRedirectPath \+ search\)/);
});
