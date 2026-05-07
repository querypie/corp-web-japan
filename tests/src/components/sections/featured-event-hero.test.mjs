import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("FeaturedEventHero exists as a reusable section component for hero-event rendering", () => {
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
  assert.match(source, /<Image/);
  assert.match(source, /<Link/);
});
