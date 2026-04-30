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

  assert.match(source, /records\.filter\(\(record\) => !record\.hidden\)/);
  assert.match(source, /const recordsById = new Map<string, WhitepaperPublicationRecord>\(records\.map\(\(record\) => \[record\.id, record\]\)\);/);
  assert.match(source, /listWhitepaperPublicationItems\(\): readonly WhitepaperPublicationListItem\[] \{\s*return getWhitepaperPublicationCache\(\)\.listItems;\s*\}/s);
  assert.match(source, /listWhitepaperPublicationParams\(\) \{\s*return getWhitepaperPublicationCache\(\)\.records\.map\(\(\{ id, slug \}\) => \(\{ id, slug \}\)\);\s*\}/s);
});

test("whitepaper detail routes redirect to a frontmatter redirectUrl before rendering the local post", () => {
  const idOnlyRouteSource = readSource("src/app/whitepapers/[id]/page.tsx");
  const slugRouteSource = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");

  assert.match(idOnlyRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /if \(record\.redirectUrl\) \{\s*redirect\(record\.redirectUrl\);\s*\}/s);
  assert.match(slugRouteSource, /const post = await getWhitepaperPublicationPost\(id\);/);
});
