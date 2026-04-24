import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("AI Crew CTA links match the intended targets", () => {
  const homeContent = readSource("src/content/home.ts");
  const floatingGuide = readSource("src/components/sections/ai-crew-floating-guide.tsx");

  assert.match(
    homeContent,
    /const demoUseCasesUrl = "\/demo\/use-cases"/,
  );
  assert.match(
    homeContent,
    /const aiCrewWhitepaperUrl =\s*"https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/24\/ai-tranformation-japan"/,
  );
  assert.match(homeContent, /primaryCta: \{ label: "業務に合うAI活用を相談する", href: "\/contact-us\?inquiry=ai-consulting&product=ai-crew" \}/);
  assert.match(homeContent, /secondaryCta: \{ label: "活用事例を見る", href: demoUseCasesUrl \}/);
  assert.match(homeContent, /floatingCta: \{ label: "業務に合うAI活用を相談する", href: "\/contact-us\?product=ai-crew" \}/);

  assert.match(floatingGuide, /ctaHref: "\/demo\/use-cases"/);
  assert.match(floatingGuide, /ctaHref: "\/contact-us\?inquiry=ai-consulting&product=ai-crew"/);
});
