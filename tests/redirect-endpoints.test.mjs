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
  {
    requestPath: "/about-us",
    file: "src/app/about-us/route.ts",
    destination: "https://www.querypie.com/ja/company/about-us",
  },
  {
    requestPath: "/certifications",
    file: "src/app/certifications/route.ts",
    destination: "https://www.querypie.com/ja/company/certifications",
  },

  {
    requestPath: "/introduction-deck",
    file: "src/app/introduction-deck/route.ts",
    destination: "https://www.querypie.com/ja/features/documentation?category=introduction-deck",
  },
  {
    requestPath: "/resources",
    file: "src/app/resources/route.ts",
    destination: "https://www.querypie.com/ja/features/documentation?category=all",
  },
  {
    requestPath: "/manuals",
    file: "src/app/manuals/route.ts",
    destination: "https://www.querypie.com/ja/features/documentation?category=manual",
  },
  {
    requestPath: "/glossary",
    file: "src/app/glossary/route.ts",
    destination: "https://www.querypie.com/ja/features/documentation?category=glossary",
  },
  {
    requestPath: "/ja",
    file: "src/app/ja/[[...path]]/route.ts",
    destination: "/",
  },
];

test("redirect endpoints are defined in a single test-case table with temporary redirect destinations", () => {
  assert.equal(expectedRedirectRules.length, 10);

  for (const rule of expectedRedirectRules) {
    assert.equal(existsSync(new URL(`../${rule.file}`, import.meta.url)), true, `${rule.file} should exist`);

    const source = readSource(rule.file);

    assert.match(source, /export function GET\(/);
    assert.match(source, /307/);
    assert.match(source, new RegExp(rule.destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

    if (rule.requestPath === "/ja") {
      assert.match(source, /export function GET\(request: NextRequest\)/);
      assert.match(source, /export const HEAD = GET;/);
      assert.match(source, /request\.nextUrl\.pathname\.replace\(\/\^\\\/ja\(\?=\\\/\|\$\)\//);
      assert.match(source, /const strippedPath = .* \|\| "\/";/);
      assert.match(source, /new URL\(strippedPath, request\.url\)/);
      assert.match(source, /redirectedUrl\.search = request\.nextUrl\.search;/);
    }
  }
});

test("/t/contact-us route is fully removed after public rollout", () => {
  assert.equal(existsSync(new URL("../src/app/t/contact-us/route.ts", import.meta.url)), false);
});

test("/t/news preview entrypoint has been removed after public rollout", () => {
  assert.equal(existsSync(new URL("../src/app/t/news/page.tsx", import.meta.url)), false);
});


test("rolled-out demo list pages replace preview entrypoints without redirects", () => {
  assert.equal(existsSync(new URL("../src/app/demo/use-cases/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/demo/aip/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/demo-acp/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/t/use-cases/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/demo/aip/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/demo/acp/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/demo/aip/route.ts", import.meta.url)), false);
});
