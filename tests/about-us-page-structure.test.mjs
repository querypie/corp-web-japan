import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("about-us page keeps copy/composition in the route and UI primitives in the section module", () => {
  const routeSource = readSource("src/app/t/about-us/page.tsx");
  const sectionSource = readSource("src/components/sections/about-us/section.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/about-us\/section"/);
  assert.match(routeSource, /<AboutUsHeroSection>/);
  assert.match(routeSource, /<AboutUsTimelineItem year="2024">/);
  assert.match(routeSource, /<AboutUsLeaderCard imageSrc="\/about-us\/crew\/brant\.png"/);
  assert.match(routeSource, /<AboutUsLocationCard iconSrc="\/about-us\/location\/japan-cu\.svg"/);

  assert.doesNotMatch(routeSource, /AboutUsPreviewPage/);
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

  assert.match(sectionSource, /export function AboutUsSectionIntro[\s\S]*mt-4 max-w-\[1200px\]/);
  assert.match(sectionSource, /mt-\[56px\] flex flex-col gap-\[37\.5px\] border-l border-slate-300 pl-\[28\.125px\]/);
  assert.match(sectionSource, /className="flex gap-\[18\.75px\]"/);
  assert.match(sectionSource, /list-disc space-y-1 pl-5/);
  assert.doesNotMatch(sectionSource, /border-l border-slate-200 pl-\[28px\]/);

  assert.match(sectionSource, /grid grid-cols-1 gap-y-\[56\.25px\] md:grid-cols-2 md:justify-between md:gap-x-6 xl:grid-cols-\[repeat\(3,320px\)\] xl:justify-between xl:gap-x-0/);
  assert.match(sectionSource, /article className="flex w-full max-w-\[320px\] flex-col gap-5"/);
  assert.match(sectionSource, /className="flex items-start justify-between"/);
  assert.match(sectionSource, /className=\{`block \$\{secondaryCopyClass\} transition hover:text-slate-950`\}/);
  assert.doesNotMatch(sectionSource, /mt-4 flex w-full justify-end/);
  assert.doesNotMatch(sectionSource, /rounded-\[24px\]/);
  assert.match(sectionSource, /<h3 className="w-\[93\.75px\] shrink-0 text-\[30px\] font-medium leading-\[39\.375px\] tracking-\[-0\.03em\] text-slate-950">\{year\}<\/h3>/);
  assert.match(sectionSource, /export function AboutUsLeaderName[\s\S]*return <p className="text-\[18\.75px\] font-medium leading-\[26\.25px\] tracking-\[-0\.02em\] text-slate-950">\{children\}<\/p>;/);
  assert.match(sectionSource, /export function AboutUsLocationName[\s\S]*<p className="text-\[18\.75px\] font-medium leading-\[26\.25px\] tracking-\[-0\.02em\] text-slate-950">\{children\}<\/p>/);

  assert.match(sectionSource, /inline-flex w-fit self-start items-center justify-center border border-slate-200\/70 bg-white leading-none/);
  assert.match(sectionSource, /className="block h-\[17px\] w-\[23px\]"/);
  assert.doesNotMatch(sectionSource, /h-\[35px\] w-\[35px\]/);
  assert.doesNotMatch(sectionSource, /rounded-\[4px\]/);
});
