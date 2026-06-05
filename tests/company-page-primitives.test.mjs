import assert from "node:assert/strict";
import test from "node:test";
import { readSource } from "./helpers/source-readers.mjs";

const source = () => readSource("src/components/sections/company/page-primitives.tsx");

test("company page primitives define shared section, intro, title, lead, and layout vocabulary", () => {
  const primitives = source();

  assert.match(primitives, /export function CompanyPageSection/);
  assert.match(primitives, /export function CompanyPageIntro/);
  assert.match(primitives, /export function CompanyPageTitle/);
  assert.match(primitives, /export function CompanyPageLead/);
  assert.match(primitives, /export function CompanyPageLayout/);

  assert.match(primitives, /<div className="mx-auto w-full max-w-\[1200px\]">/);
  assert.doesNotMatch(primitives, /type CompanyPageSectionPadding/);
  assert.doesNotMatch(primitives, /padding\?: CompanyPageSectionPadding/);
  assert.match(primitives, /<section[^>]*className="mx-auto w-full max-w-\[1920px\] bg-white px-\[30px\] pb-\[50px\] pt-\[100px\] lg:pb-\[72px\] lg:pt-\[120px\]">/);
  assert.match(primitives, /mx-auto w-full max-w-\[1920px\] bg-white px-\[30px\]/);
  assert.match(primitives, /flex flex-col gap-10 pt-\[10px\] text-left lg:gap-\[50px\] lg:pt-0/);
  assert.match(primitives, /text-\[40px\] font-medium leading-\[1\.2\] tracking-\[-0\.03em\] text-slate-950/);
  assert.match(primitives, /companyBodyTextClassName/);
});

test("company page layout uses named presets instead of call-site custom class names", () => {
  const primitives = source();

  assert.match(primitives, /type CompanyPageLayoutPreset = "single" \| "equalColumns" \| "aboutUsHero"/);
  assert.match(primitives, /preset\?: CompanyPageLayoutPreset/);
  assert.match(primitives, /single: "flex w-full flex-col"/);
  assert.match(primitives, /equalColumns: "grid w-full items-start gap-10 lg:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)\] lg:gap-14"/);
  assert.match(primitives, /aboutUsHero: "grid w-full items-start gap-16 lg:grid-cols-\[504px_640px\] lg:gap-14"/);
  assert.match(primitives, /preset = "single"/);
  assert.doesNotMatch(primitives, /className\?: string/);
  assert.doesNotMatch(primitives, /contentClassName\?: string/);
  assert.doesNotMatch(primitives, /type CompanyPageLayoutProps = \{[\s\S]*contentWidthClassName\?: string/);
  assert.doesNotMatch(primitives, /import \{ cn \}/);
});
