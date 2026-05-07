import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("FeaturedEventHero renders the whole hero card as a single clickable link with strong focus-visible CTA emphasis", () => {
  const file = "src/components/sections/featured-event-hero.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/featured-event-hero.tsx", import.meta.url)), true);
  assert.match(source, /type FeaturedEventHeroProps = \{/);
  assert.match(source, /href: string;/);
  assert.match(source, /imageSrc: string;/);
  assert.match(source, /badge: string;/);
  assert.match(source, /ctaLabel\?: string;/);
  assert.match(source, /export function FeaturedEventHero/);
  assert.match(source, /eyebrow = "Featured Event"/);
  assert.match(source, /ctaLabel = "詳細を見る"/);
  assert.match(source, /rounded-lg/);
  assert.match(source, /p-6 lg:w-2\/5 lg:p-8/);
  assert.match(source, /<Image/);
  assert.match(source, /<Link[\s\S]*focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4/);
  assert.match(source, /cursor-pointer/);
  assert.match(source, /group-hover:scale-\[1\.02\]/);
  assert.match(source, /group-focus-visible:scale-\[1\.02\]/);
  assert.match(source, /group-focus-visible:bg-slate-900/);
  assert.match(source, /group-focus-visible:ring-2 group-focus-visible:ring-slate-900/);
  assert.doesNotMatch(source, /<Link[\s\S]*<Link/);
});
