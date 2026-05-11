import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

const publicIndexableDetailRoutes = [
  "src/app/blog/[id]/[slug]/page.tsx",
  "src/app/whitepapers/[id]/[slug]/page.tsx",
  "src/app/news/[id]/[slug]/page.tsx",
  "src/app/events/[id]/[slug]/page.tsx",
  "src/app/use-cases/[id]/[slug]/page.tsx",
  "src/app/demo/aip/[id]/[slug]/page.tsx",
  "src/app/demo/acp/[id]/[slug]/page.tsx",
  "src/app/introduction-deck/[id]/[slug]/page.tsx",
  "src/app/glossary/[id]/[slug]/page.tsx",
  "src/app/manuals/[id]/[slug]/page.tsx",
];

const publicIndexableListRoutes = [
  "src/app/resources/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/whitepapers/page.tsx",
  "src/app/news/page.tsx",
  "src/app/events/page.tsx",
  "src/app/introduction-deck/page.tsx",
  "src/app/glossary/page.tsx",
  "src/app/manuals/page.tsx",
  "src/app/demo/use-cases/page.tsx",
  "src/app/demo/aip/page.tsx",
  "src/app/demo/acp/page.tsx",
];

test("public MDX-backed detail routes are indexable for search engines", () => {
  for (const routePath of publicIndexableDetailRoutes) {
    const source = read(routePath);

    assert.match(
      source,
      /robots:\s*\{\s*index:\s*true,\s*follow:\s*true,\s*\}/s,
      `${routePath} should explicitly allow indexing`,
    );
  }
});

test("public MDX-backed list routes are indexable for search engines", () => {
  for (const routePath of publicIndexableListRoutes) {
    const source = read(routePath);

    assert.match(
      source,
      /robots:\s*\{\s*index:\s*true,\s*follow:\s*true,\s*\}/s,
      `${routePath} should explicitly allow indexing`,
    );
  }
});

test("internal, preview, and whitepaper pdf-only routes stay non-indexable", () => {
  const nonIndexableRoutes = [
    "src/app/internal/page.tsx",
    "src/app/internal/events-demo/page.tsx",
    "src/app/internal/load-more/page.tsx",
    "src/app/internal/mdx-list-demo/page.tsx",
    "src/app/internal/whitepaper-gating-demo/page.tsx",
    "src/app/t/about-us/page.tsx",
    "src/app/t/certifications/page.tsx",
    "src/app/t/cookie-preference/page.tsx",
    "src/app/t/eula/page.tsx",
    "src/app/t/plans/page.tsx",
    "src/app/t/services/acp/page.tsx",
    "src/app/t/services/aip/page.tsx",
    "src/app/t/services/fde/page.tsx",
    "src/app/t/solutions/aip/fde-services/page.tsx",
    "src/app/t/solutions/aip/usage-based-llm/page.tsx",
    "src/app/t/terms-of-service/page.tsx",
    "src/app/whitepapers/[id]/[slug]/pdf/page.tsx",
  ];

  for (const routePath of nonIndexableRoutes) {
    const source = read(routePath);

    assert.match(
      source,
      /robots:\s*\{\s*index:\s*false,\s*follow:\s*false,\s*\}/s,
      `${routePath} should stay non-indexable`,
    );
  }
});
