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
    requestPath: "/demo/use-cases",
    file: "src/app/demo/use-cases/route.ts",
    destination: "https://www.querypie.com/ja/features/demo?category=use-cases",
  },
  {
    requestPath: "/demo/aip",
    file: "src/app/demo/aip/route.ts",
    destination: "https://www.querypie.com/ja/features/demo?category=aip-features",
  },
  {
    requestPath: "/demo/acp",
    file: "src/app/demo/acp/route.ts",
    destination: "https://www.querypie.com/ja/features/demo?category=acp-features",
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
    requestPath: "/news",
    file: "src/app/news/route.ts",
    destination: "https://www.querypie.com/ja/company/news",
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
  assert.equal(expectedRedirectRules.length, 14);

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
