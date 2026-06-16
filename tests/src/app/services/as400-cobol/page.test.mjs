import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/services/as400-cobol keeps references inline with sourced route-local copy", () => {
  assert.equal(sourceExists("src/app/services/as400-cobol/page.tsx"), true);
  assert.equal(sourceExists("src/app/services/as400-cobol/page.ko.tsx"), true);
  assert.equal(sourceExists("src/components/sections/as400-cobol/section.tsx"), true);

  const routeSource = readSource("src/app/services/as400-cobol/page.tsx");
  const koreanRouteSource = readSource("src/app/services/as400-cobol/page.ko.tsx");
  const sectionSource = readSource("src/components/sections/as400-cobol/section.tsx");

  for (const source of [routeSource, koreanRouteSource]) {
    assert.match(source, /As400CobolReferenceLink/);
    assert.doesNotMatch(source, /As400CobolReferenceNotes/);
    assert.doesNotMatch(source, /As400CobolReferenceNote/);
    assert.doesNotMatch(source, /As400CobolMarketReferenceNotes/);
    assert.doesNotMatch(source, /As400CobolModernizationReferenceNotes/);
    assert.doesNotMatch(source, /As400CobolMigrationReferenceNotes/);
    assert.match(source, /community\.ibm\.com\/community\/user\/blogs\/hirotsugu-hara\/2024\/09\/03\/ibm-i-developer-task-blog/);
    assert.match(source, /power\.fortra\.com\/resources\/guides\/outlook-ibm-i-2026-ibm-i-marketplace-survey-results/);
    assert.match(source, /meti\.go\.jp\/policy\/it_policy\/dx\/20180907_02\.pdf/);
    assert.match(source, /idc\.com\/resource-center\/press-releases/);
    assert.match(source, /techtarget\.itmedia\.co\.jp\/tt\/news\/2407\/16\/news04\.html/);
    assert.match(source, /prtimes\.jp\/main\/html\/rd\/p\/000001509\.000011650\.html/);
    assert.match(source, /ipa\.go\.jp\/digital\/chousa\/dx-trend\/dx-trend-2025\.html/);
    assert.match(source, /it\.impress\.co\.jp\/articles\/-\/26675/);
    assert.doesNotMatch(source, /4,000[〜~]8,000/);
    assert.doesNotMatch(source, /85[〜~]92/);
  }

  assert.match(routeSource, /value="国内約2万社"/);
  assert.match(routeSource, /value="約70%"/);
  assert.match(routeSource, /value="最大12兆円\/年"/);
  assert.match(koreanRouteSource, /value="국내 약 2만 개사"/);
  assert.match(koreanRouteSource, /value="약 70%"/);
  assert.match(koreanRouteSource, /value="최대 12조 엔\/년"/);
  assert.match(koreanRouteSource, /eyebrow="쇄신이 필요한 이유"/);
  assert.match(koreanRouteSource, /eyebrow="AI 활용"/);
  assert.match(koreanRouteSource, /title="API로 외부화"/);
  assert.match(koreanRouteSource, /\(참고\)/);
  assert.doesNotMatch(koreanRouteSource, /Why Modernize|AI Approach|API Wrapper/);

  assert.match(sectionSource, /export function As400CobolReferenceLink/);
  assert.match(sectionSource, /children = "\(参考\)"/);
  assert.match(sectionSource, /<sup className="relative -top-\[0\.25em\] ml-1 align-baseline text-\[10px\]/);
  assert.match(sectionSource, /componentNameDebugProps\("As400CobolReferenceLink"\)/);
  assert.match(sectionSource, /aria-label=\{ariaLabel\}/);
  assert.doesNotMatch(sectionSource, /export function As400CobolReferenceNotes/);
  assert.doesNotMatch(sectionSource, /export function As400CobolReferenceNote/);
});
