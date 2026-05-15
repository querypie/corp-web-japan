import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../../../helpers/source-readers.mjs";

test("mcp gateway route keeps authored copy in the route and rendering primitives in the section module", () => {
  const routeSource = readSource("src/app/t/platforms/aip/mcp-gateway/page.tsx");
  const sectionSource = readSource("src/components/sections/mcp-gateway/section.tsx");
  const platformSource = readSource("src/components/sections/platform/page-primitives.tsx");

  assert.match(routeSource, /from "@\/components\/sections\/mcp-gateway\/section"/);
  assert.match(routeSource, /canonical: "\/t\/platforms\/aip\/mcp-gateway"/);
  assert.match(routeSource, /<McpGatewayHeroHeading>/);
  assert.match(routeSource, /統合型AIゲートウェイ/);
  assert.match(routeSource, /<McpGatewayFeatureCopy className="w-full lg:w-\[450px\]">/);
  assert.match(routeSource, /<McpGatewayFeatureTitle>外部ツールとの連携<\/McpGatewayFeatureTitle>/);
  assert.match(routeSource, /src="\/solutions\/aip\/mcp-gateway\/tunneling\.gif"/);
  assert.match(routeSource, /src="\/solutions\/aip\/mcp-gateway\/dlp\.gif"/);
  assert.match(routeSource, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(routeSource, /<AipFreeTrialCtaSection \/>/);

  assert.doesNotMatch(routeSource, /const features =/);
  assert.doesNotMatch(routeSource, /const featureCards =/);
  assert.doesNotMatch(routeSource, /const hero =/);

  assert.match(sectionSource, /export function McpGatewayHeroSection/);
  assert.match(sectionSource, /from "@\/components\/sections\/platform\/page-primitives"/);
  assert.match(sectionSource, /mt-\[10px\]/);
  assert.match(sectionSource, /max-w-\[620px\][\s\S]*text-\[48px\][\s\S]*lg:text-\[60px\]/);
  assert.match(sectionSource, /flex flex-col items-center[\s\S]*gap-\[60px\][\s\S]*lg:gap-\[80px\][\s\S]*lg:flex-row/);
  assert.match(sectionSource, /w-full max-w-full shrink-0/);
  assert.match(sectionSource, /<PlatformContentSection[\s\S]*className=\{cx\("w-full py-\[80px\]"/);
  assert.doesNotMatch(sectionSource, /contentClassName="px-10 lg:px-10"/);
  assert.doesNotMatch(sectionSource, /paddingClassName=""/);
  assert.match(sectionSource, /export function McpGatewayFeatureCopy[\s\S]*flex w-full max-w-full shrink-0 flex-col gap-\[20px\]/);
  assert.match(sectionSource, /<h4 className=\{cx\("text-\[32px\][\s\S]*max-\[480px\]:text-\[20px\][\s\S]*max-\[480px\]:leading-\[28px\]/);
  assert.match(sectionSource, /shadow-\[0_4px_12px_rgba\(0,0,0,0\.1\)\]/);
  assert.match(sectionSource, /lg:shadow-\[0_8px_20px_rgba\(0,0,0,0\.15\)\]/);
  assert.match(sectionSource, /rounded-\[8px\]/);
  assert.match(sectionSource, /export function McpGatewayFeatureChecklist[\s\S]*min-h-0/);
  assert.match(sectionSource, /export function McpGatewayFeatureBand/);
  assert.match(sectionSource, /export function McpGatewayFeatureImage/);
  assert.match(sectionSource, /export function McpGatewayCtaSection/);
  assert.match(sectionSource, /export function McpGatewayCtaSection[\s\S]*<PlatformCtaSection className=\{className\}>/);

  assert.match(platformSource, /paddingClassName\?: string/);
  assert.match(platformSource, /export function PlatformCtaSection/);
});
