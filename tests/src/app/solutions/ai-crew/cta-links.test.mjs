import test from "node:test";
import assert from "node:assert/strict";
import { getAiCrewDataSource } from "../../../../helpers/static-marketing-page-sources.mjs";

test("AI Crew CTA links match the intended targets", () => {
  const aiCrewDataSource = getAiCrewDataSource();

  assert.match(
    aiCrewDataSource,
    /const demoUseCasesUrl = "\/demo\/use-cases"|export const demoUseCasesUrl = "\/demo\/use-cases"/,
  );
  assert.match(
    aiCrewDataSource,
    /const aiCrewWhitepaperUrl =\s*"\/whitepapers\/24\/ai-transformation-japan"|export const aiCrewWhitepaperUrl =\s*"\/whitepapers\/24\/ai-transformation-japan"/,
  );
  assert.match(aiCrewDataSource, /const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"|export const aiCrewConsultUrl = "\/contact-us\?inquiry=ai-consulting&product=ai-crew"/);
  assert.match(
    aiCrewDataSource,
    /secondaryCta: \{ label: "活用事例を見る", href: demoUseCasesUrl \}|<AICrewHeroSecondaryAction href=\{demoUseCasesUrl\}>/,
  );
  assert.match(
    aiCrewDataSource,
    /const aiCrewFloatingCtaUrl = "\/contact-us\?product=ai-crew"|<FloatingConversionCta href=\{aiCrewFloatingCtaUrl\} \/>/,
  );
});
