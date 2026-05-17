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
    destination: "/platforms/acp",
  },
  {
    requestPath: "/pricing",
    file: "src/app/pricing/route.ts",
    destination: "/plans",
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
    destination: "/platforms/aip",
  },
  {
    requestPath: "/platform/ai/aip/usage-based-llm",
    file: "src/app/platform/ai/aip/usage-based-llm/route.ts",
    destination: "/platforms/aip/usage-based-llm",
  },
  {
    requestPath: "/platform/ai/aip/fde-services",
    file: "src/app/platform/ai/aip/fde-services/route.ts",
    destination: "/services/fde",
  },
  {
    requestPath: "/platform/ai/aip/mcp-gateway",
    file: "src/app/platform/ai/aip/mcp-gateway/route.ts",
    destination: "/platforms/aip/mcp-gateway",
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

test("remaining redirect endpoints are defined in a single test-case table with temporary redirect destinations", () => {
  assert.equal(expectedRedirectRules.length, 14);

  for (const rule of expectedRedirectRules) {
    assert.equal(existsSync(new URL(`../${rule.file}`, import.meta.url)), true, `${rule.file} should exist`);

    const source = readSource(rule.file);

    assert.match(source, /export function GET\(/);
    assert.match(source, /307/);
    assert.ok(source.includes(rule.destination), `missing redirect destination: ${rule.destination}`);

    if (rule.requestPath === "/pricing") {
      assert.match(source, /export function GET\(request: NextRequest\)/);
      assert.match(source, /export const HEAD = GET;/);
      assert.ok(source.includes("new URL(\"/plans\", request.url)"));
      assert.ok(source.includes("redirectedUrl.search = request.nextUrl.search;"));
    }

    if (rule.requestPath === "/ja") {
      assert.match(source, /export function GET\(request: NextRequest\)/);
      assert.match(source, /export const HEAD = GET;/);
      assert.ok(source.includes("request.nextUrl.pathname.replace(/^\\/ja(?=\\/|$)/"));
      assert.ok(source.includes("const strippedPath = request.nextUrl.pathname.replace(/^\\/ja(?=\\/|$)/, \"\") || \"/\";"));
      assert.ok(source.includes("new URL(strippedPath, request.url)"));
      assert.ok(source.includes("redirectedUrl.search = request.nextUrl.search;"));
    }
  }
});

test("resource rollout replaced the former public redirect endpoints with local page routes", () => {
  for (const file of [
    "src/app/resources/page.tsx",
    "src/app/introduction-deck/page.tsx",
    "src/app/glossary/page.tsx",
    "src/app/manuals/page.tsx",
  ]) {
    assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);
  }

  for (const file of [
    "src/app/resources/route.ts",
    "src/app/introduction-deck/route.ts",
    "src/app/glossary/route.ts",
    "src/app/manuals/route.ts",
  ]) {
    assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), false, `${file} should be removed`);
  }
});

test("/t/contact-us route is fully removed after public rollout", () => {
  assert.equal(existsSync(new URL("../src/app/t/contact-us/route.ts", import.meta.url)), false);
});

test("/t/news preview entrypoint has been removed after public rollout", () => {
  assert.equal(existsSync(new URL("../src/app/t/news/page.tsx", import.meta.url)), false);
});

test("/t/services/fde preview entrypoint has been removed after public rollout", () => {
  assert.equal(existsSync(new URL("../src/app/t/services/fde/page.tsx", import.meta.url)), false);
});

test("/services/fde is now a local public page and replaces the old redirect", () => {
  assert.equal(existsSync(new URL("../src/app/services/fde/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/services/fde/route.ts", import.meta.url)), false);
});

test("/platforms/acp is now a local public page and replaces the old preview route", () => {
  assert.equal(existsSync(new URL("../src/app/platforms/acp/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/platforms/acp/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/platforms/acp/page.tsx", import.meta.url)), false);
});

test("/platforms/acp/integrations is now a local public page and replaces the old preview route", () => {
  assert.equal(existsSync(new URL("../src/app/platforms/acp/integrations/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/t/platforms/acp/integrations/page.tsx", import.meta.url)), false);
});

test("/t/about-us and /t/certifications preview entrypoints are removed after public rollout", () => {
  assert.equal(existsSync(new URL("../src/app/t/about-us/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/certifications/page.tsx", import.meta.url)), false);
});

test("rolled-out demo list pages replace preview entrypoints without redirects", () => {
  assert.equal(existsSync(new URL("../src/app/use-cases/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/demo/aip/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/demo/acp/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/t/use-cases/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/demo/aip/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/demo/acp/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/demo/aip/route.ts", import.meta.url)), false);
});

test("/platforms/aip is now a local public page and replaces preview plus public redirect", () => {
  assert.equal(existsSync(new URL("../src/app/platforms/aip/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/platforms/aip/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/platforms/aip/page.tsx", import.meta.url)), false);
});

test("platforms/aip/integrations replaces legacy redirect with local public page", () => {
  assert.equal(existsSync(new URL("../src/app/platforms/aip/integrations/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/platform/ai/aip/integrations/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/t/platforms/aip/integrations/page.tsx", import.meta.url)), false);
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

