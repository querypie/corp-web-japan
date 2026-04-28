import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("publication post body uses production-style inline link defaults", () => {
  const source = readSource("src/components/PublicationPostPage.tsx");

  assert.match(source, /\[&_a\]:font-inherit/);
  assert.match(source, /\[&_a\]:text-slate-950/);
  assert.match(source, /\[&_a\]:no-underline/);
  assert.match(source, /hover:\[&_a\]:text-slate-950/);
  assert.doesNotMatch(source, /\[&_a\]:text-\[#2563EB\]/);
  assert.doesNotMatch(source, /\[&_a\]:underline/);
});

test("publication post body keeps link-wrapped strong text from overriding link color", () => {
  const source = readSource("src/components/PublicationPostPage.tsx");

  assert.match(source, /\[&_a_strong\]:font-inherit/);
  assert.match(source, /\[&_a_strong\]:text-inherit/);
});
