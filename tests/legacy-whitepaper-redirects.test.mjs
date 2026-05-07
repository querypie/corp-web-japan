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

  assert.match(pluralRootSource, /export function GET\(request: Request\)/);
  assert.match(singularRootSource, /export function GET\(request: Request\)/);
  assert.match(pluralRootSource, /const destination = new URL\("\/whitepapers", request\.url\)/);
  assert.match(singularRootSource, /const destination = new URL\("\/whitepapers", request\.url\)/);
  assert.match(pluralRootSource, /return NextResponse\.redirect\(destination, 307\)/);
  assert.match(singularRootSource, /return NextResponse\.redirect\(destination, 307\)/);
  assert.match(pluralDetailSource, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(singularDetailSource, /getWhitepaperPublicationRecord\(id\)/);
  assert.match(pluralDetailSource, /export async function GET\(request: Request, \{ params \}: LegacyWhitepaperRouteContext\)/);
  assert.match(singularDetailSource, /export async function GET\(request: Request, \{ params \}: LegacyWhitepaperRouteContext\)/);
  assert.match(pluralDetailSource, /const destinationPath = record \? `\/whitepapers\/\$\{record\.id\}\/\$\{record\.slug\}` : "\/whitepapers"/);
  assert.match(singularDetailSource, /const destinationPath = record \? `\/whitepapers\/\$\{record\.id\}\/\$\{record\.slug\}` : "\/whitepapers"/);
  assert.match(pluralDetailSource, /const destination = new URL\(destinationPath, request\.url\)/);
  assert.match(singularDetailSource, /const destination = new URL\(destinationPath, request\.url\)/);
  assert.match(pluralDetailSource, /return NextResponse\.redirect\(destination, 307\)/);
  assert.match(singularDetailSource, /return NextResponse\.redirect\(destination, 307\)/);

  assert.doesNotMatch(missingRoute, /buildCorpWebJapanLegacyRedirectPath/);
});
