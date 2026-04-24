import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("app layout keeps the PR 48 self-hosted brand font setup", () => {
  const layout = readSource("src/app/layout.tsx");
  const globals = readSource("src/app/globals.css");

  assert.doesNotMatch(layout, /next\/font\/local/);
  assert.doesNotMatch(layout, /querypieSans\.variable/);
  assert.match(globals, /@font-face/);
  assert.match(globals, /Mona-Sans\.woff2/);
  assert.match(globals, /PretendardJPVariable\.woff2/);
  assert.match(globals, /font-family: "QueryPie Sans"/);
  assert.match(globals, /"QueryPie Sans"/);
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

test("Trust Center CTA opens in a new tab", () => {
  const source = readSource("src/components/sections/top-page-sections.tsx");

  assert.match(source, /href=\{security\.link\.href\}/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});
