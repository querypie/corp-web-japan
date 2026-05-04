import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";
import { getAiCrewStructureSource, getTopPageStructureSource } from "./helpers/static-marketing-page-sources.mjs";

test("app font setup keeps Mona Sans on html while preloading the representative JP semibold weight from layout", () => {
  const layout = readSource("src/app/layout.tsx");
  const globals = readSource("src/app/globals.css");

  assert.match(layout, /import localFont from "next\/font\/local"/);
  assert.match(layout, /import \{ preload \} from "react-dom"/);
  assert.match(layout, /const monaSansFont = localFont\(/);
  assert.match(layout, /Mona-Sans\.woff2/);
  assert.doesNotMatch(layout, /const pretendardJPFont = localFont\(/);
  assert.doesNotMatch(layout, /PretendardJPVariable\.woff2/);
  assert.match(layout, /preload\(\s*"\/fonts\/PretendardJPSubset-600\.woff2"/);
  assert.match(layout, /as:\s*"font"/);
  assert.match(layout, /type:\s*"font\/woff2"/);
  assert.match(layout, /crossOrigin:\s*"anonymous"/);
  assert.match(layout, /<html lang="ja" className=\{monaSansFont\.variable\}>/);
  assert.match(layout, /<body className="font-sans antialiased">\{children\}<\/body>/);
  assert.doesNotMatch(layout, /fontFamily:/);

  assert.equal(existsSync(new URL("../src/app/head.tsx", import.meta.url)), false);

  assert.match(globals, /@font-face/);
  assert.match(globals, /font-family: "Pretendard JP Subset"/);
  assert.match(globals, /PretendardJPSubset-400\.woff2/);
  assert.match(globals, /PretendardJPSubset-500\.woff2/);
  assert.match(globals, /PretendardJPSubset-600\.woff2/);
  assert.match(globals, /PretendardJPSubset-700\.woff2/);
  assert.match(globals, /font-weight: 400/);
  assert.match(globals, /font-weight: 500/);
  assert.match(globals, /font-weight: 600/);
  assert.match(globals, /font-weight: 700/);
  assert.match(globals, /--font-pretendard-jp: "Pretendard JP Subset"/);
  assert.match(globals, /var\(--font-mona-sans\)/);
  assert.match(globals, /var\(--font-pretendard-jp\)/);
});

test("mobile-only fallback layout exists for the AI Crew after diagram", () => {
  const source = getAiCrewStructureSource();

  assert.match(source, /mt-8 lg:hidden/);
  assert.match(source, /hidden min-h-\[18rem\] items-center justify-center lg:flex/);
  assert.match(source, /max-w-\[23rem\]/);
});

test("AI Dashi comparison cells allow long copy to wrap on narrow screens", () => {
  const pageSource = readSource("src/app/solutions/ai-dashi/page.tsx");
  const comparisonSectionSource = readSource("src/components/sections/ai-dashi-comparison-section.tsx");
  const source = `${pageSource}\n${comparisonSectionSource}`;

  assert.match(source, /max-w-\[380px\]/);
  assert.match(source, /max-w-full text-\[15px\] font-bold/);
  assert.match(source, /max-w-full text-\[15px\] font-semibold/);
  assert.doesNotMatch(source, /flex max-w-fit flex-col items-center justify-center gap-2 text-center/);
});

test("Trust Center CTA opens in a new tab", () => {
  const page = readSource("src/app/page.tsx");
  const securitySection = readSource("src/components/sections/top-page-security-section.tsx");
  const source = `${getTopPageStructureSource()}\n${securitySection}\n${page}`;

  assert.match(source, /href=\{security\.link\.href\}|<SecurityAction href="https:\/\/trust\.querypie\.com\/">/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});
