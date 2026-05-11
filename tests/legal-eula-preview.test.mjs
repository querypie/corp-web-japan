import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/eula/page.tsx";
const contentPath = "src/app/t/eula/content.mdx";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("eula preview page exists with noindex metadata and preview canonical path", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);
  const contentSource = readSource(contentPath);

  assert.match(source, /export async function generateMetadata\(\): Promise<Metadata>/);
  assert.match(source, /const \{ frontmatter \} = await renderEulaPreviewMdx\(\);/);
  assert.match(source, /title: frontmatter\.title,/);
  assert.match(source, /description: frontmatter\.description,/);
  assert.match(source, /canonical: "\/t\/eula"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /const legalBodyClassName = \[/);
  assert.match(source, /src\/app\/t\/eula\/content\.mdx/);
  assert.match(source, /parseFrontmatter: true,/);
  assert.match(source, /<LegalPageTitle>End User License Agreement<\/LegalPageTitle>/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(source, /<BrandGradientCtaButton href="https:\/\/app\.querypie\.com\/">無料で試してみる<\/BrandGradientCtaButton>/);
  assert.match(contentSource, /^---\ntitle: "QueryPie EULA"\ndescription: "End User License Agreement for QueryPie/m);
  assert.doesNotMatch(source, /export const metadata: Metadata = \{/);
});

test("eula preview keeps legal structure ownership in page.tsx and mdx body free of layout wrappers", () => {
  const pageSource = readSource(pagePath);
  const contentSource = readSource(contentPath);

  assert.match(pageSource, /function LegalPageTitle/);
  assert.match(pageSource, /function LegalSectionHeading/);
  assert.match(pageSource, /function LegalSubsectionHeading/);
  assert.match(pageSource, /function LegalClauseHeading/);
  assert.match(pageSource, /h1: LegalSectionHeading/);
  assert.match(pageSource, /h2: LegalSubsectionHeading/);
  assert.match(pageSource, /h3: LegalClauseHeading/);
  assert.doesNotMatch(pageSource, /CenterSection/);
  assert.doesNotMatch(pageSource, /StaticH1/);
  assert.doesNotMatch(pageSource, /<Box/);
  assert.doesNotMatch(contentSource, /StaticH1/);
  assert.doesNotMatch(contentSource, /CenterSection/);
  assert.doesNotMatch(contentSource, /<Box/);
});

test("eula preview keeps adjacent source content and preview-aware footer link", () => {
  const contentSource = readSource(contentPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(contentSource, /^PLEASE READ THIS END USER LICENSE AGREEMENT/m);
  assert.match(contentSource, /^# PART I: GENERAL TERMS/m);
  assert.match(contentSource, /^## \(1\) GENERAL LICENSE TERMS, RESTRICTIONS AND ORDER OF PRECEDENCE/m);
  assert.match(contentSource, /^### \(1\.1\) General License Terms/m);
  assert.doesNotMatch(contentSource, /^[ \t]+#/m);
  assert.doesNotMatch(contentSource, /^[ \t]+### \(/m);
  assert.doesNotMatch(contentSource, /<br\s*\/?>/);
  assert.match(contentSource, /www\.querypie\.com/);
  assert.match(footerSource, /label: "EULA", href: t\("\/eula", previewModeEnabled\)/);
});
