import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("footer shows the Internal section only when preview mode is enabled", () => {
  const footer = readSource("src/components/layout/site-footer.tsx");

  assert.match(footer, /previewModeEnabled\s*\?/);
  assert.match(footer, /title:\s*"Internal"/);
  assert.match(footer, /label:\s*"Internal Hub"/);
  assert.match(footer, /href:\s*"\/internal"/);
  assert.match(footer, /label:\s*"Whitepaper Gating Demo"/);
  assert.match(footer, /href:\s*"\/internal\/whitepaper-gating-demo"/);
  assert.match(footer, /label:\s*"MDX List Demo"/);
  assert.match(footer, /href:\s*"\/internal\/mdx-list-demo"/);
  assert.match(footer, /label:\s*"Load More Demo"/);
  assert.match(footer, /href:\s*"\/internal\/load-more"/);
});
