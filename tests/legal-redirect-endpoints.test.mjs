import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const publishedLegalPages = [
  { path: "/cookie-preference", page: "src/app/cookie-preference/page.tsx", oldRoute: "src/app/cookie-preference/route.ts" },
  { path: "/terms-of-service", page: "src/app/terms-of-service/page.tsx", oldRoute: "src/app/terms-of-service/route.ts" },
  { path: "/privacy-policy", page: "src/app/privacy-policy/page.tsx", oldRoute: "src/app/privacy-policy/route.ts", canonicalPattern: /canonicalPath: "\/privacy-policy"/ },
  { path: "/eula", page: "src/app/eula/page.tsx", oldRoute: "src/app/eula/route.ts" },
];

test("legal endpoints render local published pages instead of redirecting to QueryPie Japan", () => {
  for (const page of publishedLegalPages) {
    assert.equal(existsSync(new URL(`../${page.page}`, import.meta.url)), true, `${page.path} page should exist`);
    assert.equal(existsSync(new URL(`../${page.oldRoute}`, import.meta.url)), false, `${page.path} redirect route should be removed`);

    const source = readSource(page.page);

    assert.doesNotMatch(source, /NextResponse\.redirect/);
    assert.doesNotMatch(source, /www\.querypie\.com\/ja/);
    const canonicalPattern = page.canonicalPattern ?? new RegExp(`canonical: "${page.path.replace(/\//g, "\\/")}"`);
    assert.match(source, canonicalPattern);
  }
});
