import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("event preview page and canonical routes are driven by event MDX publication records", () => {
  const previewPage = readSource("src/app/t/events/page.tsx");
  const listPage = readSource("src/app/events/page.tsx");
  const canonicalRoute = readSource("src/app/events/[id]/[slug]/page.tsx");
  const idRoute = readSource("src/app/events/[id]/page.tsx");
  const loader = readSource("src/lib/publications/get-event-publication-post.ts");
  const records = readSource("src/lib/publications/event-publication-records.ts");

  assert.equal(existsSync(new URL("../src/app/t/events/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/events/[id]/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/event-publication-records.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/lib/publications/get-event-publication-post.ts", import.meta.url)), true);

  assert.match(previewPage, /listEventPublicationItems\(\)/);
  assert.match(previewPage, /canonical: "\/t\/events"/);
  assert.match(previewPage, /robots:\s*\{[\s\S]*index: false,[\s\S]*follow: false,[\s\S]*\}/);

  assert.match(listPage, /eventItems/);
  assert.match(listPage, /return notFound\(\);/);

  assert.match(canonicalRoute, /getEventPublicationRecord\(id\)/);
  assert.match(canonicalRoute, /if \(record\.slug !== slug\) \{/);
  assert.match(canonicalRoute, /redirect\(getEventPublicationHref\(id, record\.slug\)\)/);
  assert.match(canonicalRoute, /const post = await getEventPublicationPost\(id\);/);

  assert.match(idRoute, /listEventPublicationIds\(\)/);
  assert.match(idRoute, /redirect\(getEventPublicationHref\(id, record\.slug\)\)/);

  assert.match(loader, /renderPublicationMdx/);
  assert.match(loader, /extractHeadingsFromMdx/);
  assert.match(records, /src\/content\/events/);
  assert.match(records, /badge: "イベント"/);
});

test("event MDX loader supports the webinar corpus component set and route-aligned assets", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const event1 = readSource("src/content/events/1.mdx");
  const event27 = readSource("src/content/events/27.mdx");

  assert.match(mdxComponents, /ArticleYoutubeGatingForm/);
  assert.match(mdxComponents, /EmailLink/);

  assert.match(event1, /heroImageSrc: "\/events\/1\/thumbnail\.png"/);
  assert.match(event1, /relatedIds:/);
  assert.match(event1, /<ArticleYoutubeGatingForm/);
  assert.doesNotMatch(event1, /public\/webinar\//);

  assert.match(event27, /heroImageSrc: "\/events\/27\/thumbnail\.png"/);
  assert.match(event27, /<ButtonLink href="https:\/\/us02web\.zoom\.us\/webinar\/register\//);
  assert.doesNotMatch(event27, /filepath="public\/webinar\//);
});
