import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("publication MDX component map supports legacy State badges used by whitepaper 10", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const whitepaper10 = readSource("src/content/whitepapers/10-querypie-devsecops-pipeline.mdx");

  assert.match(whitepaper10, /<State color="red">/);
  assert.match(mdxComponents, /type StateColor = "gray" \| "blue" \| "purple" \| "green" \| "yellow" \| "red";/);
  assert.match(mdxComponents, /function State\(\{ color = "blue", children \}: StateProps\)/);
  assert.match(mdxComponents, /const palette: Record<StateColor, string>/);
  assert.match(mdxComponents, /State,/);
});

test("publication MDX table components preserve legacy table cell props used by imported content", () => {
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");
  const privacyPolicy = readSource("src/content/privacy-policy/2025-09-08.mdx");
  const whitepaper11 = readSource("src/content/whitepapers/11-efficient-audit-log-management.mdx");
  const blog18 = readSource("src/content/blog/18-why-is-sso-important.mdx");

  assert.match(privacyPolicy, /<Table\.Td rowSpan=\{5\}>/);
  assert.match(privacyPolicy, /<Table\.Td colSpan=\{2\}>/);
  assert.match(whitepaper11, /<Table\.Td rowSpan=\{7\}>/);
  assert.match(blog18, /<Table\.Td width="50%">/);

  assert.match(mdxComponents, /type TableCellProps = ComponentPropsWithoutRef<"td"> & \{/);
  assert.match(mdxComponents, /type TableHeaderCellProps = ComponentPropsWithoutRef<"th"> & \{/);
  assert.match(mdxComponents, /width\?: string \| number;/);
  assert.match(mdxComponents, /marginTopSize\?: MarginTopSize;/);
  assert.match(mdxComponents, /useMaxContent\?: boolean;/);
  assert.match(mdxComponents, /\.\.\.restProps/);
  assert.match(mdxComponents, /<th[\s\S]*\{\.\.\.restProps\}[\s\S]*>/);
  assert.match(mdxComponents, /<td[\s\S]*\{\.\.\.restProps\}[\s\S]*>/);
});
