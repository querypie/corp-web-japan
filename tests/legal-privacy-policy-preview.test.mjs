import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const routeDir = new URL("../src/app/privacy-policy/", import.meta.url);
const contentDir = new URL("../src/content/privacy-policy/", import.meta.url);
const pagePath = "src/app/privacy-policy/page.tsx";
const versionPagePath = "src/app/privacy-policy/[slug]/page.tsx";
const selectorPath = "src/components/sections/privacy-policy/version-selector.tsx";
const documentBodyComponentsPath = "src/components/sections/privacy-policy/document-body-components.tsx";
const legalMdxPath = "src/components/sections/legal/mdx.tsx";
const legalDocumentPath = "src/components/sections/legal/document.tsx";
const legalMdxSourcePath = "src/lib/legal-mdx-source.ts";
const sourcesPath = "src/lib/privacy-policy/records.ts";
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

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

test("privacy policy route keeps a latest alias page while [slug]/page.tsx owns rendering and public metadata", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);
  assert.equal(existsSync(new URL(`../${versionPagePath}`, import.meta.url)), true, `${versionPagePath} should exist`);
  assert.equal(existsSync(new URL(`../${documentBodyComponentsPath}`, import.meta.url)), true, `${documentBodyComponentsPath} should exist`);

  const pageSource = readSource(pagePath);
  const versionPageSource = readSource(versionPagePath);

  assert.match(pageSource, /canonicalPath: "\/privacy-policy"/);
  assert.match(pageSource, /getLatestPrivacyPolicySlug\(\)/);
  assert.match(pageSource, /generatePrivacyPolicyMetadata\(\{/);
  assert.match(pageSource, /renderPrivacyPolicyVersionPage\(latestSlug\)/);
  assert.match(pageSource, /from "\.\/\[slug\]\/page"/);

  assert.match(versionPageSource, /generateStaticParams\(\)/);
  assert.match(versionPageSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(versionPageSource, /listPrivacyPolicySlugs\(\)/);
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
  assert.match(versionPageSource, /export async function generatePrivacyPolicyMetadata\(/);
  assert.match(versionPageSource, /export async function renderPrivacyPolicyVersionPage\(slug: string\)/);
  assert.match(versionPageSource, /canonicalPath: `\/privacy-policy\/\$\{slug\}`/);
  assert.match(versionPageSource, /return renderPrivacyPolicyVersionPage\(slug\)/);
  assert.match(versionPageSource, /<SiteHeader \/>/);
  assert.doesNotMatch(versionPageSource, /PrivacySelectorBox/);
  assert.doesNotMatch(versionPageSource, /PrivacyPolicyLanguageSelector/);
  assert.match(versionPageSource, /<PrivacyPolicyVersionSelector currentSlug=\{frontmatter\.version\} slugs=\{slugs\} \/>/);
  assert.match(versionPageSource, /<AipFreeTrialCtaSection \/>/);
  assert.match(versionPageSource, /<SiteFooter \/>/);
});

test("privacy policy public keeps version discovery in records.ts while component definitions live under src/components/sections/privacy-policy", () => {
  const versionPageSource = readSource(versionPagePath);
  const selectorSource = readSource(selectorPath);
  const documentBodyComponentsSource = readSource(documentBodyComponentsPath);
  const legalMdxSource = readSource(legalMdxPath);
  const legalDocumentSource = readSource(legalDocumentPath);
  const legalMdxHelperSource = readSource(legalMdxSourcePath);
  const sourcesSource = readSource(sourcesPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(versionPageSource, /renderLegalMdx<PrivacyPolicyFrontmatter>\(\{/);
  assert.match(versionPageSource, /components: buildPrivacyPolicyDocumentComponents\(\),/);
  assert.match(versionPageSource, /src\/content\/privacy-policy", `\$\{slug\}\.mdx`/);
  assert.match(versionPageSource, /hasPrivacyPolicySlug\(slug\)/);
  assert.match(versionPageSource, /listPrivacyPolicySlugs\(\)/);
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
  assert.doesNotMatch(versionPageSource, /function PrivacyMdxLink/);
  assert.doesNotMatch(versionPageSource, /function PrivacyPolicyLanguageSelector/);
  assert.doesNotMatch(versionPageSource, /function PrivacySelectorBox/);

  assert.match(documentBodyComponentsSource, /buildLegalDocumentMdxComponents/);
  assert.match(documentBodyComponentsSource, /export function buildPrivacyPolicyDocumentComponents\(/);
  assert.match(legalMdxSource, /export function LegalBodyH1/);
  assert.match(legalMdxSource, /export function LegalBodyH2/);
  assert.match(legalMdxSource, /export function LegalBodyH3/);
  assert.match(legalMdxSource, /export function LegalMdxLink/);
  assert.match(legalMdxSource, /export function buildLegalDocumentMdxComponents\(/);
  assert.match(legalDocumentSource, /export function LegalDocumentIntro/);
  assert.match(legalDocumentSource, /export function LegalDocumentSection/);
  assert.match(legalDocumentSource, /export function LegalDocumentLayout/);
  assert.match(legalDocumentSource, /export function LegalDocumentTitleActions/);
  assert.match(legalDocumentSource, /export function LegalDocumentLead/);
  assert.match(legalDocumentSource, /companyBodyTextClassName/);
  assert.match(legalDocumentSource, /pb-\[50px\] pt-\[100px\] lg:pb-\[72px\] lg:pt-\[120px\]/);
  assert.match(legalDocumentSource, /mb-10 flex flex-col gap-10 pt-\[10px\] text-left lg:mb-\[50px\] lg:gap-\[50px\] lg:pt-0/);
  assert.match(legalDocumentSource, /text-\[40px\] font-medium leading-\[1\.2\] tracking-\[-0\.03em\] text-slate-950 sm:text-\[48px\] lg:text-\[52px\]/);
  assert.doesNotMatch(legalDocumentSource, /export function LegalDocumentPageSection/);
  assert.match(legalDocumentSource, /"leading-6 text-slate-600"/);
  assert.match(legalDocumentSource, /\[&_p\]:mt-\[1\.3125rem\] \[&_p\]:leading-6 \[&_p\]:text-slate-600/);
  assert.match(legalDocumentSource, /\[&_li>ul\]:mt-2 \[&_li>ol\]:mt-2/);
  assert.match(legalDocumentSource, /\[&_li>ul>li:last-child\]:mb-0 \[&_li>ol>li:last-child\]:mb-0/);
  assert.match(legalDocumentSource, /\[&_blockquote_p\]:mt-0 \[&_blockquote_p\]:leading-6 \[&_blockquote_p\]:text-slate-600/);
  assert.match(legalDocumentSource, /\[&_table\]:my-\[34px\] \[&_table\]:w-full \[&_table\]:border-collapse/);
  assert.doesNotMatch(legalDocumentSource, /text-\[16px\] leading-\[26px\] text-slate-600/);
  assert.doesNotMatch(legalDocumentSource, /\[&_p\]:text-\[16px\]/);
  assert.doesNotMatch(legalDocumentSource, /\[&_blockquote_p\]:mt-0 \[&_blockquote_p\]:text-\[16px\]/);
  assert.doesNotMatch(legalDocumentSource, /\[&_li\]:mb-2 \[&_li\]:text-\[15px\]/);
  assert.doesNotMatch(legalDocumentSource, /\[&_table\]:text-sm/);
  assert.doesNotMatch(legalDocumentSource, /\[&_li>ul\]:mt-\[1\.3125rem\]/);
  assert.doesNotMatch(legalDocumentSource, /\[&_li>ol\]:mt-\[1\.3125rem\]/);
  assert.doesNotMatch(legalMdxSource, /className="mt-6 text-\[15px\]/);
  assert.match(legalMdxHelperSource, /export async function renderLegalMdx<Frontmatter extends Record<string, unknown>>/);
  assert.match(legalMdxHelperSource, /parseFrontmatter: true,/);

  assert.match(selectorSource, /import \{ useRouter \} from "next\/navigation";/);
  assert.match(selectorSource, /const router = useRouter\(\);/);
  assert.match(selectorSource, /router\.push\(`\/privacy-policy\/\$\{nextSlug\}`\)/);
  assert.doesNotMatch(selectorSource, /window\.location\.assign/);
  assert.match(footerSource, /label: "プライバシーポリシー", href: "\/privacy-policy"/);
  assert.match(sourcesSource, /readdir\(PRIVACY_POLICY_CONTENT_DIR, \{ withFileTypes: true \}\)/);
  assert.match(sourcesSource, /filter\(\(entry\) => entry\.isFile\(\) && PRIVACY_POLICY_FILE_PATTERN\.test\(entry\.name\)\)/);
  assert.match(sourcesSource, /sort\(\)/);
  assert.equal(existsSync(new URL("privacy-policy-document.tsx", routeDir)), false);
  assert.equal(existsSync(new URL("privacy-policy-sources.ts", routeDir)), false);
  assert.equal(existsSync(new URL("privacy-policy-versions.ts", routeDir)), false);
  assert.equal(existsSync(new URL("../src/app/privacy-policy/document-renderer.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/privacy-policy/version-selector.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/components/sections/privacy-policy/document-header-controls.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/components/sections/privacy-policy/version-selector.tsx", import.meta.url)), true);
});

test("privacy policy public migrates every upstream English version into src/content/privacy-policy dated MDX files", () => {
  const contentFiles = readdirSync(contentDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.mdx$/.test(name))
    .sort()
    .reverse();

  assert.deepEqual(contentFiles.map((name) => name.replace(/\.mdx$/g, "")), expectedVersionSlugs);
  assert.equal(existsSync(new URL("privacy-policy-content.mdx", routeDir)), false);
  assert.equal(existsSync(new URL("../src/components/sections/legal-privacy-policy-version-selector.tsx", import.meta.url)), false);

  for (const slug of expectedVersionSlugs) {
    const contentSource = readFileSync(new URL(`${slug}.mdx`, contentDir), "utf8");
    assert.match(contentSource, new RegExp(`date: \"${slug}\"`));
    assert.match(contentSource, new RegExp(`version: \"${slug}\"`));
    assert.doesNotMatch(contentSource, /PrivacyPolicyVersionSelector/);
    assert.doesNotMatch(contentSource, /PrivacyPolicyLanguageSelector/);
    assert.doesNotMatch(contentSource, /Korean/);
    assert.doesNotMatch(contentSource, /English/);
    assert.doesNotMatch(contentSource, /StaticH3 as=\"h1\"/);
  }
});
