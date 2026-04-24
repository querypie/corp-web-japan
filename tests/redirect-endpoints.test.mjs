import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const expectedRedirectRules = [
  {
    requestPath: "/services/aip",
    file: "src/app/services/aip/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip",
  },
  {
    requestPath: "/services/acp",
    file: "src/app/services/acp/route.ts",
    destination: "https://www.querypie.com/ja/solutions/acp",
  },
  {
    requestPath: "/services/fde",
    file: "src/app/services/fde/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip/fde-services",
  },
];

test("redirect endpoints are defined in a single test-case table with temporary redirect destinations", () => {
  assert.equal(expectedRedirectRules.length, 3);

  for (const rule of expectedRedirectRules) {
    assert.equal(existsSync(new URL(`../${rule.file}`, import.meta.url)), true, `${rule.file} should exist`);

    const source = readSource(rule.file);

    assert.match(source, /export function GET\(/);
    assert.match(source, /307/);
    assert.match(source, new RegExp(rule.destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
