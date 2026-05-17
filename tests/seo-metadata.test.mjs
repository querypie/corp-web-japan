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
  const useCasesPage = read("src/app/use-cases/page.tsx");
  const aipPage = read("src/app/demo/aip/page.tsx");
  const acpPage = read("src/app/demo/acp/page.tsx");
  const aiCrewPage = read("src/app/solutions/ai-crew/page.tsx");
  const aiDashiPage = read("src/app/solutions/ai-dashi/page.tsx");
  const contactUsPage = read("src/app/contact-us/page.tsx");
  const resourcesPage = read("src/app/resources/page.tsx");
  const introductionDeckPage = read("src/app/introduction-deck/page.tsx");
  const glossaryPage = read("src/app/glossary/page.tsx");
  const manualsPage = read("src/app/manuals/page.tsx");
  const eventsPage = read("src/app/events/page.tsx");
  const cookiePreferencePage = read("src/app/cookie-preference/page.tsx");
  const termsOfServicePage = read("src/app/terms-of-service/page.tsx");
  const privacyPolicyPage = read("src/app/privacy-policy/page.tsx");
  const eulaPage = read("src/app/eula/page.tsx");

  assert.match(layout, /metadataBase:\s*siteUrl/);

  assert.match(robots, /sitemap:\s*`\$\{siteUrl\.toString\(\)\}sitemap\.xml`/);
  assert.match(robots, /host:\s*siteUrl\.toString\(\)/);
  assert.match(robots, /disallow:\s*\["\/privacy-policy", "\/terms-of-service"\]/);

  assert.match(homePage, /canonical:\s*"\/"/);
  assert.match(blogPage, /canonical:\s*"\/blog"/);
  assert.match(whitepapersPage, /canonical:\s*"\/whitepapers"/);
  assert.match(useCasesPage, /canonical:\s*"\/use-cases"/);
  assert.match(aipPage, /canonical:\s*"\/demo\/aip"/);
  assert.match(acpPage, /canonical:\s*"\/demo\/acp"/);
  assert.match(aiCrewPage, /canonical:\s*"\/solutions\/ai-crew"/);
  assert.match(aiDashiPage, /canonical:\s*"\/solutions\/ai-dashi"/);
  assert.match(contactUsPage, /canonical:\s*"\/contact-us"/);
  assert.match(resourcesPage, /canonical:\s*"\/resources"/);
  assert.match(introductionDeckPage, /canonical:\s*"\/introduction-deck"/);
  assert.match(glossaryPage, /canonical:\s*"\/glossary"/);
  assert.match(manualsPage, /canonical:\s*"\/manuals"/);
  assert.match(eventsPage, /title: "イベント \| QueryPie AI"/);
  assert.match(eventsPage, /canonical:\s*"\/events"/);
  assert.match(cookiePreferencePage, /canonical:\s*"\/cookie-preference"/);
  assert.match(termsOfServicePage, /canonical:\s*"\/terms-of-service"/);
  assert.match(privacyPolicyPage, /canonicalPath: "\/privacy-policy"/);
  assert.match(eulaPage, /canonical:\s*"\/eula"/);

  assert.match(sitemap, /absoluteUrl\("\/whitepapers"\)/);
  assert.match(sitemap, /absoluteUrl\("\/contact-us"\)/);
  assert.match(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.match(sitemap, /absoluteUrl\("\/introduction-deck"\)/);
  assert.match(sitemap, /absoluteUrl\("\/glossary"\)/);
  assert.match(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/whitepaper"\)/);
  assert.match(sitemap, /getBlogPublicationHref/);
  assert.match(sitemap, /getWhitepaperPublicationHref/);
  assert.match(sitemap, /getNewsPublicationHref/);
  assert.match(sitemap, /getEventPostHref/);
  assert.match(sitemap, /absoluteUrl\("\/use-cases"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/aip"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/acp"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/demo\/use-cases"\)/);
  assert.match(sitemap, /absoluteUrl\("\/events"\)/);
  assert.match(sitemap, /absoluteUrl\("\/cookie-preference"\)/);
  assert.match(sitemap, /legal pages,[\s\S]*intentionally noindex and therefore omitted from the sitemap/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/terms-of-service"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/privacy-policy"\)/);
  assert.match(sitemap, /absoluteUrl\("\/eula"\)/);
});
