import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("about-us preview page keeps copy/composition in the route and UI primitives in the section module", () => {
  const routeSource = readSource("src/app/t/about-us/page.tsx");
  const sectionSource = readSource("src/components/sections/about-us.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/about-us"/);
  assert.match(routeSource, /<AboutUsHeroSection>/);
  assert.match(routeSource, /<AboutUsTimelineItem year="2024">/);
  assert.match(routeSource, /<AboutUsLeaderCard imageSrc="\/about-us\/crew\/brant\.png"/);
  assert.match(routeSource, /<AboutUsLocationCard iconSrc="\/about-us\/location\/japan-cu\.svg"/);

  assert.doesNotMatch(routeSource, /const investors =/);
  assert.doesNotMatch(routeSource, /const timeline =/);
  assert.doesNotMatch(routeSource, /const leaders =/);
  assert.doesNotMatch(routeSource, /const locations =/);
  assert.doesNotMatch(routeSource, /from "next\/link"/);

  assert.match(sectionSource, /export function AboutUsHeroSection/);
  assert.match(sectionSource, /export function AboutUsInvestorLogo/);
  assert.match(sectionSource, /export function AboutUsTimelineItem/);
  assert.match(sectionSource, /export function AboutUsLeaderCard/);
  assert.match(sectionSource, /export function AboutUsLocationCard/);

  assert.match(sectionSource, /inline-flex w-fit self-start items-center justify-center border border-slate-200\/70 bg-white leading-none/);
  assert.match(sectionSource, /className="block h-\[17px\] w-\[23px\]"/);
  assert.doesNotMatch(sectionSource, /h-\[35px\] w-\[35px\]/);
  assert.doesNotMatch(sectionSource, /rounded-\[4px\]/);
});
