import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/use-cases uses the dedicated demo sidebar with the active use-case label", () => {
  const source = readSource("src/app/t/use-cases/page.tsx");

  assert.match(source, /from "@\/components\/sections\/demo-category-sidebar"/);
  assert.match(source, /<DemoCategorySidebar activeLabel="活用事例" \/>/);
});

test("/t/use-cases opts into the shared load-more flow with URL-restored visible counts", () => {
  const source = readSource("src/app/t/use-cases/page.tsx");

  assert.match(source, /import \{ ResourceListLoadMore \} from "@\/components\/sections\/resource-list-load-more";/);
  assert.match(source, /import \{ resolveResourceListVisibleCount \} from "@\/lib\/resource-list-load-more";/);
  assert.match(source, /searchParams\?: Promise<\{\s*until\?: string \| string\[];\s*\}>;/s);
  assert.match(source, /const \[useCaseItems, resolvedSearchParams\] = await Promise\.all\(\[listUseCasePublicationItems\(\), searchParams\]\);/);
  assert.match(source, /const initialVisibleCount = resolveResourceListVisibleCount\(useCaseItems, resolvedSearchParams\?\.until\);/);
  assert.match(source, /<ResourceListLoadMore[\s\S]*items=\{useCaseItems\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.doesNotMatch(source, /<ResourceListItems items=\{useCaseItems\} \/>/);
});
