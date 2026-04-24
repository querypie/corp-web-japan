import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("launch-risk CTA targets resolve to explicit anchors or real destinations", () => {
  const homeContent = readSource("src/content/home.ts");
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const topPage = readSource("src/app/page.tsx");
  const aiCrewFloatingGuide = readSource("src/components/sections/ai-crew-floating-guide.tsx");
  const aiDashiFaq = readSource("src/components/sections/ai-dashi-faq.tsx");
  const resourcePostPage = readSource("src/components/sections/resource-post-page.tsx");

  assert.match(homeContent, /primaryCta: \{ label: "業務に合うAI活用を相談する", href: "#contact" \}/);
  assert.match(homeContent, /floatingCta: \{ label: "業務に合うAI活用を相談する", href: "#contact" \}/);
  assert.match(homeContent, /secondaryCta: \{ label: "業務に合うAI活用を相談する", href: "#contact" \}/);
  assert.match(homeContent, /primaryCta: \{ label: "進め方を相談する", href: "#contact" \}/);
  assert.match(homeContent, /partnerCta: \{ label: "自社サービスAI化の進め方を見る", href: "\/solutions\/ai-dashi" \}/);
  assert.match(homeContent, /primaryCta: \{ label: "すべての活用事例を見る", href: demoUseCasesUrl \}/);

  assert.match(topPage, /<FloatingConversionCta href="#contact" \/>/);
  assert.match(aiCrewPage, /<FloatingConversionCta href="#contact" \/>/);
  assert.match(aiCrewFloatingGuide, /ctaHref: "#contact"/);
  assert.match(aiDashiFaq, /href="\/#contact"/);
  assert.match(resourcePostPage, /href="\/#contact"/);

  assert.doesNotMatch(homeContent, /href: "#"/);
  assert.doesNotMatch(aiCrewFloatingGuide, /ctaHref: "#"/);
  assert.doesNotMatch(aiDashiFaq, /href="#"/);
  assert.doesNotMatch(resourcePostPage, /href="#"/);
});

test("events stays out of the sitemap until launch and redirect-only resource aliases stay out too", () => {
  const eventsPage = readSource("src/app/events/page.tsx");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(eventsPage, /canonical: "\/events"/);
  assert.doesNotMatch(eventsPage, /return notFound\(\);/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/events"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/resources"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/manuals"\)/);
  assert.doesNotMatch(sitemap, /absoluteUrl\("\/glossary"\)/);
});

test("robots and sitemap metadata files exist and cover the core public routes", () => {
  const robots = readSource("src/app/robots.ts");
  const sitemap = readSource("src/app/sitemap.ts");

  assert.match(robots, /sitemap: `\$\{siteUrl\.toString\(\)\}sitemap\.xml`/);
  assert.match(robots, /host: siteUrl\.toString\(\)/);

  assert.match(sitemap, /absoluteUrl\("\/"\)/);
  assert.match(sitemap, /absoluteUrl\("\/solutions\/ai-crew"\)/);
  assert.match(sitemap, /absoluteUrl\("\/solutions\/ai-dashi"\)/);
  assert.match(sitemap, /absoluteUrl\("\/demo\/use-cases"\)/);
  assert.match(sitemap, /absoluteUrl\("\/blog"\)/);
  assert.match(sitemap, /absoluteUrl\("\/whitepapers"\)/);
  assert.match(sitemap, /listResourcePostParams\(\)/);
});
