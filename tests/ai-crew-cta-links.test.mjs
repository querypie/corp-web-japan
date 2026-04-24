import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("AI Crew CTA links match the CTA inventory targets", () => {
  const homeContent = readFileSync(
    new URL("../src/content/home.ts", import.meta.url),
    "utf8",
  );
  const floatingGuide = readFileSync(
    new URL("../src/components/sections/ai-crew-floating-guide.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    homeContent,
    /const demoUseCasesUrl = "https:\/\/www\.querypie\.com\/ja\/features\/demo\?category=use-cases"/,
  );
  assert.match(
    homeContent,
    /const aiCrewWhitepaperUrl =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/24\/ai-tranformation-japan"/,
  );
  assert.doesNotMatch(homeContent, /secondaryCta: \{ label: "活用事例を見る", href: "#roles" \}/);
  assert.doesNotMatch(
    homeContent,
    /https:\/\/www\.querypie\.ai\/ja\/features\/demo\?category=use-cases/,
  );
  assert.doesNotMatch(
    homeContent,
    /https:\/\/www\.querypie\.ai\/ja\/features\/documentation\/white-paper\/24\/ai-tranformation-japan/,
  );

  assert.match(floatingGuide, /ctaLabel: "活用事例を見る"/);
  assert.match(floatingGuide, /ctaHref: "\/solutions\/ai-crew#roles"/);
  assert.match(floatingGuide, /ctaHref: "\/demo\/use-cases"/);
});
