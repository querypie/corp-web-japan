import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("AI Dashi CTA links match the intended targets", () => {
  const source = readSource("src/app/solutions/ai-dashi/page.tsx");
  const links = readSource("src/content/ai-dashi-links.ts");

  assert.match(
    links,
    /export const aiDashiWhitepaperUrl =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/30\/saas-end-or-evolution"/,
  );
  assert.match(links, /export const aiDashiFloatingUrl = "\/contact-us\?product=ai-dashi"/);
  assert.match(links, /export const aiDashiConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-dashi"/);
  assert.doesNotMatch(source, /href="#contact"/);
  assert.doesNotMatch(source, /href="\/whitepapers"/);
  assert.match(source, /href={aiDashiConsultUrl}/);
  assert.match(source, /<FloatingConversionCta href={aiDashiFloatingUrl} \/>/);
  assert.match(source, /href={aiDashiWhitepaperUrl}/);
});
