import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("event preview page and canonical routes are driven by event MDX publication records", () => {
  const previewPage = readSource("src/app/t/events/page.tsx");
  const listPage = readSource("src/app/events/page.tsx");
  const canonicalRoute = readSource("src/app/events/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/events/[id]/page.tsx");
  const legacyIdRoute = readSource("src/app/features/demo/webinars/[id]/route.ts");
  const legacySlugRoute = readSource("src/app/features/demo/webinars/[id]/[slug]/route.ts");
  const loader = readSource("src/lib/publications/events/get-post.ts");
  const records = readSource("src/lib/publications/events/records.ts");
  const postPage = readSource("src/components/sections/publication-post-page.tsx");

  assert.equal(existsSync(new URL("../src/app/t/events/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/events/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/features/demo/webinars/[id]/route.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/features/demo/webinars/[id]/[slug]/route.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/events/records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/events/get-post.ts", import.meta.url)), true);

  assert.match(previewPage, /listEventPublicationItems\(\)/);
  assert.match(previewPage, /canonical: "\/t\/events"/);
  assert.match(previewPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);

  assert.match(listPage, /eventItems/);
  assert.match(listPage, /return notFound\(\);/);

  assert.match(canonicalRoute, /getEventPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(canonicalRoute, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getEventPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getEventPublicationPost\(id\);/);

  assert.match(idRoute, /listEventPublicationIds\(\)/);
  assert.match(idRoute, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(idRoute, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{/);
  assert.match(idRoute, /redirect\(getEventPublicationHref\(id, record\.slug\)\)/);

  assert.match(legacyIdRoute, /getEventPublicationRecord\(id\)/);
  assert.match(legacyIdRoute, /record\.redirectUrl \?\? getEventPublicationHref\(id, record\.slug\)/);
  assert.match(legacyIdRoute, /destination\.search = request\.nextUrl\.search/);
  assert.match(legacyIdRoute, /NextResponse\.redirect\(destination, 307\)/);

  assert.match(legacySlugRoute, /getEventPublicationRecord\(id\)/);
  assert.match(legacySlugRoute, /record\.redirectUrl \?\? getEventPublicationHref\(id, record\.slug\)/);
  assert.match(legacySlugRoute, /destination\.search = request\.nextUrl\.search/);
  assert.match(legacySlugRoute, /NextResponse\.redirect\(destination, 307\)/);

  assert.match(loader, /createStandardPublicationPostLoader/);
  assert.match(loader, /formatDate: formatJapaneseDateFromIsoDate/);
  assert.match(records, /src\/content\/events/);
  assert.match(records, /eventDate\?: string/);
  assert.match(records, /eventDate: typeof eventDateValue === "string" \? eventDateValue : undefined/);
  assert.match(records, /date: formatJapaneseDateFromIsoDate\(getEffectiveEventDate\(record\)\)/);
  assert.match(records, /getListItemBadge: \(record\) => record\.eventLabel \?\? "イベント"/);
  assert.match(records, /hideHeroImageOnDetail: hideHeroImageOnDetailValue === true/);
  assert.match(records, /hidden: frontmatter\.hidden === true/);
  assert.match(records, /redirectUrl: typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
  assert.match(postPage, /post\.hideHeroImageOnDetail \? null :/);
});

test("event MDX loader supports the webinar corpus component set and route-aligned assets", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const event1 = readSource("src/content/events/1-cloud-certification-shortest-path.mdx");
  const event27 = readSource("src/content/events/27-air-company-ai-agent-security-webinar.mdx");

  assert.match(mdxComponents, /ArticleYoutubeGatingForm/);
  assert.match(mdxComponents, /EmailLink/);

  assert.match(event1, /heroImageSrc: "\/events\/1\/thumbnail\.png"/);
  assert.match(event1, /eventLabel: "ウェビナー"/);
  assert.match(event1, /hideHeroImageOnDetail: true/);
  assert.match(event1, /relatedIds:/);
  assert.match(event1, /<ArticleYoutubeGatingForm/);
  assert.doesNotMatch(event1, /public\/webinar\//);

  assert.match(event27, /heroImageSrc: "\/events\/27\/thumbnail\.png"/);
  assert.match(event27, /eventLabel: "ウェビナー"/);
  assert.match(event27, /hideHeroImageOnDetail: true/);
  assert.match(event27, /<ButtonLink href="https:\/\/us02web\.zoom\.us\/webinar\/register\//);
  assert.doesNotMatch(event27, /filepath="public\/webinar\//);
});
