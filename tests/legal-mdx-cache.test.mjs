import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const legalMdxSourcePath = "src/lib/legal-mdx-source.ts";
const termsSourcePath = "src/components/sections/legal-terms-of-service.tsx";
const eulaSourcePath = "src/app/t/eula/page.tsx";
const privacyDocumentPath = "src/components/sections/privacy-policy-document-page.tsx";
const privacyRecordsPath = "src/lib/privacy-policy/records.ts";

test("legal MDX routes share a cached source reader like publication loaders", () => {
  const helperSource = readSource(legalMdxSourcePath);
  const termsSource = readSource(termsSourcePath);
  const eulaSource = readSource(eulaSourcePath);
  const privacyDocumentSource = readSource(privacyDocumentPath);

  assert.match(helperSource, /const legalMdxSourceCache = new Map<string, Promise<string>>\(\);/);
  assert.match(helperSource, /export async function readCachedLegalMdxSource\(sourcePath: string\)/);
  assert.match(helperSource, /const cachedSource = legalMdxSourceCache\.get\(sourcePath\);/);
  assert.match(helperSource, /legalMdxSourceCache\.set\(sourcePath, sourcePromise\);/);

  assert.match(termsSource, /import \{ cache, isValidElement \} from "react";/);
  assert.match(termsSource, /readCachedLegalMdxSource\(sourcePath\)/);
  assert.match(termsSource, /const renderTermsOfServiceContentCached = cache\(async function renderTermsOfServiceContentCached\(\)/);

  assert.match(eulaSource, /import \{ cache, isValidElement \} from "react";/);
  assert.match(eulaSource, /readCachedLegalMdxSource\(sourcePath\)/);
  assert.match(eulaSource, /const renderEulaMdx = cache\(async function renderEulaMdx\(\)/);
  assert.doesNotMatch(eulaSource, /renderEulaPreviewMdx/);

  assert.match(privacyDocumentSource, /import \{ cache, isValidElement \} from "react";/);
  assert.match(privacyDocumentSource, /readCachedLegalMdxSource\(sourcePath\)/);
  assert.match(privacyDocumentSource, /const renderPrivacyPolicyVersion = cache\(async function renderPrivacyPolicyVersion\(slug: string\)/);
});

test("privacy policy version discovery is cached alongside MDX reads", () => {
  const recordsSource = readSource(privacyRecordsPath);

  assert.match(recordsSource, /import \{ cache \} from "react";/);
  assert.match(recordsSource, /export const listPrivacyPolicySlugs = cache\(async function listPrivacyPolicySlugs\(\)/);
  assert.match(recordsSource, /export const getLatestPrivacyPolicySlug = cache\(async function getLatestPrivacyPolicySlug\(\)/);
  assert.match(recordsSource, /export const hasPrivacyPolicySlug = cache\(async function hasPrivacyPolicySlug\(slug: string\)/);
});
