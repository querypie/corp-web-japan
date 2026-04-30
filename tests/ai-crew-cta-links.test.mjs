import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";
import { getAiCrewDataSource } from "./helpers/static-marketing-page-sources.mjs";

test("AI Crew CTA links match the intended targets", () => {
  const aiCrewDataSource = getAiCrewDataSource();
  const floatingGuide = readSource("src/components/sections/ai-crew-floating-guide.tsx");

  assert.match(
    aiCrewDataSource,
    /const demoUseCasesUrl = "\/demo\/use-cases"|export const demoUseCasesUrl = "\/demo\/use-cases"/,
  );
  assert.match(
    aiCrewDataSource,
    /const aiCrewWhitepaperUrl =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/24\/ai-transformation-japan"|export const aiCrewWhitepaperUrl =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/24\/ai-transformation-japan"/,
  );
  assert.match(aiCrewDataSource, /const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"|export const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"/);
  assert.match(aiCrewDataSource, /secondaryCta: \{ label: "活用事例を見る", href: demoUseCasesUrl \}/);
  assert.match(aiCrewDataSource, /floatingCta: \{ label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl \}/);

  assert.match(floatingGuide, /ctaHref: demoUseCasesUrl/);
  assert.match(floatingGuide, /ctaHref: aiCrewConsultUrl/);
});
