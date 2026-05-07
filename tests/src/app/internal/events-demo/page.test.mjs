import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/internal/events-demo supports asof-based past events and a query-driven hero-state demo toggle", () => {
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
  assert.match(source, /resolveEventTimeline\(resolvedSearchParams\?\.asof\)/);
  assert.match(source, /resolveEventTimeline\("1900-01-01"\)/);
  assert.match(source, /resolveShowUpcomingEvent/);
  assert.match(source, /previewHeroEvent/);
  assert.match(source, /visiblePastEvents/);
  assert.match(source, /filter\(\(event\) => event\.id !== previewHeroEvent\.id\)/);
  assert.match(source, /InternalEventsDemoHeroToggle/);
  assert.match(source, /disabled=\{!previewHeroEvent\}/);
  assert.match(source, /showUpcomingEvent && previewHeroEvent/);
  assert.match(source, /FeaturedEventHero/);
  assert.match(source, /InternalEventsDemoEmptyState/);
  assert.match(source, /eyebrow="Upcoming Event"/);
  assert.match(source, /ctaLabel="詳細を見る"/);
  assert.match(source, /Past Events/);
  assert.match(source, /過去のイベント/);
  assert.match(source, /カンファレンスやセミナーのインサイトをご覧ください。/);
  assert.match(source, /<ResourceListItems items=\{visiblePastEvents\} \/>/);
});
