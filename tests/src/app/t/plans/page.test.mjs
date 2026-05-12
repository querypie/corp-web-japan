import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/plans keeps copy and comparison composition in the route while the section module only provides pricing UI primitives", () => {
  const routeSource = readSource("src/app/t/plans/page.tsx");
  const sectionSource = readSource("src/components/sections/plans/section.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/plans\/section"/);
  assert.match(routeSource, /<PricingRoot>/);
  assert.match(routeSource, /<PricingHeader>/);
  assert.match(routeSource, /<PricingContextProvider defaultActiveTab="aip">/);
  assert.match(routeSource, /<ProductTabs>/);
  assert.match(routeSource, /<ProductTab name="aip">/);
  assert.match(routeSource, /<ProductTab name="acp">/);
  assert.match(routeSource, /<PlanVisibility id="aip">/);
  assert.match(routeSource, /<PlanVisibility id="acp">/);
  assert.match(routeSource, /<PlanCard type="primary">/);
  assert.match(routeSource, /<PlanCard type="black">/);
  assert.match(routeSource, /<PlanFeature supported=\{true\}>月間800クレジット<\/PlanFeature>/);
  assert.match(routeSource, /<CompareTable>/);
  assert.match(routeSource, /<CompareTableHead>/);
  assert.match(routeSource, /<CompareTableSection title="一般">/);
  assert.match(routeSource, /<CompareTableRow label="料金">/);
  assert.match(routeSource, /<CompareTableTextCell isBold>\$20\/月<\/CompareTableTextCell>/);
  assert.match(routeSource, /<CompareTableBooleanCell supported=\{false\} \/>/);
  assert.match(routeSource, /<CompareTableCheckLabelCell>最大30日間<\/CompareTableCheckLabelCell>/);
  assert.match(routeSource, /href="\/contact-us\?inquiry=quote-request&product=acp"/);

  assert.doesNotMatch(routeSource, /PlansPreviewPage/);
  assert.doesNotMatch(routeSource, /const Pricing = Object\.assign/);
  assert.doesNotMatch(routeSource, /const Plan = Object\.assign/);
  assert.doesNotMatch(routeSource, /rows=\{\[/);
  assert.doesNotMatch(routeSource, /columns=\{\[/);
  assert.doesNotMatch(routeSource, /const aipPlans\s*:/);
  assert.doesNotMatch(routeSource, /const acpPlans\s*:/);
  assert.doesNotMatch(routeSource, /const aipComparisonGroups\s*:/);
  assert.doesNotMatch(routeSource, /products=\{\[/);
  assert.doesNotMatch(routeSource, /PlansProductSwitcher/);

  assert.match(sectionSource, /export function PricingRoot\(/);
  assert.match(sectionSource, /export function PricingHeader\(/);
  assert.match(sectionSource, /export function PricingContextProvider/);
  assert.match(sectionSource, /searchParams\.has\("acp"\)/);
  assert.match(sectionSource, /export function PlanRoot\(/);
  assert.match(sectionSource, /export function PlanCard\(/);
  assert.match(sectionSource, /export function PlanVisibility/);
  assert.match(sectionSource, /export function CompareTable\(/);
  assert.match(sectionSource, /export function CompareTableHead\(/);
  assert.match(sectionSource, /export function CompareTableSection\(/);
  assert.match(sectionSource, /export function CompareTableRow\(/);
  assert.match(sectionSource, /export function CompareTableTextCell\(/);
  assert.match(sectionSource, /export function CompareTableBooleanCell\(/);
  assert.match(sectionSource, /export function CompareTableCheckLabelCell\(/);
  assert.match(sectionSource, /cloneElement\(child as ReactElement<ProductTabProps>, \{/);

  assert.doesNotMatch(sectionSource, /export const Pricing = Object\.assign/);
  assert.doesNotMatch(sectionSource, /export const Plan = Object\.assign/);
  assert.doesNotMatch(sectionSource, /type CompareTableColumn =/);
  assert.doesNotMatch(sectionSource, /type CompareTableRowGroup =/);
});
