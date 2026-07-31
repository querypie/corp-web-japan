import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("Lingo discovery links preserve each marketing page's context", () => {
  const spotlight = readSource("src/components/sections/app-spotlight-card.tsx");
  const homePage = readSource("src/app/page.tsx");
  const aiCrewPage = readSource("src/app/solutions/ai-crew/page.tsx");
  const aiDashiPage = readSource("src/app/solutions/ai-dashi/page.tsx");
  const aipPage = readSource("src/app/platforms/aip/page.tsx");

  assert.match(spotlight, /icon-lingo\.png/);
  assert.match(spotlight, /bg-\[linear-gradient\(135deg,#e9e2ff/);

  assert.match(homePage, /会議から、AI活用を始める。/);
  assert.match(homePage, /utm_campaign=home_lingo/);
  assert.match(homePage, /<RoadmapCalloutBadge>Apps<\/RoadmapCalloutBadge>/);
  assert.match(homePage, /日々の業務で使えるAIアプリを、目的に合わせて選べます。/);
  assert.match(homePage, /className="pb-0 pt-6 lg:pb-0 lg:pt-8"/);

  assert.match(aiCrewPage, /会議で生まれる情報も、AIで整える。/);
  assert.match(aiCrewPage, /utm_campaign=solution_ai_crew_lingo/);
  assert.match(aiCrewPage, /<span[^>]*>Apps<\/span>/);
  assert.match(aiCrewPage, /日々の業務で使えるAIアプリを、目的に合わせて選べます。/);
  assert.match(aiCrewPage, /max-w-\[1120px\]/);
  assert.match(aiCrewPage, /flushX/);

  assert.match(aiDashiPage, /実務に溶け込むAIアプリの一例、Lingo。/);
  assert.match(aiDashiPage, /utm_campaign=solution_ai_dashi_lingo/);

  assert.match(aipPage, /会議を、次の業務につなげるLingo。/);
  assert.match(aipPage, /utm_campaign=platform_aip_lingo/);
});
