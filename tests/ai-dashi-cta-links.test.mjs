import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("AI Dashi CTA links match the intended targets", () => {
  const source = readSource("src/app/solutions/ai-dashi/page.tsx");

  assert.match(
    source,
    /const aiDashiWhitepaperUrl =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/30\/saas-end-or-evolution"/,
  );
  assert.match(source, /const aiDashiConsultUrl = "\/contact-us"/);
  assert.doesNotMatch(source, /href="#contact"/);
  assert.doesNotMatch(source, /href="\/whitepapers"/);
  assert.match(source, /href={aiDashiConsultUrl}/);
  assert.match(source, /href={aiDashiWhitepaperUrl}/);
});
