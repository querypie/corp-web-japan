import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("legacy whitepaper resource paths are handled by dedicated static app routes", () => {
  const pluralRoot = "src/app/resources/discover/whitepapers/route.ts";
  const singularRoot = "src/app/resources/discover/white-paper/route.ts";
  const pluralDetail = "src/app/resources/discover/whitepapers/[id]/[slug]/route.ts";
  const singularDetail = "src/app/resources/discover/white-paper/[id]/[slug]/route.ts";
  const missingRoute = readSource("src/app/[...missing]/page.tsx");

  for (const file of [pluralRoot, singularRoot, pluralDetail, singularDetail]) {
    assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);
  }

  const pluralRootSource = readSource(pluralRoot);
  const singularRootSource = readSource(singularRoot);
  const pluralDetailSource = readSource(pluralDetail);
  const singularDetailSource = readSource(singularDetail);

  assert.match(pluralRootSource, /const destination = "\/whitepapers"/);
  assert.match(singularRootSource, /const destination = "\/whitepapers"/);
  assert.match(pluralDetailSource, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(singularDetailSource, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(pluralDetailSource, /NextResponse\.redirect\(`\/whitepapers\/\$\{record\.id\}\/\$\{record\.slug\}`, 307\)/);
  assert.match(singularDetailSource, /NextResponse\.redirect\(`\/whitepapers\/\$\{record\.id\}\/\$\{record\.slug\}`, 307\)/);
  assert.match(pluralDetailSource, /return NextResponse\.redirect\("\/whitepapers", 307\)/);
  assert.match(singularDetailSource, /return NextResponse\.redirect\("\/whitepapers", 307\)/);

  assert.doesNotMatch(missingRoute, /buildCorpWebJapanLegacyRedirectPath/);
});
