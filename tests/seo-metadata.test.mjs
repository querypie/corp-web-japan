import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("SEO baseline files define production metadata and canonical paths", () => {
  const layout = read("src/app/layout.tsx");
  const robots = read("src/app/robots.ts");
  const sitemap = read("src/app/sitemap.ts");
  const homePage = read("src/app/page.tsx");
  const blogPage = read("src/app/blog/page.tsx");
  const whitepapersPage = read("src/app/whitepapers/page.tsx");
  const useCasesRoute = read("src/app/demo/use-cases/route.ts");
  const aiCrewPage = read("src/app/solutions/ai-crew/page.tsx");
  const aiDashiPage = read("src/app/solutions/ai-dashi/page.tsx");
  const contactUsPage = read("src/app/contact-us/page.tsx");
  const postPage = read("src/app/posts/[category]/[slug]/page.tsx");
  const eventsPage = read("src/app/events/page.tsx");

  assert.match(layout, /metadataBase:\s*siteUrl/);

  assert.match(robots, /sitemap:\s*`\$\{siteUrl\.toString\(\)\}sitemap\.xml`/);
  assert.match(robots, /host:\s*siteUrl\.toString\(\)/);

  assert.match(homePage, /canonical:\s*"\/"/);
  assert.match(blogPage, /canonical:\s*"\/blog"/);
  assert.match(whitepapersPage, /canonical:\s*"\/whitepapers"/);
  assert.match(useCasesRoute, /https:\/\/www\.querypie\.com\/ja\/features\/demo\?category=use-cases/);
  assert.match(aiCrewPage, /canonical:\s*"\/solutions\/ai-crew"/);
  assert.match(aiDashiPage, /canonical:\s*"\/solutions\/ai-dashi"/);
  assert.match(contactUsPage, /canonical:\s*"\/contact-us"/);
  assert.match(postPage, /canonical:/);
  assert.match(eventsPage, /title: "イベント \| QueryPie AI"/);
  assert.doesNotMatch(eventsPage, /canonical:\s*"\/events"/);

  assert.match(sitemap, /absoluteUrl\("\/whitepapers"\)/);
  assert.match(sitemap, /absoluteUrl\("\/contact-us"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/whitepaper"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/demo\/use-cases"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/events"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/glossary"\)/);
});
