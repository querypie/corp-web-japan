import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const expectedRedirectRules = [
  {
    requestPath: "/cookie-preference",
    file: "src/app/cookie-preference/route.ts",
    destination: "https://www.querypie.com/ja/cookie-preference",
  },
  {
    requestPath: "/terms-of-service",
    file: "src/app/terms-of-service/route.ts",
    destination: "https://www.querypie.com/ja/terms-of-service",
  },
  {
    requestPath: "/privacy-policy",
    file: "src/app/privacy-policy/route.ts",
    destination: "https://www.querypie.com/ja/privacy-policy",
  },
  {
    requestPath: "/eula",
    file: "src/app/eula/route.ts",
    destination: "https://www.querypie.com/ja/eula",
  },
];

test("legal redirect endpoints exist and use temporary redirects to QueryPie Japan", () => {
  for (const rule of expectedRedirectRules) {
    assert.equal(existsSync(new URL(`../${rule.file}`, import.meta.url)), true, `${rule.requestPath} route should exist`);

    const source = readSource(rule.file);

    assert.match(source, /export function GET\(/);
    assert.match(source, /NextResponse\.redirect\(destination, 307\)/);
    assert.match(source, /export const HEAD = GET/);
    assert.match(source, new RegExp(rule.destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
