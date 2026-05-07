import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mdxComponents = readFileSync(new URL("../src/lib/publications/mdx/components.tsx", import.meta.url), "utf8");
const introductionDeckAip = readFileSync(new URL("../src/content/introduction-deck/1-querypie-aip.mdx", import.meta.url), "utf8");
const introductionDeckAcp = readFileSync(new URL("../src/content/introduction-deck/2-querypie-acp.mdx", import.meta.url), "utf8");

test("ButtonLink supports external prop and renders new-tab anchors for external links", () => {
  assert.match(mdxComponents, /type ButtonLinkProps = \{[\s\S]*external\?: boolean;/);
  assert.match(mdxComponents, /function ButtonLink\(\{ href, children, external = false \}: ButtonLinkProps\)/);
  assert.match(mdxComponents, /if \(external \|\| isExternalHref\(href\)\) \{/);
  assert.match(mdxComponents, /<a href=\{href\} className="article-content-btn" target="_blank" rel="noopener noreferrer">/);
});

test("introduction deck PDFs are now modeled through frontmatter downloadCta instead of inline ButtonLink markup", () => {
  assert.match(introductionDeckAip, /downloadCta:\n  href: "\/introduction-deck\/1\/QueryPie_AIP_Intro_JP\.pdf"/);
  assert.match(introductionDeckAcp, /downloadCta:\n  href: "\/introduction-deck\/2\/QueryPie_ACP_Intro_JP\.pdf"/);
  assert.doesNotMatch(introductionDeckAip, /<ButtonLink href="\/introduction-deck\/1\/QueryPie_AIP_Intro_JP\.pdf"/);
  assert.doesNotMatch(introductionDeckAcp, /<ButtonLink href="\/introduction-deck\/2\/QueryPie_ACP_Intro_JP\.pdf"/);
});
