import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/services/as400-cobol keeps reference notes as route-local authored copy", () => {
  assert.equal(sourceExists("src/app/services/as400-cobol/page.tsx"), true);
  assert.equal(sourceExists("src/app/services/as400-cobol/page.ko.tsx"), true);
  assert.equal(sourceExists("src/components/sections/as400-cobol/section.tsx"), true);

  const routeSource = readSource("src/app/services/as400-cobol/page.tsx");
  const koreanRouteSource = readSource("src/app/services/as400-cobol/page.ko.tsx");
  const sectionSource = readSource("src/components/sections/as400-cobol/section.tsx");

  for (const source of [routeSource, koreanRouteSource]) {
    assert.match(source, /As400CobolReferenceNotes/);
    assert.match(source, /As400CobolMarketReferenceNotes/);
    assert.match(source, /As400CobolModernizationReferenceNotes/);
    assert.match(source, /As400CobolMigrationReferenceNotes/);
    assert.match(source, /community\.ibm\.com\/community\/user\/blogs\/hirotsugu-hara\/2024\/09\/03\/ibm-i-developer-task-blog/);
    assert.match(source, /power\.fortra\.com\/resources\/guides\/outlook-ibm-i-2026-ibm-i-marketplace-survey-results/);
    assert.match(source, /meti\.go\.jp\/policy\/it_policy\/dx\/20180907_02\.pdf/);
    assert.match(source, /idc\.com\/resource-center\/press-releases/);
    assert.match(source, /techtarget\.itmedia\.co\.jp\/tt\/news\/2407\/16\/news04\.html/);
    assert.match(source, /prtimes\.jp\/main\/html\/rd\/p\/000001509\.000011650\.html/);
    assert.match(source, /ipa\.go\.jp\/digital\/chousa\/dx-trend\/dx-trend-2025\.html/);
    assert.match(source, /it\.impress\.co\.jp\/articles\/-\/26675/);
  }

  assert.match(sectionSource, /export function As400CobolReferenceNotes/);
  assert.match(sectionSource, /export function As400CobolReferenceNote/);
  assert.match(sectionSource, /export function As400CobolReferenceLink/);
  assert.match(sectionSource, /componentNameDebugProps\("As400CobolReferenceNotes"\)/);
  assert.match(sectionSource, /componentNameDebugProps\("As400CobolReferenceLink"\)/);
});
