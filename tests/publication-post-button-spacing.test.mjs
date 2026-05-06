import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("publication post body gives ButtonLink top spacing when it follows text blocks", () => {
  const source = readSource("src/components/sections/publication-post-page.tsx");

  assert.match(source, /\[&_p\+_\.article-content-btn\]:mt-4/);
  assert.match(source, /\[&_ul\+_\.article-content-btn\]:mt-4/);
  assert.match(source, /\[&_ol\+_\.article-content-btn\]:mt-4/);
});
