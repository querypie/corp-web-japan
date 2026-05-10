import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("/t/plans preview page keeps pricing copy/data in the route and interactive rendering in the section module", () => {
  const routeSource = readSource("src/app/t/plans/page.tsx");
  const sectionSource = readSource("src/components/sections/plans-page.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/plans-page"/);
  assert.match(routeSource, /const aipPlans: readonly PlanCardData\[] = \[/);
  assert.match(routeSource, /title: "スターター"/);
  assert.match(routeSource, /title: "チーム"/);
  assert.match(routeSource, /title: "コミュニティ"/);
  assert.match(routeSource, /const aipComparisonGroups: readonly ComparisonGroup\[] = \[/);
  assert.match(routeSource, /title: "プラットフォーム機能"/);
  assert.match(routeSource, /label: "AIエージェント作成数"/);
  assert.match(routeSource, /canonical: "\/t\/plans"/);
  assert.match(routeSource, /<PlansProductSwitcher/);
  assert.match(routeSource, /name: "QueryPie AIP"/);
  assert.match(routeSource, /name: "QueryPie ACP"/);
  assert.match(routeSource, /https:\/\/app\.querypie\.com/);
  assert.match(routeSource, /https:\/\/docs\.querypie\.com\/ja\/installation\/querypie-acp-community-edition/);

  assert.doesNotMatch(routeSource, /const products =/);
  assert.doesNotMatch(routeSource, /function PlansProductSwitcher\(/);
  assert.doesNotMatch(routeSource, /Preview Plans/);

  assert.match(sectionSource, /export type PlanCardData = \{/);
  assert.match(sectionSource, /export type ComparisonGroup = \{/);
  assert.match(sectionSource, /export function PlansPageSection\(/);
  assert.match(sectionSource, /export function PlansHeroTitle\(/);
  assert.match(sectionSource, /export function PlansProductSwitcher\(/);
  assert.match(sectionSource, /const \[activeProduct, setActiveProduct\] = useState<ProductKey>\(products\[0\]\.key\)/);
  assert.match(sectionSource, /rounded-\[24px\] border px-6 py-7/);
  assert.match(sectionSource, /rounded-\[28px\] border border-slate-200 bg-white/);
  assert.match(sectionSource, /<Check className="h-4 w-4" strokeWidth=\{2\.75\} \/>/);
});
