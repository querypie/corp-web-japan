import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/services/as400-cobol keeps AS400 copy updates separated from reference notes", () => {
  assert.equal(sourceExists("src/app/services/as400-cobol/page.tsx"), true);
  assert.equal(sourceExists("src/app/services/as400-cobol/page.ko.tsx"), true);

  const routeSource = readSource("src/app/services/as400-cobol/page.tsx");
  const koreanRouteSource = readSource("src/app/services/as400-cobol/page.ko.tsx");

  assert.match(routeSource, /value="国内約2万社"/);
  assert.match(routeSource, /value="約70%"/);
  assert.match(routeSource, /value="最大12兆円\/年"/);
  assert.doesNotMatch(routeSource, /4,000〜8,000社|85〜92%/);

  assert.match(koreanRouteSource, /value="국내 약 2만 개사"/);
  assert.match(koreanRouteSource, /value="약 70%"/);
  assert.match(koreanRouteSource, /value="최대 12조 엔\/년"/);
  assert.match(koreanRouteSource, /eyebrow="쇄신이 필요한 이유"/);
  assert.match(koreanRouteSource, /eyebrow="AI 활용"/);
  assert.match(koreanRouteSource, /title="API로 외부화"/);
  assert.match(koreanRouteSource, /개보수 시 영향 범위/);
  assert.doesNotMatch(
    koreanRouteSource,
    /Why Modernize|AI Approach|API Wrapper|4,000~8,000개사|85~92%/,
  );
});
