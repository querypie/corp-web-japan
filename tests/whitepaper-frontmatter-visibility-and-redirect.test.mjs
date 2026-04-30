import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper publication frontmatter supports hidden list items and external detail redirects", () => {
  const source = readSource("src/content/publications/whitepapers.ts");

  assert.match(source, /hidden\?: boolean;/);
  assert.match(source, /redirectUrl\?: string;/);
  assert.match(source, /hidden:\s*frontmatter\.hidden\s*===\s*true/);
  assert.match(source, /redirectUrl:\s*typeof redirectUrlValue === "string" \? redirectUrlValue : undefined/);
});

test("whitepaper publication list excludes only frontmatter-hidden records while preserving full record lookup", () => {
  const source = readSource("src/content/publications/whitepapers.ts");

  assert.match(source, /whitepaperPublicationRecords\s*\.filter\(\(record\) => !record\.hidden\)/s);
  assert.match(source, /const whitepaperPublicationRecordById = new Map<string, WhitepaperPublicationRecord>\(/);
  assert.match(source, /listWhitepaperPublicationParams\(\) \{\s*return whitepaperPublicationRecords\.map\(\(\{ id, slug \}\) => \(\{ id, slug \}\)\);\s*\}/s);
});

test("whitepaper detail routes redirect to a frontmatter redirectUrl before rendering the local post", () => {
  const idOnlyRouteSource = readSource("src/app/whitepapers/[id]/page.tsx");
  const slugRouteSource = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");

  assert.match(idOnlyRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /const post = await getWhitepaperPublicationPost\(id\);/);
});

test("whitepaper 25 keeps its original body while adding only a short redirect note in frontmatter", () => {
  const source = readSource("src/content/whitepapers/25.mdx");

  assert.match(source, /hidden:\s*true/);
  assert.match(source, /# Created only for the Korean translation whitepaper flow\./);
  assert.match(source, /# Redirect this shadow record to the real Japan whitepaper 24 route\./);
  assert.match(source, /redirectUrl:\s*"\/whitepapers\/24\/ai-transformation-japan"/);
  assert.match(source, /gated:\s*true/);
  assert.match(source, /# はじめに/);
});
