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
    requestPath: "/api-docs.html",
    file: "src/app/api-docs.html/route.ts",
    destination: "https://docs.querypie.com/ja/api-reference",
  },
  {
    requestPath: "/ja",
    file: "src/app/ja/[[...path]]/route.ts",
    destination: "/",
  },
  {
    requestPath: "/platform/ai/aihub",
    file: "src/app/platform/ai/aihub/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip",
  },
  {
    requestPath: "/platform/ai/aip",
    file: "src/app/platform/ai/aip/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip",
  },
  {
    requestPath: "/platform/ai/aip/integrations",
    file: "src/app/platform/ai/aip/integrations/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip/integrations",
  },
  {
    requestPath: "/platform/ai/aip/usage-based-llm",
    file: "src/app/platform/ai/aip/usage-based-llm/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip/usage-based-llm",
  },
  {
    requestPath: "/platform/ai/aip/fde-services",
    file: "src/app/platform/ai/aip/fde-services/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip/fde-services",
  },
  {
    requestPath: "/platform/ai/aip/mcp-gateway",
    file: "src/app/platform/ai/aip/mcp-gateway/route.ts",
    destination: "https://www.querypie.com/ja/solutions/aip/mcp-gateway",
  },
  {
    requestPath: "/platform/security/database-access-controller",
    file: "src/app/platform/security/database-access-controller/route.ts",
    destination: "https://www.querypie.com/ja/solutions/acp/database-access-controller",
  },
  {
    requestPath: "/platform/security/system-access-controller",
    file: "src/app/platform/security/system-access-controller/route.ts",
    destination: "https://www.querypie.com/ja/solutions/acp/system-access-controller",
  },
  {
    requestPath: "/platform/security/kubernetes-access-controller",
    file: "src/app/platform/security/kubernetes-access-controller/route.ts",
    destination: "https://www.querypie.com/ja/solutions/acp/kubernetes-access-controller",
  },
  {
    requestPath: "/platform/security/web-access-controller",
    file: "src/app/platform/security/web-access-controller/route.ts",
    destination: "https://www.querypie.com/ja/solutions/acp/web-access-controller",
  },
];

test("redirect endpoints are defined in a single test-case table with temporary redirect destinations", () => {
  assert.equal(expectedRedirectRules.length, 21);

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
  assert.equal(existsSync(new URL("../src/app/demo/acp/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/t/use-cases/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/demo/aip/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/demo/acp/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/demo/aip/route.ts", import.meta.url)), false);
});

test("legacy company news root path redirects to the local /news page", () => {
  const file = "src/app/company/news/route.ts";

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);

  assert.match(source, /import type \{ NextRequest \} from "next\/server";/);
  assert.match(source, /const destinationPath = "\/news";/);
  assert.match(source, /const destination = new URL\(destinationPath, request\.url\);/);
  assert.match(source, /destination\.search = request\.nextUrl\.search;/);
  assert.match(source, /return NextResponse\.redirect\(destination, 307\);/);
  assert.match(source, /export const HEAD = GET;/);
  assert.equal(existsSync(new URL("../src/app/[locale]/company/news/route.ts", import.meta.url)), false);
});
