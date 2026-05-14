import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

const pagePath = "src/app/t/eula/page.tsx";
const contentPath = "src/app/t/eula/content.mdx";
const legalDocumentPath = "src/components/sections/legal/document.tsx";
const legalMdxSourcePath = "src/lib/legal-mdx-source.ts";

test("eula page exists with noindex metadata and preview canonical path", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);

  const source = readSource(pagePath);
  const contentSource = readSource(contentPath);
  const legalDocumentSource = readSource(legalDocumentPath);
  const legalMdxHelperSource = readSource(legalMdxSourcePath);

  assert.match(source, /export async function generateMetadata\(\): Promise<Metadata>/);
  assert.match(source, /const \{ frontmatter \} = await renderEulaMdx\(\);/);
  assert.doesNotMatch(source, /PreviewEulaPage/);
  assert.doesNotMatch(source, /renderEulaPreviewMdx/);
  assert.match(source, /title: frontmatter\.title,/);
  assert.match(source, /description: frontmatter\.description,/);
  assert.match(source, /canonical: "\/t\/eula"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /from "@\/components\/sections\/legal\/document"/);
  assert.match(source, /src\/app\/t\/eula\/content\.mdx/);
  assert.match(source, /renderLegalMdx<EulaFrontmatter>\(\{ sourcePath \}\)/);
  assert.match(source, /<LegalDocumentIntro>/);
  assert.match(source, /<LegalDocumentTitle>\{frontmatter\.title\}<\/LegalDocumentTitle>/);
  assert.match(source, /<LegalDocumentLayout>/);
  assert.match(source, /<LegalDocumentBody>\{evaluation\.content\}<\/LegalDocumentBody>/);
  assert.match(legalDocumentSource, /export function LegalDocumentIntro/);
  assert.match(legalDocumentSource, /export function LegalDocumentSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentLayout/);
  assert.match(legalDocumentSource, /export function LegalDocumentLead/);
  assert.doesNotMatch(legalDocumentSource, /export function LegalDocumentPageSection/);
  assert.match(legalMdxHelperSource, /export async function renderLegalMdx<Frontmatter extends Record<string, unknown>>/);
  assert.match(legalMdxHelperSource, /parseFrontmatter: true,/);
  assert.match(legalMdxHelperSource, /buildLegalDocumentMdxComponents\(\)/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /from "@\/components\/sections\/simple-cta-section"/);
  assert.match(source, /<AipFreeTrialCtaSection \/>/);
  assert.match(contentSource, /^---\ntitle: "QueryPie EULA"\ndescription: "End User License Agreement for QueryPie/m);
  assert.doesNotMatch(source, /export const metadata: Metadata = \{/);
});

test("eula preview keeps legal structure ownership in page.tsx and mdx body free of layout wrappers", () => {
  const pageSource = readSource(pagePath);
  const contentSource = readSource(contentPath);
  const legalDocumentSource = readSource(legalDocumentPath);

  assert.match(pageSource, /renderLegalMdx<EulaFrontmatter>/);
  assert.doesNotMatch(pageSource, /function LegalPageTitle/);
  assert.doesNotMatch(pageSource, /function EulaMdxLink/);
  assert.doesNotMatch(pageSource, /function LegalSectionHeading/);
  assert.doesNotMatch(pageSource, /function LegalSubsectionHeading/);
  assert.doesNotMatch(pageSource, /function LegalClauseHeading/);
  assert.match(pageSource, /<LegalDocumentSection>/);
  assert.doesNotMatch(pageSource, /<LegalDocumentShell>/);
  assert.match(pageSource, /from "@\/components\/sections\/legal\/document"/);
  assert.match(legalDocumentSource, /export const legalDocumentBodyClassName = \[/);
  assert.match(legalDocumentSource, /export function LegalDocumentIntro/);
  assert.match(legalDocumentSource, /export function LegalDocumentSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentLayout/);
  assert.match(legalDocumentSource, /export function LegalDocumentLead/);
  assert.doesNotMatch(legalDocumentSource, /export function LegalDocumentPageSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentTitle/);
  assert.doesNotMatch(pageSource, /CenterSection/);
  assert.doesNotMatch(pageSource, /StaticH1/);
  assert.doesNotMatch(pageSource, /<Box/);
  assert.doesNotMatch(contentSource, /StaticH1/);
  assert.doesNotMatch(contentSource, /CenterSection/);
  assert.doesNotMatch(contentSource, /<Box/);
});

test("eula preview keeps adjacent source content and preview-aware footer link", () => {
  const contentSource = readSource(contentPath);
  const footerSource = readSource("src/components/layout/site-footer.tsx");

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
