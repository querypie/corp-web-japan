import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("app layout uses preloaded local brand fonts instead of raw @font-face declarations", () => {
  const layout = readSource("src/app/layout.tsx");
  const globals = readSource("src/app/globals.css");

  assert.match(layout, /import localFont from "next\/font\/local"/);
  assert.match(layout, /const querypieSans = localFont\(/);
  assert.match(layout, /Mona-Sans\.woff2/);
  assert.match(layout, /PretendardJPVariable\.woff2/);
  assert.match(layout, /querypieSans\.variable/);

  assert.doesNotMatch(globals, /@font-face/);
  assert.match(globals, /var\(--font-querypie-sans\)/);
});

test("mobile-only fallback layout exists for the AI Crew after diagram", () => {
  const source = readSource("src/components/sections/home-page-sections.tsx");

  assert.match(source, /mt-8 lg:hidden/);
  assert.match(source, /hidden min-h-\[18rem\] items-center justify-center lg:flex/);
  assert.match(source, /max-w-\[23rem\]/);
});

test("AI Dashi comparison cells allow long copy to wrap on narrow screens", () => {
  const source = readSource("src/app/solutions/ai-dashi/page.tsx");

  assert.match(source, /max-w-\[380px\]/);
  assert.match(source, /max-w-full text-\[15px\] font-bold/);
  assert.match(source, /max-w-full text-\[15px\] font-semibold/);
  assert.doesNotMatch(source, /flex max-w-fit flex-col items-center justify-center gap-2 text-center/);
});
