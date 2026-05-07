import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/internal/events-demo delegates demo hero-state resolution to the event publication helper", () => {
  const file = "src/app/internal/events-demo/page.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../../src/app/internal/events-demo/page.tsx", import.meta.url)), true);
  assert.match(source, /title:\s*"Internal Events Demo \| QueryPie AI"/);
  assert.match(source, /canonical:\s*"\/internal\/events-demo"/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*false/);
  assert.match(source, /searchParams\?: Promise<\{/);
  assert.match(source, /asof\?: string \| string\[];/);
  assert.match(source, /upcoming\?: string \| string\[];/);
  assert.match(source, /resolveInternalEventsDemoState\(resolvedSearchParams\)/);
  assert.match(source, /demoHeroEvent/);
  assert.match(source, /showUpcomingEvent/);
  assert.match(source, /visiblePastEvents/);
  assert.match(source, /InternalEventsDemoHeroToggle/);
  assert.match(source, /disabled=\{!demoHeroEvent\}/);
  assert.match(source, /showUpcomingEvent && demoHeroEvent/);
  assert.match(source, /FeaturedEventHero/);
  assert.match(source, /InternalEventsDemoEmptyState/);
  assert.match(source, /eyebrow="Upcoming Event"/);
  assert.match(source, /ctaLabel="詳細を見る"/);
  assert.match(source, /ResourceListSectionHeading/);
  assert.match(source, /ResourceListSectionEyebrow/);
  assert.match(source, /ResourceListSectionTitleRow/);
  assert.match(source, /ResourceListSectionTitle/);
  assert.match(source, /ResourceListSectionDescription/);
  assert.match(source, /Past Events/);
  assert.match(source, /過去のイベント/);
  assert.match(source, /カンファレンスやセミナーのインサイトをご覧ください。/);
  assert.match(source, /<ResourceListItems items=\{visiblePastEvents\} \/>/);
  assert.doesNotMatch(source, /border-b border-slate-200 pb-4/);
});
