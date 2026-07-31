import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("top hero defers AIP motion until after the static poster is displayed", () => {
  const homePage = readSource("src/app/page.tsx");
  const heroSection = readSource("src/components/sections/home/hero-section.tsx");
  const aipMotion = readSource("src/components/sections/home/hero-aip-motion.tsx");

  assert.match(homePage, /motionPosterSrc="\/optimized\/top-aip-hero-poster\.jpg"/);
  assert.match(homePage, /Home-AIP\.mp4#t=0\.001/);
  assert.match(homePage, /motionDelayMs=\{3000\}/);
  assert.match(heroSection, /<HeroAipMotion/);
  assert.match(aipMotion, /prefers-reduced-motion: reduce/);
  assert.match(aipMotion, /setTimeout\(\(\) => setShouldLoadVideo\(true\), delayMs\)/);
  assert.match(aipMotion, /poster=\{posterSrc\}/);
  assert.match(aipMotion, /preload="metadata"/);
  assert.doesNotMatch(homePage, /B-BAQRoMUnU/);
});
