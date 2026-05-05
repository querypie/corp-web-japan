import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/whitepapers opts into the shared load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/whitepapers/page.tsx");

  assert.match(source, /import \{ ResourceListLoadMore \} from "@\/components\/sections\/resource-list-load-more";/);
  assert.match(source, /import \{ resolveResourceListVisibleCount \} from "@\/lib\/resource-list-load-more";/);
  assert.match(source, /searchParams\?: Promise<\{\s*until\?: string \| string\[];\s*\}>;/s);
  assert.match(source, /const \[whitepaperItems, resolvedSearchParams\] = await Promise\.all\(\[listWhitepaperPublicationItems\(\), searchParams\]\);/);
  assert.match(source, /const initialVisibleCount = resolveResourceListVisibleCount\(whitepaperItems, resolvedSearchParams\?\.until\);/);
  assert.match(source, /<ResourceListLoadMore[\s\S]*items=\{whitepaperItems\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.doesNotMatch(source, /<ResourceListItems items=\{whitepaperItems\} \/>/);
});
