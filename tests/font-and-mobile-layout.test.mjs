import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("app layout uses separated local Mona Sans and Pretendard JP font variables", () => {
  const layout = readSource("src/app/layout.tsx");
  const globals = readSource("src/app/globals.css");

  assert.match(layout, /import localFont from "next\/font\/local"/);
  assert.match(layout, /const monaSansFont = localFont\(/);
  assert.match(layout, /const pretendardJPFont = localFont\(/);
  assert.match(layout, /Mona-Sans\.woff2/);
  assert.match(layout, /PretendardJPVariable\.woff2/);
  assert.match(layout, /monaSansFont\.variable/);
  assert.match(layout, /pretendardJPFont\.variable/);

  assert.doesNotMatch(globals, /@font-face/);
  assert.match(globals, /var\(--font-mona-sans\)/);
  assert.match(globals, /var\(--font-pretendard-jp\)/);
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
