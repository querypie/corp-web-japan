import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { readSource, sourceExists, sourcePath } from "../../../../helpers/source-readers.mjs";

const contentDir = sourcePath("src/content/privacy-policy");
const pagePath = "src/app/t/privacy-policy/page.tsx";
const versionPagePath = "src/app/t/privacy-policy/[slug]/page.tsx";
const selectorPath = "src/components/sections/privacy-policy/version-selector.tsx";
const documentBodyComponentsPath = "src/components/sections/privacy-policy/document-body-components.tsx";
const legalDocumentPath = "src/components/sections/legal/document.tsx";
const legalMdxSourcePath = "src/lib/legal-mdx-source.ts";
const sourcesPath = "src/lib/privacy-policy/records.ts";

const expectedVersionSlugs = [
  "2026-01-15",
  "2025-12-03",
  "2025-10-21",
  "2025-09-08",
  "2025-07-28",
  "2025-07-15",
  "2025-06-10",
  "2025-06-05",
  "2024-11-29",
  "2024-06-07",
  "2023-09-22",
  "2023-08-25",
  "2022-10-11",
  "2022-06-06",
  "2022-01-12",
  "2021-03-30",
  "2019-11-29",
];

test("privacy policy route keeps latest alias page and version detail route with noindex metadata", () => {
  assert.equal(sourceExists(pagePath), true, `${pagePath} should exist`);
  assert.equal(sourceExists(versionPagePath), true, `${versionPagePath} should exist`);

  const pageSource = readSource(pagePath);
  const versionPageSource = readSource(versionPagePath);

  assert.match(pageSource, /canonicalPath: "\/t\/privacy-policy"/);
  assert.doesNotMatch(pageSource, /PreviewPrivacyPolicyPage/);
  assert.match(pageSource, /getLatestPrivacyPolicySlug\(\)/);
  assert.match(versionPageSource, /generateStaticParams\(\)/);
  assert.match(versionPageSource, /listPrivacyPolicySlugs\(\)/);
  assert.match(versionPageSource, /canonicalPath: `\/t\/privacy-policy\/\$\{slug\}`/);
  assert.match(versionPageSource, /return renderPrivacyPolicyVersionPage\(slug\)/);
  assert.match(versionPageSource, /<LegalDocumentSection>/);
  assert.match(versionPageSource, /from "@\/components\/sections\/legal\/document"/);
  assert.match(versionPageSource, /<PrivacyPolicyVersionSelector currentSlug=\{frontmatter\.version\} slugs=\{slugs\} \/>/);
});

