import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("publication post body uses production-style inline link defaults", () => {
  const source = readSource("src/components/sections/publication-post-page.tsx");

  assert.match(source, /\[&_a\]:font-inherit/);
  assert.match(source, /\[&_a\]:text-slate-950/);
  assert.match(source, /\[&_a\]:no-underline/);
  assert.match(source, /\[&_a:hover\]:text-slate-950/);
  assert.match(source, /\[&_a:hover\]:underline/);
  assert.match(source, /\[&_a:hover\]:decoration-\[1px\]/);
  assert.match(source, /\[&_a:hover\]:underline-offset-\[3px\]/);
  assert.match(source, /\[&_a:focus-visible\]:underline/);
  assert.match(source, /\[&_a:focus-visible\]:decoration-\[1px\]/);
  assert.match(source, /\[&_a:focus-visible\]:underline-offset-\[3px\]/);
  assert.doesNotMatch(source, /hover:\[&_a\]:underline/);
  assert.doesNotMatch(source, /focus-visible:\[&_a\]:underline/);
  assert.doesNotMatch(source, /\[&_a\]:text-\[#2563EB\]/);
});

test("publication post body keeps link-wrapped strong text from overriding link color", () => {
  const source = readSource("src/components/sections/publication-post-page.tsx");

  assert.match(source, /\[&_a_strong\]:font-inherit/);
  assert.match(source, /\[&_a_strong\]:text-inherit/);
});
