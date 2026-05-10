import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("/t/plans preserves upstream JSX / compound-component authoring instead of introducing a new local data renderer API", () => {
  const routeSource = readSource("src/app/t/plans/page.tsx");
  const sectionSource = readSource("src/components/sections/plans-page.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/plans-page"/);
  assert.match(routeSource, /<Pricing>/);
  assert.match(routeSource, /<Pricing\.Header>/);
  assert.match(routeSource, /<PricingContextProvider defaultActiveTab="aip">/);
  assert.match(routeSource, /<ProductTabs>/);
  assert.match(routeSource, /<ProductTab name="aip">/);
  assert.match(routeSource, /<ProductTab name="acp">/);
  assert.match(routeSource, /<PlanVisibility id="aip">/);
  assert.match(routeSource, /<PlanVisibility id="acp">/);
  assert.match(routeSource, /<Plan\.Card type="primary">/);
  assert.match(routeSource, /<Plan\.Card type="black">/);
  assert.match(routeSource, /<Plan\.Feature supported=\{true\}>月間800クレジット<\/Plan\.Feature>/);
  assert.match(routeSource, /<CompareTable/);
  assert.match(routeSource, /rows=\{\[/);
  assert.match(routeSource, /columns=\{\[/);
  assert.match(routeSource, /href="\/contact-us\?inquiry=quote-request&product=acp"/);

  assert.doesNotMatch(routeSource, /const aipPlans\s*:/);
  assert.doesNotMatch(routeSource, /const acpPlans\s*:/);
  assert.doesNotMatch(routeSource, /const aipComparisonGroups\s*:/);
  assert.doesNotMatch(routeSource, /products=\{\[/);
  assert.doesNotMatch(routeSource, /PlansProductSwitcher/);

  assert.match(sectionSource, /export const Pricing = Object\.assign\(PricingRoot, \{/);
  assert.match(sectionSource, /export function PricingContextProvider/);
  assert.match(sectionSource, /searchParams\.has\("acp"\)/);
  assert.match(sectionSource, /export const Plan = Object\.assign\(PlanRoot, \{/);
  assert.match(sectionSource, /export function PlanVisibility/);
  assert.match(sectionSource, /export function CompareTable/);
  assert.match(sectionSource, /cloneElement\(child as ReactElement<ProductTabProps>, \{/);

  assert.doesNotMatch(sectionSource, /export function PlansProductSwitcher/);
  assert.doesNotMatch(sectionSource, /type PlansProductSwitcherProps/);
  assert.doesNotMatch(sectionSource, /products: readonly \[ProductPanel, ProductPanel\]/);
});
