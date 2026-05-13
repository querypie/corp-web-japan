import assert from "node:assert/strict";
import test from "node:test";
import { readSource } from "./helpers/source-readers.mjs";

const source = () => readSource("src/components/sections/company/page-primitives.tsx");

test("company page primitives define the shared header and body-layout vocabulary", () => {
  const primitives = source();

  assert.match(primitives, /export function CompanyPageSection/);
  assert.match(primitives, /export function CompanyPageIntro/);
  assert.match(primitives, /export function CompanyPageTitle/);
  assert.match(primitives, /export function CompanyPageLead/);
  assert.match(primitives, /export function CompanyPageBodyLayout/);

  assert.match(primitives, /contentWidthClassName = "max-w-\[1200px\]"/);
  assert.match(primitives, /mx-auto w-full max-w-\[1920px\] bg-white px-\[30px\] pb-\[96px\] pt-\[100px\]/);
  assert.match(primitives, /flex flex-col gap-\[50px\] text-left/);
  assert.match(primitives, /text-\[40px\] font-medium leading-\[1\.2\] tracking-\[-0\.03em\] text-slate-950/);
  assert.match(primitives, /companyBodyTextClassName/);
});

test("company body layout supports single-column and approved two-column presets", () => {
  const primitives = source();

  assert.match(primitives, /columns\?: 1 \| 2/);
  assert.match(primitives, /layoutPreset\?: "single" \| "equal" \| "about-us"/);
  assert.match(primitives, /single: "flex w-full flex-col"/);
  assert.match(primitives, /equal: "grid w-full items-start gap-10 lg:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)\] lg:gap-14"/);
  assert.match(primitives, /"about-us": "grid w-full items-start gap-16 lg:grid-cols-\[504px_640px\] lg:gap-14"/);
  assert.match(primitives, /layoutPreset = columns === 2 \? "equal" : "single"/);
});
