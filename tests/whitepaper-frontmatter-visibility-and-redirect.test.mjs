import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper publication frontmatter supports hidden list items and external detail redirects", () => {
  const source = readSource("src/lib/publications/whitepapers/records.ts");

  assert.match(source, /hidden\?: boolean;/);
  assert.match(source, /redirectUrl\?: string;/);
  assert.match(source, /hidden:\s*frontmatter\.hidden\s*===\s*true/);
  assert.match(source, /redirectUrl:\s*typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
});

test("whitepaper publication list excludes only frontmatter-hidden records while preserving full record lookup", () => {
  const source = readSource("src/lib/publications/whitepapers/records.ts");

  assert.match(source, /createStandardPublicationRecordsRepository/);
  assert.match(source, /listWhitepaperPublicationItems\(\): readonly WhitepaperPublicationListItem\[] \{\s*return whitepaperPublicationRepository\.listItems;\s*\}/s);
  assert.match(source, /listWhitepaperPublicationParams\(\) \{\s*return whitepaperPublicationRepository\.listParams\(\);\s*\}/s);
  assert.match(source, /getWhitepaperPublicationRecord\(id: string\) \{\s*return whitepaperPublicationRepository\.getRecord\(id\);\s*\}/s);
});

test("whitepaper redirect-backed detail routes redirect only human visitors while preserving local bot-rendered content paths", () => {
  const idOnlyRouteSource = readSource("src/app/whitepapers/[id]/page.tsx");
  const slugRouteSource = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");

  assert.match(idOnlyRouteSource, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(slugRouteSource, /shouldRedirectHumanVisitorFromRedirectablePublication/);
  assert.match(idOnlyRouteSource, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /if \(record\.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication\(\)\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /if \(record\.redirectUrl\) \{[\s\S]*robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(slugRouteSource, /const post = await getWhitepaperPublicationPost\(id\);/);
});

test("whitepaper 25 keeps its original body while adding only a short redirect note in frontmatter", () => {
  const source = readSource("src/content/whitepapers/25-ai-transformation-japan.mdx");

  assert.match(source, /hidden:\s*true/);
  assert.match(source, /# Created only for the Korean translation whitepaper flow\./);
  assert.match(source, /# Redirect this shadow record to the real Japan whitepaper 24 route\./);
  assert.match(source, /redirectUrl:\s*"\/whitepapers\/24\/ai-transformation-japan"/);
  assert.match(source, /downloadCta:\n  href: "\/whitepapers\/24\/QP_Whitepaper_AI_Transformation_JP\.pdf"/);
  assert.doesNotMatch(source, /gated:\s*true/);
  assert.match(source, /# はじめに/);
});

test("whitepaper frontmatter parser supports explicit download CTA metadata", () => {
  const source = readSource("src/lib/publications/whitepapers/records.ts");

  assert.match(source, /downloadCta\?: \{/);
  assert.match(source, /const downloadCtaValue = frontmatter\.downloadCta/);
  assert.match(source, /downloadCta,/);
});
