import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("AI Dashi CTA links match the CTA inventory targets", () => {
  const source = readFileSync(
    new URL("../src/app/solutions/ai-dashi/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /const AI_DASHI_WHITEPAPER_URL =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/30\/saas-end-or-evolution"/,
  );
  assert.doesNotMatch(source, /href="#ai-dashi-cta"/);
  assert.doesNotMatch(source, /href="\/whitepaper"/);
  assert.doesNotMatch(
    source,
    /https:\/\/www\.querypie\.ai\/ja\/features\/documentation\/white-paper\/30\/saas-end-or-evolution/,
  );
  assert.match(source, /href=\{CONTACT_AI_DASHI_URL\}/);
  assert.match(source, /FloatingConversionCta href=\{CONTACT_AI_DASHI_PRODUCT_URL\}/);
  assert.match(source, /href=\{AI_DASHI_WHITEPAPER_URL\}/);
});
