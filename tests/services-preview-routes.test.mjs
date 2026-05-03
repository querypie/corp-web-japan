import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const previewPages = [
  {
    file: "src/app/t/services/aip/page.tsx",
    canonical: 'canonical: "/t/services/aip"',
    title: 'QueryPie AIプラットフォーム (AIP)',
  },
  {
    file: "src/app/t/services/acp/page.tsx",
    canonical: 'canonical: "/t/services/acp"',
    title: 'QueryPie アクセス制御プラットフォーム (ACP)',
  },
  {
    file: "src/app/t/services/fde/page.tsx",
    canonical: 'canonical: "/t/services/fde"',
    title: 'QueryPie FDE AXを成功に導く専門家チーム',
  },
];

const redirectRoutes = [
  {
    file: "src/app/services/aip/route.ts",
    destination: 'const destination = "https://www.querypie.com/ja/solutions/aip";',
  },
  {
    file: "src/app/services/acp/route.ts",
    destination: 'const destination = "https://www.querypie.com/ja/solutions/acp";',
  },
  {
    file: "src/app/services/fde/route.ts",
    destination: 'const destination = "https://www.querypie.com/ja/solutions/aip/fde-services";',
  },
];
test("/t/services preview pages exist with noindex metadata and canonical preview paths", () => {
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

test("/services redirect routes remain unchanged upstream redirects while preview pages exist separately", () => {
  for (const route of redirectRoutes) {
    const source = readSource(route.file);

    assert.doesNotMatch(source, /import isProduction from "@\/lib\/is-production";/);
    assert.match(source, new RegExp(route.destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(source, /export function GET\(\) \{/);
    assert.match(source, /return NextResponse\.redirect\(destination, 307\);/);
    assert.match(source, /export const HEAD = GET;/);
  }
});