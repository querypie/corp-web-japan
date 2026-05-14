import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const legalMdxSourcePath = "src/lib/legal-mdx-source.ts";
const legalMdxComponentsPath = "src/components/sections/legal/mdx.tsx";
const legalDocumentPath = "src/components/sections/legal/document.tsx";
const termsSourcePath = "src/app/t/terms-of-service/page.tsx";
const eulaSourcePath = "src/app/t/eula/page.tsx";
const privacyVersionPagePath = "src/app/t/privacy-policy/[slug]/page.tsx";
const privacyDocumentBodyComponentsPath = "src/components/sections/privacy-policy/document-body-components.tsx";
const privacyRecordsPath = "src/lib/privacy-policy/records.ts";

test("legal MDX routes share a cached source reader and evaluator like publication loaders", () => {
  const helperSource = readSource(legalMdxSourcePath);
  const legalMdxComponentsSource = readSource(legalMdxComponentsPath);
  const legalDocumentSource = readSource(legalDocumentPath);
  const termsSource = readSource(termsSourcePath);
  const eulaSource = readSource(eulaSourcePath);
  const privacyVersionPageSource = readSource(privacyVersionPagePath);
  const privacyDocumentBodyComponentsSource = readSource(privacyDocumentBodyComponentsPath);

  assert.match(helperSource, /const legalMdxSourceCache = new Map<string, Promise<string>>\(\);/);
  assert.match(helperSource, /export async function readCachedLegalMdxSource\(sourcePath: string\)/);
  assert.match(helperSource, /const cachedSource = legalMdxSourceCache\.get\(sourcePath\);/);
  assert.match(helperSource, /legalMdxSourceCache\.set\(sourcePath, sourcePromise\);/);
  assert.match(helperSource, /export async function renderLegalMdx<Frontmatter extends Record<string, unknown>>/);
  assert.match(helperSource, /components = buildLegalDocumentMdxComponents\(\)/);
  assert.match(helperSource, /parseFrontmatter: true,/);
  assert.match(helperSource, /remarkPlugins: \[remarkGfm\]/);

  assert.match(legalDocumentSource, /export function LegalDocumentIntro/);
  assert.match(legalDocumentSource, /export function LegalDocumentSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentLayout/);
  assert.match(legalDocumentSource, /export function LegalDocumentLead/);
  assert.match(legalDocumentSource, /companyBodyTextClassName/);
  assert.match(legalDocumentSource, /pb-\[50px\] pt-\[100px\] lg:pb-\[72px\] lg:pt-\[120px\]/);
  assert.match(legalDocumentSource, /mb-10 flex flex-col gap-10 pt-\[10px\] text-left lg:mb-\[50px\] lg:gap-\[50px\] lg:pt-0/);
  assert.match(legalDocumentSource, /text-\[40px\] font-medium leading-\[1\.2\] tracking-\[-0\.03em\] text-slate-950 sm:text-\[48px\] lg:text-\[52px\]/);
  assert.doesNotMatch(legalDocumentSource, /export function LegalDocumentPageSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentBody/);
  assert.match(legalMdxComponentsSource, /export function buildLegalDocumentMdxComponents\(\)/);
  assert.match(legalMdxComponentsSource, /export function LegalBodyH1/);
  assert.match(legalMdxComponentsSource, /export function LegalBodyH2/);
  assert.match(legalMdxComponentsSource, /export function LegalBodyH3/);

  assert.match(termsSource, /import \{ cache \} from "react";/);
  assert.match(termsSource, /const renderTermsOfServiceContent = cache\(async function renderTermsOfServiceContent\(\)/);
  assert.match(termsSource, /renderLegalMdx<TermsFrontmatter>\(\{ sourcePath \}\)/);
  assert.doesNotMatch(termsSource, /TermsOfServiceHero/);

  assert.match(eulaSource, /import \{ cache \} from "react";/);
  assert.match(eulaSource, /const renderEulaMdx = cache\(async function renderEulaMdx\(\)/);
  assert.match(eulaSource, /renderLegalMdx<EulaFrontmatter>\(\{ sourcePath \}\)/);
  assert.doesNotMatch(eulaSource, /function EulaMdxLink/);
  assert.doesNotMatch(eulaSource, /renderEulaPreviewMdx/);

  assert.match(privacyVersionPageSource, /const renderPrivacyPolicyVersion = cache\(async function renderPrivacyPolicyVersion\(slug: string\)/);
  assert.match(privacyVersionPageSource, /renderLegalMdx<PrivacyPolicyFrontmatter>\(\{/);
  assert.match(privacyDocumentBodyComponentsSource, /return buildLegalDocumentMdxComponents\(\);/);
});

test("privacy policy version discovery is cached alongside MDX reads", () => {
  const recordsSource = readSource(privacyRecordsPath);

  assert.match(recordsSource, /import \{ cache \} from "react";/);
  assert.match(recordsSource, /export const listPrivacyPolicySlugs = cache\(async function listPrivacyPolicySlugs\(\)/);
  assert.match(recordsSource, /export const getLatestPrivacyPolicySlug = cache\(async function getLatestPrivacyPolicySlug\(\)/);
  assert.match(recordsSource, /export const hasPrivacyPolicySlug = cache\(async function hasPrivacyPolicySlug\(slug: string\)/);
});
