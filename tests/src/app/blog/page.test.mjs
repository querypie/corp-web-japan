import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/blog opts into the shared load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/blog/page.tsx");

  assert.match(source, /import \{ ResourceListLoadMore \} from "@\/components\/sections\/resource-list-load-more";/);
  assert.match(source, /import \{ resolveResourceListVisibleCount \} from "@\/lib\/resource-list-load-more";/);
  assert.match(source, /searchParams\?: Promise<\{\s*until\?: string \| string\[];\s*\}>;/s);
  assert.match(source, /const \[blogItems, resolvedSearchParams\] = await Promise\.all\(\[listBlogPublicationItems\(\), searchParams\]\);/);
  assert.match(source, /const initialVisibleCount = resolveResourceListVisibleCount\(blogItems, resolvedSearchParams\?\.until\);/);
  assert.match(source, /<ResourceListLoadMore[\s\S]*items=\{blogItems\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.doesNotMatch(source, /<ResourceListItems items=\{blogItems\} \/>/);
});
