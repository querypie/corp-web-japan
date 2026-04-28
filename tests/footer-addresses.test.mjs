import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("footer uses the latest company address block", () => {
  const footer = readFileSync(new URL("../src/components/layout/site-footer.tsx", import.meta.url), "utf8");

  assert.match(footer, /© 2026 QueryPie AI All rights reserved\./);
  assert.match(footer, /2525 West 8th Street, Suite 300, Los Angeles, CA 90057/);
  assert.match(footer, /R&D: ソウル特別市江西区麻谷中央1路26 7F/);
  assert.match(footer, /虎ノ門ヒルズ ビジネスタワー15F/);

  assert.doesNotMatch(footer, /3003 North 1st Street, Suite 221, San Jose, CA 95134/);
  assert.doesNotMatch(footer, /ソウル江南/);
});
