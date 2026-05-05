import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

const source = readSource("src/components/ui/progressive-load-more.tsx");

test("ProgressiveLoadMore guards progress math and hides itself once all content is loaded", () => {
  assert.match(source, /const safeTotalCount = Math\.max\(totalCount, 1\);/);
  assert.match(source, /const progressPercentage = Math\.min\(Math\.round\(\(currentCount \/ safeTotalCount\) \* 100\), 100\);/);
  assert.match(source, /if \(currentCount >= totalCount\) \{\s*return null;\s*\}/s);
});

test("ProgressiveLoadMore renders progress copy and animated progress bar for the default load-more state", () => {
  assert.match(source, /Displaying <span className="font-semibold text-slate-900">\{currentCount\}<\/span> of \{totalCount\} articles/);
  assert.match(source, /<p className="text-\[13px\] font-bold tracking-tighter text-slate-900">\{progressPercentage\}%<\/p>/);
  assert.match(source, /className="h-1 w-full overflow-hidden rounded-full bg-slate-100"/);
  assert.match(source, /className="h-full rounded-full bg-slate-900 transition-all duration-700 ease-in-out"/);
  assert.match(source, /style=\{\{ width: `\$\{progressPercentage\}%` \}\}/);
});

test("ProgressiveLoadMore switches between loading and idle button states", () => {
  assert.match(source, /disabled=\{isLoading\}/);
  assert.match(source, /\{isLoading \? \(/);
  assert.match(source, /className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"/);
  assert.match(source, /<span className="text-sm font-semibold text-slate-900">Load More<\/span>/);
  assert.match(source, /group-hover:translate-y-0\.5 group-hover:text-slate-900/);
});

test("ProgressiveLoadMore keeps the expected interactive and disabled button affordances", () => {
  assert.match(source, /onClick=\{onLoadMore\}/);
  assert.match(source, /rounded-md border border-slate-200 bg-white px-8 py-3 shadow-sm/);
  assert.match(source, /hover:border-slate-300 hover:bg-slate-50 active:scale-\[0\.98\]/);
  assert.match(source, /disabled:cursor-not-allowed disabled:opacity-50/);
  assert.match(source, /<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M19 9l-7 7-7-7" \/>/);
});
