import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

test("FeaturedEventHero separates box-link focus from CTA hover/focus behavior while keeping box-focus image scale", () => {
  const file = "src/components/sections/featured-event-hero.tsx";
  const source = readSource(file);

  assert.equal(sourceExists("src/components/sections/featured-event-hero.tsx"), true);
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
  assert.match(source, /aria-label=\{`\$\{title\} \$\{ctaLabel\}`\}/);
  assert.match(source, /className="peer absolute inset-0 z-0 cursor-pointer rounded-lg/);
  assert.match(source, /focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4/);
  assert.match(source, /pointer-events-none flex-col items-stretch peer-hover:\[&_\.featured-event-hero-image\]:scale-\[1\.02\]/);
  assert.match(source, /peer-focus:\[&_\.featured-event-hero-image\]:scale-\[1\.02\]/);
  assert.match(source, /peer-focus-visible:\[&_\.featured-event-hero-image\]:scale-\[1\.02\]/);
  assert.match(source, /featured-event-hero-image h-full w-full object-cover transition-transform duration-500/);
  assert.match(source, /pointer-events-auto inline-flex items-center rounded-lg bg-black/);
  assert.match(source, /hover:scale-\[1\.03\] hover:bg-\[#1E3A8A\]/);
  assert.match(source, /focus-visible:scale-\[1\.03\] focus-visible:bg-\[#1E3A8A\]/);
  assert.match(source, /shadow-\[0_0_0_1px_rgba\(30,58,138,0\.10\),0_10px_24px_rgba\(30,58,138,0\.24\)\]/);
  assert.doesNotMatch(source, /hover:ring-/);
  assert.doesNotMatch(source, /focus-visible:ring-.*blue/);
});
