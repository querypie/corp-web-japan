import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

const pagePath = "src/app/t/terms-of-service/page.tsx";

const sectionPath = "src/components/sections/terms-of-service/section.tsx";


test("terms of service page derives metadata and hero copy from content.mdx frontmatter", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export async function generateMetadata\(\): Promise<Metadata>/);
  assert.match(source, /title: `\$\{frontmatter\.title\} \| QueryPie AI`,/);
  assert.match(source, /description: frontmatter\.description,/);
  assert.match(source, /canonical: "\/t\/terms-of-service"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /<TermsOfServiceHero frontmatter=\{frontmatter\} \/>/);
  assert.match(source, /<TermsOfServiceBody content=\{evaluation\.content\} \/>/);
  assert.match(source, /max-w-\[1200px\]/);
  assert.match(source, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(source, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(source, /export const metadata: Metadata = \{/);
  assert.doesNotMatch(source, /function LegalBodyH1/);
  assert.doesNotMatch(source, /corp-web-contents \/ corp-web-app/);
});

test("terms of service page keeps title, description, and date in content.mdx frontmatter with legal body below", () => {
  const footerSource = readSource("src/components/layout/site-footer.tsx");
  const contentSource = readSource("src/app/t/terms-of-service/content.mdx");
  const sectionSource = readSource(sectionPath);

  assert.equal(sourceExists("src/app/t/terms-of-service/content.mdx"), true, "terms of service MDX content file should exist");
  assert.match(contentSource, /^---\ntitle: "QueryPie Terms of Service"\ndescription: "Terms of service for QueryPie AIP/m);
  assert.match(contentSource, /\ndate: "2025-06-05"\n/);
  assert.match(contentSource, /Article 1 \(Purpose\)/);
  assert.match(contentSource, /Article 17 \(Governing Law and Jurisdiction\)/);
  assert.doesNotMatch(contentSource, /StaticH1/);
  assert.doesNotMatch(contentSource, /<Box direction="column"/);
  assert.doesNotMatch(contentSource, /<CenterSection/);
  assert.doesNotMatch(contentSource, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(sectionSource, /export async function renderTermsOfServiceContent\(\)/);
  assert.match(sectionSource, /parseFrontmatter: true,/);
  assert.match(sectionSource, /export function TermsOfServiceHero/);
  assert.match(sectionSource, /export function TermsOfServiceBody/);
  assert.match(footerSource, /label: "利用規約", href: t\("\/terms-of-service", previewModeEnabled\)/);
});
