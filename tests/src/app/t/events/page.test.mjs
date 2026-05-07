import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/events shows an asof-driven upcoming hero or the empty state without exposing the internal demo switch", () => {
  const file = "src/app/t/events/page.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../../src/app/t/events/page.tsx", import.meta.url)), true);
  assert.match(source, /title:\s*"イベント \| QueryPie AI"/);
  assert.match(source, /canonical:\s*"\/t\/events"/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*false/);
  assert.match(source, /searchParams\?: Promise<\{/);
  assert.match(source, /asof\?: string \| string\[];/);
  assert.match(source, /resolveEventTimeline\(resolvedSearchParams\?\.asof\)/);
  assert.match(source, /heroEvent/);
  assert.match(source, /pastEvents/);
  assert.match(source, /FeaturedEventHero/);
  assert.match(source, /InternalEventsDemoEmptyState/);
  assert.match(source, /heroEvent \?/);
  assert.match(source, /eyebrow="Upcoming Event"/);
  assert.match(source, /ctaLabel="詳細を見る"/);
  assert.match(source, /Past Events/);
  assert.match(source, /過去のイベント/);
  assert.match(source, /カンファレンスやセミナーのインサイトをご覧ください。/);
  assert.match(source, /<ResourceCategorySidebar activeLabel="イベント" \/>/);
  assert.match(source, /<ResourceListItems items=\{pastEvents\} \/>/);
  assert.doesNotMatch(source, /InternalEventsDemoHeroToggle/);
  assert.doesNotMatch(source, /upcoming\?: string \| string\[];/);
});
