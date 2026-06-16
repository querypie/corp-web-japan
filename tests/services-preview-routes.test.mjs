import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const previewPages = [];

const removedPreviewRoutes = [
  "src/app/t/platforms/aip/page.tsx",
  "src/app/t/services/aip/page.tsx",
  "src/app/t/services/aip/integrations/page.tsx",
  "src/app/t/services/acp/page.tsx",
  "src/app/t/solutions/aip/usage-based-llm/page.tsx",
  "src/app/t/platforms/aip/usage-based-llm/page.tsx",
  "src/app/t/solutions/aip/mcp-gateway/page.tsx",
  "src/app/t/platforms/aip/mcp-gateway/page.tsx",
  "src/app/t/platforms/aip/integrations/page.tsx",
  "src/app/t/platforms/acp/page.tsx",
  "src/app/t/platforms/acp/integrations/page.tsx",
  "src/app/t/platforms/acp/database-access-controller/page.tsx",
  "src/app/t/platforms/acp/system-access-controller/page.tsx",
  "src/app/t/platforms/acp/kubernetes-access-controller/page.tsx",
  "src/app/t/platforms/acp/web-access-controller/page.tsx",
];

const redirectRoutes = [
  {
    file: "src/app/services/aip/route.ts",
    destination: 'new URL("/platforms/aip", request.url)',
  },
  {
    file: "src/app/services/acp/route.ts",
    destination: 'new URL("/platforms/acp", request.url)',
  },
  {
    file: "src/app/services/as400-cobol/route.ts",
    destination: 'const destinationPath = "/solutions/as400-cobol";',
  },
];
test("/t platform preview pages exist with noindex metadata and canonical preview paths", () => {
  for (const page of previewPages) {
    assert.equal(existsSync(new URL(`../${page.file}`, import.meta.url)), true, `${page.file} should exist`);

    const source = readSource(page.file);

    assert.match(source, /export const metadata: Metadata = \{/);
    assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
    assert.match(source, new RegExp(page.canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(source, new RegExp(page.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(source, /<SiteHeader \/>/);
    assert.match(source, /<SiteFooter \/>/);
  }
});

test("old AIP and ACP preview routes are removed without compatibility redirects", () => {
  for (const routePath of removedPreviewRoutes) {
    assert.equal(existsSync(new URL(`../${routePath}`, import.meta.url)), false, `${routePath} should be removed`);
  }
});

test("remaining /services redirect routes point at their intended upstream or local canonical destinations", () => {
  for (const route of redirectRoutes) {
    const source = readSource(route.file);

    assert.doesNotMatch(source, /import isProduction from "@\/lib\/is-production";/);
    assert.match(source, new RegExp(route.destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(source, /export function GET\(/);
    assert.match(source, /return NextResponse\.redirect\(/);
    assert.match(source, /export const HEAD = GET;/);
  }
});
