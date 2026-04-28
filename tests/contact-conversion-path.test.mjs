import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const CONTACT_REDIRECT_TARGET = "https://www.querypie.com/ja/company/contact-us";

test("public CTAs use the real inquiry workflow instead of #contact anchors", () => {
  const files = [
    "../src/app/page.tsx",
    "../src/app/solutions/ai-crew/page.tsx",
    "../src/app/solutions/ai-dashi/page.tsx",
    "../src/components/layout/site-header.tsx",
    "../src/components/layout/site-footer.tsx",
    "../src/components/sections/ai-crew-floating-guide.tsx",
    "../src/components/sections/ai-dashi-faq.tsx",
    "../src/components/sections/resource-post-page.tsx",
    "../src/content/home.ts",
    "../src/content/top-page.ts",
  ];

  for (const file of files) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.doesNotMatch(source, /["']\/?#contact["']/);
  }
});

test("the shared inquiry URL points to the official QueryPie contact form", () => {
  const source = readFileSync(new URL("../src/lib/contact.ts", import.meta.url), "utf8");

  assert.match(source, /CONTACT_ROUTE_PATH = "\/contact-us"/);
  assert.match(
    source,
    new RegExp(CONTACT_REDIRECT_TARGET.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
});

test("the local /contact-us route redirects to the official QueryPie contact form while preserving search params", () => {
  const source = readFileSync(new URL("../src/app/contact-us/route.ts", import.meta.url), "utf8");

  assert.match(source, /NextResponse\.redirect/);
  assert.match(source, /CONTACT_REDIRECT_TARGET/);
  assert.match(source, /request\.nextUrl\.search/);
  assert.match(source, /307/);
});
