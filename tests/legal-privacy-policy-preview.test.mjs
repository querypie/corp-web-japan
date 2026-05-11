import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const routeDir = new URL("../src/app/t/privacy-policy/", import.meta.url);
const contentDir = new URL("../src/content/privacy-policy/", import.meta.url);
const pagePath = "src/app/t/privacy-policy/page.tsx";
const versionPagePath = "src/app/t/privacy-policy/[slug]/page.tsx";
const documentPath = "src/components/sections/privacy-policy-document-page.tsx";
const selectorPath = "src/components/sections/privacy-policy-version-selector.tsx";
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

test("privacy policy preview route keeps latest alias page and version detail route with noindex metadata", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);
  assert.equal(existsSync(new URL(`../${versionPagePath}`, import.meta.url)), true, `${versionPagePath} should exist`);

  const pageSource = readSource(pagePath);
  const versionPageSource = readSource(versionPagePath);

  assert.match(pageSource, /canonicalPath: "\/t\/privacy-policy"/);
  assert.match(pageSource, /getLatestPrivacyPolicySlug\(\)/);
  assert.match(versionPageSource, /generateStaticParams\(\)/);
  assert.match(versionPageSource, /listPrivacyPolicySlugs\(\)/);
  assert.match(versionPageSource, /canonicalPath: `\/t\/privacy-policy\/\$\{slug\}`/);
  assert.match(versionPageSource, /PrivacyPolicyDocumentPage slug=\{slug\}/);
});

test("privacy policy preview scans shared content filenames instead of keeping a duplicated versions registry", () => {
  const documentSource = readSource(documentPath);
  const selectorSource = readSource(selectorPath);
  const sourcesSource = readSource(sourcesPath);
  const footerSource = readFileSync(footerPath, "utf8");

  assert.match(documentSource, /parseFrontmatter: true/);
  assert.match(documentSource, /src\/content\/privacy-policy", `\$\{slug\}\.mdx`/);
  assert.match(documentSource, /hasPrivacyPolicySlug\(slug\)/);
  assert.match(documentSource, /listPrivacyPolicySlugs\(\)/);
  assert.match(documentSource, /<PrivacyPolicyLanguageSelector language="en" \/>/);
  assert.match(documentSource, /<PrivacyPolicyVersionSelector currentSlug=\{frontmatter\.version\} slugs=\{slugs\} \/>/);
  assert.doesNotMatch(documentSource, /Change history/);
  assert.match(documentSource, /Effective date: \{frontmatter\.date\}/);

  assert.match(selectorSource, /window\.location\.assign\(`\/t\/privacy-policy\/\$\{nextSlug\}`\)/);
  assert.match(footerSource, /label: "プライバシーポリシー", href: t\("\/privacy-policy", previewModeEnabled\)/);
  assert.match(sourcesSource, /readdir\(PRIVACY_POLICY_CONTENT_DIR, \{ withFileTypes: true \}\)/);
  assert.match(sourcesSource, /filter\(\(entry\) => entry\.isFile\(\) && PRIVACY_POLICY_FILE_PATTERN\.test\(entry\.name\)\)/);
  assert.match(sourcesSource, /sort\(\)/);
  assert.equal(existsSync(new URL("privacy-policy-document.tsx", routeDir)), false);
  assert.equal(existsSync(new URL("privacy-policy-version-selector.tsx", routeDir)), false);
  assert.equal(existsSync(new URL("privacy-policy-sources.ts", routeDir)), false);
  assert.equal(existsSync(new URL("privacy-policy-versions.ts", routeDir)), false);
});

test("privacy policy preview migrates every upstream English version into src/content/privacy-policy dated MDX files", () => {
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
