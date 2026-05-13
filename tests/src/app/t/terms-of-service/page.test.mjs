import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

const pagePath = "src/app/t/terms-of-service/page.tsx";
const legalDocumentPath = "src/components/sections/legal/document.tsx";
const legalMdxPath = "src/components/sections/legal/mdx.tsx";
const legalMdxSourcePath = "src/lib/legal-mdx-source.ts";

test("terms of service page derives metadata and hero copy from content.mdx frontmatter", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export async function generateMetadata\(\): Promise<Metadata>/);
  assert.match(source, /title: `\$\{frontmatter\.title\} \| QueryPie AI`,/);
  assert.match(source, /description: frontmatter\.description,/);
  assert.match(source, /canonical: "\/t\/terms-of-service"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /<LegalDocumentHero title=\{frontmatter\.title\} divider \/>/);
  assert.match(source, /<LegalDocumentBody className="\[&_h1:first-child\]:mt-0">\{evaluation\.content\}<\/LegalDocumentBody>/);
  assert.match(source, /<LegalDocumentPageSection>/);
  assert.match(source, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(source, /<AipFreeTrialCtaSection \/>/);
  assert.doesNotMatch(source, /export const metadata: Metadata = \{/);
  assert.doesNotMatch(source, /TermsOfServiceHero/);
  assert.doesNotMatch(source, /TermsOfServiceBody/);
  assert.doesNotMatch(source, /corp-web-contents \/ corp-web-app/);
});

test("terms of service page keeps title, description, and date in content.mdx frontmatter with legal body below", () => {
  const footerSource = readSource("src/components/layout/site-footer.tsx");
  const contentSource = readSource("src/app/t/terms-of-service/content.mdx");
  const pageSource = readSource(pagePath);
  const legalDocumentSource = readSource(legalDocumentPath);
  const legalMdxSource = readSource(legalMdxPath);
  const legalMdxHelperSource = readSource(legalMdxSourcePath);

  assert.equal(sourceExists("src/app/t/terms-of-service/content.mdx"), true, "terms of service MDX content file should exist");
  assert.equal(sourceExists("src/components/sections/terms-of-service/section.tsx"), false);
  assert.match(contentSource, /^---\ntitle: "QueryPie Terms of Service"\ndescription: "Terms of service for QueryPie AIP/m);
  assert.match(contentSource, /\ndate: "2025-06-05"\n/);
  assert.match(contentSource, /Article 1 \(Purpose\)/);
  assert.match(contentSource, /Article 17 \(Governing Law and Jurisdiction\)/);
  assert.doesNotMatch(contentSource, /StaticH1/);
  assert.doesNotMatch(contentSource, /<Box direction="column"/);
  assert.doesNotMatch(contentSource, /<CenterSection/);
  assert.doesNotMatch(contentSource, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(pageSource, /const renderTermsOfServiceContent = cache\(async function renderTermsOfServiceContent\(\)/);
  assert.match(pageSource, /renderLegalMdx<TermsFrontmatter>\(\{ sourcePath \}\)/);
  assert.match(legalMdxHelperSource, /export async function renderLegalMdx<Frontmatter extends Record<string, unknown>>/);
  assert.match(legalMdxHelperSource, /parseFrontmatter: true,/);
  assert.match(legalMdxHelperSource, /buildLegalDocumentMdxComponents\(\)/);
  assert.match(legalDocumentSource, /export function LegalDocumentHero/);
  assert.match(legalMdxSource, /export function buildLegalDocumentMdxComponents\(\)/);
  assert.match(footerSource, /label: "利用規約", href: t\("\/terms-of-service", previewModeEnabled\)/);
});
