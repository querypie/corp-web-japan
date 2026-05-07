import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

const slugRoutes = [
  "src/app/blog/[id]/[slug]/page.tsx",
  "src/app/whitepapers/[id]/[slug]/page.tsx",
  "src/app/news/[id]/[slug]/page.tsx",
  "src/app/events/[id]/[slug]/page.tsx",
  "src/app/use-cases/[id]/[slug]/page.tsx",
  "src/app/demo/aip/[id]/[slug]/page.tsx",
  "src/app/demo/acp/[id]/[slug]/page.tsx",
];

const idRoutes = [
  "src/app/blog/[id]/page.tsx",
  "src/app/whitepapers/[id]/page.tsx",
  "src/app/news/[id]/page.tsx",
  "src/app/events/[id]/page.tsx",
  "src/app/use-cases/[id]/page.tsx",
  "src/app/demo/aip/[id]/page.tsx",
  "src/app/demo/acp/[id]/page.tsx",
];

test("redirectable publication helper classifies search bots from the request user-agent", () => {
  const helper = read("src/lib/publications/redirectable-publication-request.ts");

  assert.match(helper, /SEARCH_BOT_USER_AGENT_PATTERN/);
  assert.match(helper, /isSearchBotUserAgent/);
  assert.match(helper, /headers\(\)/);
  assert.match(helper, /shouldRedirectHumanVisitorFromRedirectablePublication/);
});

test("redirect-backed publication routes redirect only human visitors while preserving local canonical bot paths", () => {
  for (const route of slugRoutes) {
    const source = read(route);
    assert.match(source, /shouldRedirectHumanVisitorFromRedirectablePublication/, `${route} should use the shared bot-aware redirect helper`);
    assert.match(source, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s, `${route} should only redirect redirectUrl records for human visitors`);
  }

  for (const route of idRoutes) {
    const source = read(route);
    assert.match(source, /shouldRedirectHumanVisitorFromRedirectablePublication/, `${route} should use the shared bot-aware redirect helper`);
    assert.match(source, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s, `${route} should only redirect redirectUrl records for human visitors`);
  }
});
