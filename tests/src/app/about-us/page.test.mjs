import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("about-us page keeps copy/composition in the route and UI primitives in the section module", () => {
  const routeSource = readSource("src/app/about-us/page.tsx");
  const sectionSource = readSource("src/components/sections/about-us/section.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/about-us\/section"/);
  assert.match(routeSource, /canonical: "\/about-us"/);
  assert.match(routeSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(routeSource, /<CompanyPageSection>/);
  assert.match(routeSource, /<CompanyPageIntro>/);
  assert.match(routeSource, /<AboutUsTimelineItem year="2024">/);
  assert.match(routeSource, /2016年12月にシリコンバレーで創業/);
  assert.match(routeSource, /<AboutUsTimelineItem year="2016">/);
  assert.match(routeSource, /QueryPie SQL Client の開発を開始/);
  assert.match(routeSource, /データ保護プラットフォームへ転換/);
  assert.match(routeSource, /QueryPie Japan（東京）を開設/);
  assert.match(routeSource, /<AboutUsLeaderCard imageSrc="\/about-us\/crew\/brant\.png"/);
  assert.match(routeSource, /<AboutUsLocationCard iconSrc="\/about-us\/location\/japan-cu\.svg"/);
  assert.match(routeSource, /AIを、安全に。事業の力に。/);
  assert.match(routeSource, /企業のAI活用を構想から実装、定着まで前進させます。/);
  assert.match(routeSource, /<AboutUsLocationName>Los Angeles, USA<\/AboutUsLocationName>/);
  assert.match(routeSource, /<AboutUsLocationOffice>Global Headquarters<\/AboutUsLocationOffice>/);
  assert.match(routeSource, /<AboutUsLocationEntity>CHEQUER Global, Inc\.<\/AboutUsLocationEntity>/);
  assert.match(routeSource, /<AboutUsLocationName>Seoul, South Korea<\/AboutUsLocationName>/);
  assert.match(routeSource, /<AboutUsLocationOffice>R&amp;D Office<\/AboutUsLocationOffice>/);
  assert.match(routeSource, /<AboutUsLocationEntity>주식회사 쿼리파이<\/AboutUsLocationEntity>/);
  assert.match(routeSource, /Gangseo-gu, Seoul 07807, Republic of Korea/);
  assert.match(routeSource, /<AboutUsLocationName>Tokyo, Japan<\/AboutUsLocationName>/);
  assert.match(routeSource, /<AboutUsLocationOffice>Japan Office<\/AboutUsLocationOffice>/);
  assert.match(routeSource, /〒105-6490 東京都港区虎ノ門1丁目17番1号/);
  assert.match(routeSource, /<AboutUsLocationName>Bekasi, Indonesia<\/AboutUsLocationName>/);
  assert.match(routeSource, /<AboutUsLocationOffice>Indonesia Office<\/AboutUsLocationOffice>/);

  assert.doesNotMatch(routeSource, /AboutUsPreviewPage/);
  assert.doesNotMatch(routeSource, /canonical: "\/t\/about-us"/);
  assert.doesNotMatch(routeSource, /const investors =/);
  assert.doesNotMatch(routeSource, /const timeline =/);
  assert.doesNotMatch(routeSource, /const leaders =/);
  assert.doesNotMatch(routeSource, /const locations =/);
  assert.doesNotMatch(routeSource, /from "next\/link"/);

  assert.match(routeSource, /<CompanyPageTitle>/);
  assert.match(routeSource, /<CompanyPageLayout preset="aboutUsHero">/);
  assert.match(routeSource, /from "@\/components\/sections\/company\/page-primitives"/);

  assert.doesNotMatch(sectionSource, /export function AboutUsHeroSection/);
  assert.doesNotMatch(sectionSource, /export function AboutUsHeroIntro/);
  assert.doesNotMatch(sectionSource, /export function AboutUsHeroHeading/);
  assert.doesNotMatch(sectionSource, /export function AboutUsHeroLayout/);
  assert.match(sectionSource, /export function AboutUsInvestorLogo/);
  assert.match(sectionSource, /export function AboutUsTimelineItem/);
  assert.match(sectionSource, /export function AboutUsLeaderCard/);
  assert.match(sectionSource, /export function AboutUsLocationCard/);

  assert.match(sectionSource, /export function AboutUsSection\(\{ children, muted = false \}: \{ children: ReactNode; muted\?: boolean \}\)/);
  assert.match(sectionSource, /export function AboutUsSection[\s\S]*<section[^>]*className=\{backgroundClass\}>[\s\S]*mx-auto max-w-\[1200px\] px-6 py-\[100px\] lg:px-0/);
  assert.doesNotMatch(sectionSource, /export function AboutUsSection\(\{ children, muted = false, className/);
  assert.doesNotMatch(routeSource, /<AboutUsSection[^>]*className=/);
  assert.doesNotMatch(routeSource, /<AboutUsSection className="mx-auto max-w-\[1200px\] px-6/);
  assert.doesNotMatch(routeSource, /<div className="mx-auto max-w-\[1200px\] px-6 lg:px-0">/);
  assert.match(sectionSource, /export function AboutUsSectionIntro[\s\S]*mt-4 max-w-\[1200px\]/);
  assert.match(sectionSource, /mt-\[56px\] flex flex-col gap-\[37\.5px\] border-l border-slate-300 pl-\[28\.125px\]/);
  assert.match(sectionSource, /className="flex gap-\[18\.75px\]"/);
  assert.match(sectionSource, /list-disc space-y-1 pl-5/);
  assert.doesNotMatch(sectionSource, /border-l border-slate-200 pl-\[28px\]/);

  assert.match(sectionSource, /grid grid-cols-1 gap-y-\[56\.25px\] md:grid-cols-2 md:justify-between md:gap-x-6 xl:grid-cols-\[repeat\(3,320px\)\] xl:justify-between xl:gap-x-0/);
  assert.match(sectionSource, /article[^>]*className="flex w-full max-w-\[320px\] flex-col gap-5"/);
  assert.match(sectionSource, /className="flex items-start justify-between"/);
  assert.match(sectionSource, /className=\{`block \$\{secondaryCopyClass\} transition hover:text-slate-950`\}/);
  assert.doesNotMatch(sectionSource, /mt-4 flex w-full justify-end/);
  assert.doesNotMatch(sectionSource, /rounded-\[24px\]/);
  assert.match(sectionSource, /<h3 className="w-\[93\.75px\] shrink-0 text-\[30px\] font-medium leading-\[39\.375px\] tracking-\[-0\.03em\] text-slate-950">\{year\}<\/h3>/);
  assert.match(sectionSource, /export function AboutUsLeaderName[\s\S]*return <p[^>]*className="text-\[18\.75px\] font-medium leading-\[26\.25px\] tracking-\[-0\.02em\] text-slate-950">\{children\}<\/p>;/);
  assert.match(sectionSource, /export function AboutUsLocationName[\s\S]*<p[^>]*className="text-\[18px\] font-medium leading-\[26px\] tracking-\[-0\.02em\] text-slate-950">\{children\}<\/p>/);
  assert.match(sectionSource, /export function AboutUsLocationOffice/);
  assert.match(sectionSource, /export function AboutUsLocationEntity/);
  assert.match(sectionSource, /text-\[14px\] leading-\[22px\] tracking-\[0\.01em\] text-slate-600/);
  assert.match(sectionSource, /company-introduction\.jpg/);
  assert.match(sectionSource, /sizes="\(min-width: 1024px\) 640px, 100vw"/);

  assert.match(sectionSource, /inline-flex w-fit self-start items-center justify-center border border-slate-200\/70 bg-white leading-none/);
  assert.match(sectionSource, /className="block h-\[17px\] w-\[23px\]"/);
  assert.doesNotMatch(sectionSource, /h-\[35px\] w-\[35px\]/);
  assert.doesNotMatch(sectionSource, /rounded-\[4px\]/);
});