test("privacy policy preview scans shared content filenames and uses the shared legal document contract", () => {
  const versionPageSource = readSource(versionPagePath);
  const selectorSource = readSource(selectorPath);
  const documentBodyComponentsSource = readSource(documentBodyComponentsPath);
  const legalDocumentSource = readSource(legalDocumentPath);
  const legalMdxHelperSource = readSource(legalMdxSourcePath);
  const sourcesSource = readSource(sourcesPath);
  const footerSource = readSource("src/components/layout/site-footer.tsx");

  assert.match(versionPageSource, /renderLegalMdx<PrivacyPolicyFrontmatter>\(\{/);
  assert.match(versionPageSource, /src\/content\/privacy-policy", `\$\{slug\}\.mdx`/);
  assert.match(versionPageSource, /components: buildPrivacyPolicyDocumentComponents\(\),/);
  assert.match(versionPageSource, /from "@\/components\/sections\/legal\/document"/);
  assert.match(versionPageSource, /hasPrivacyPolicySlug\(slug\)/);
  assert.match(versionPageSource, /listPrivacyPolicySlugs\(\)/);
  assert.doesNotMatch(versionPageSource, /PrivacyPolicyLanguageSelector/);
  assert.match(versionPageSource, /<PrivacyPolicyVersionSelector currentSlug=\{frontmatter\.version\} slugs=\{slugs\} \/>/);
  assert.match(versionPageSource, /<LegalDocumentIntro>/);
  assert.doesNotMatch(versionPageSource, /<LegalDocumentIntro className=/);
  assert.doesNotMatch(versionPageSource, /<LegalDocumentMeta>/);
  assert.doesNotMatch(versionPageSource, /frontmatter\.date/);
  assert.match(versionPageSource, /<LegalDocumentTitleActions>/);
  assert.match(versionPageSource, /<LegalDocumentTitle>\{frontmatter\.title\}<\/LegalDocumentTitle>\s*<PrivacyPolicyVersionSelector currentSlug=\{frontmatter\.version\} slugs=\{slugs\} \/>/s);
  assert.doesNotMatch(versionPageSource, /LegalDocumentTitle variant=/);
  assert.match(versionPageSource, /<LegalDocumentTitleActions>\s*<LegalDocumentTitle>\{frontmatter\.title\}<\/LegalDocumentTitle>\s*<PrivacyPolicyVersionSelector currentSlug=\{frontmatter\.version\} slugs=\{slugs\} \/>\s*<\/LegalDocumentTitleActions>\s*<\/LegalDocumentIntro>/s);
  assert.doesNotMatch(versionPageSource, /<div className="flex flex-col gap-3">/);
  assert.doesNotMatch(versionPageSource, /<div className="flex flex-wrap items-center gap-4">/);
  assert.doesNotMatch(versionPageSource, /<LegalDocumentLead>\{frontmatter\.description\}<\/LegalDocumentLead>/);
  assert.match(versionPageSource, /<LegalDocumentLayout>/);
  assert.match(versionPageSource, /<LegalDocumentBody>\{evaluation\.content\}<\/LegalDocumentBody>/);
  assert.doesNotMatch(versionPageSource, /LegalDocumentBody className=/);
  assert.doesNotMatch(versionPageSource, /function PrivacyMdxLink/);
  assert.doesNotMatch(versionPageSource, /function PrivacyPolicyLanguageSelector/);
  assert.doesNotMatch(versionPageSource, /function PrivacySelectorBox/);

  assert.match(documentBodyComponentsSource, /buildLegalDocumentMdxComponents\(\)/);
  assert.match(documentBodyComponentsSource, /buildPrivacyPolicyDocumentComponents\(\)/);
  assert.doesNotMatch(documentBodyComponentsSource, /export function LegalBodyH1/);
  assert.doesNotMatch(documentBodyComponentsSource, /export function PrivacyMdxLink/);
  assert.match(legalDocumentSource, /export function LegalDocumentIntro/);
  assert.match(legalDocumentSource, /export function LegalDocumentSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentLayout/);
  assert.match(legalDocumentSource, /export function LegalDocumentTitleActions/);
  assert.match(legalDocumentSource, /export function LegalDocumentLead/);
  assert.match(legalDocumentSource, /companyBodyTextClassName/);
  assert.match(legalDocumentSource, /pb-\[50px\] pt-\[100px\] lg:pb-\[72px\] lg:pt-\[120px\]/);
  assert.match(legalDocumentSource, /flex flex-col gap-10 pt-\[10px\] text-left lg:gap-\[50px\] lg:pt-0/);
  assert.match(legalDocumentSource, /text-\[40px\] font-medium leading-\[1\.2\] tracking-\[-0\.03em\] text-slate-950 sm:text-\[48px\] lg:text-\[52px\]/);
  assert.match(legalDocumentSource, /export function LegalDocumentPageSection/);
  assert.match(legalMdxHelperSource, /export async function renderLegalMdx<Frontmatter extends Record<string, unknown>>/);
  assert.match(legalMdxHelperSource, /parseFrontmatter: true,/);

  assert.match(selectorSource, /window\.location\.assign\(`\/t\/privacy-policy\/\$\{nextSlug\}`\)/);
  assert.match(footerSource, /label: "プライバシーポリシー", href: t\("\/privacy-policy", previewModeEnabled\)/);
  assert.match(sourcesSource, /readdir\(PRIVACY_POLICY_CONTENT_DIR, \{ withFileTypes: true \}\)/);
  assert.match(sourcesSource, /filter\(\(entry\) => entry\.isFile\(\) && PRIVACY_POLICY_FILE_PATTERN\.test\(entry\.name\)\)/);
  assert.match(sourcesSource, /sort\(\)/);
  assert.equal(sourceExists("src/app/t/privacy-policy/privacy-policy-document.tsx"), false);
  assert.equal(sourceExists("src/app/t/privacy-policy/privacy-policy-version-selector.tsx"), false);
  assert.equal(sourceExists("src/app/t/privacy-policy/privacy-policy-sources.ts"), false);
  assert.equal(sourceExists("src/app/t/privacy-policy/privacy-policy-versions.ts"), false);
  assert.equal(sourceExists("src/app/t/privacy-policy/document-renderer.tsx"), false);
  assert.equal(sourceExists("src/app/t/privacy-policy/version-selector.tsx"), false);
  assert.equal(sourceExists("src/components/sections/privacy-policy/document-header-controls.tsx"), false);
  assert.equal(sourceExists("src/components/sections/privacy-policy/version-selector.tsx"), true);
});

test("privacy policy preview migrates every upstream English version into src/content/privacy-policy dated MDX files", () => {
  const contentFiles = readdirSync(contentDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.mdx$/.test(name))
    .sort()
    .reverse();

  assert.deepEqual(contentFiles.map((name) => name.replace(/\.mdx$/g, "")), expectedVersionSlugs);
  assert.equal(sourceExists("src/app/t/privacy-policy/privacy-policy-content.mdx"), false);
  assert.equal(sourceExists("src/components/sections/legal-privacy-policy-version-selector.tsx"), false);

  for (const slug of expectedVersionSlugs) {
    const contentSource = readSource(`src/content/privacy-policy/${slug}.mdx`);
    assert.match(contentSource, new RegExp(`date: "${slug}"`));
    assert.match(contentSource, new RegExp(`version: "${slug}"`));
    assert.doesNotMatch(contentSource, /PrivacyPolicyVersionSelector/);
    assert.doesNotMatch(contentSource, /PrivacyPolicyLanguageSelector/);
    assert.doesNotMatch(contentSource, /Korean/);
    assert.doesNotMatch(contentSource, /English/);
    assert.doesNotMatch(contentSource, /StaticH3 as="h1"/);
  }
});
