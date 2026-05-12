import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/internal/load-more page exists as a noindex demo route and opts into load-more state", () => {
  const file = "src/app/internal/load-more/page.tsx";
  assert.equal(sourceExists(file), true, `${file} should exist`);

  const source = readSource(file);
  assert.match(source, /canonical: "\/internal\/load-more"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /const \[blogItems, resolvedSearchParams\] = await Promise\.all\(/);
  assert.match(source, /resolveResourceListVisibleCount\(blogItems, resolvedSearchParams\?\.until\)/);
  assert.match(source, /initialVisibleCount=\{initialVisibleCount\}/);
  assert.match(source, /items=\{blogItems\}/);
});
