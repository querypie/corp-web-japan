import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/t/certifications keeps visible page copy in page.tsx while the section file only exports the slimmer UI shell primitives", () => {
  const pageSource = readSource("src/app/t/certifications/page.tsx");
  const sectionSource = readSource("src/components/sections/certifications-page.tsx");

  assert.match(pageSource, /from "@\/components\/sections\/certifications-page"/);
  assert.match(pageSource, /<h1 className=.*>認証<\/h1>/);
  assert.match(pageSource, /<h2 className=.*>SOC 2 Type II<\/h2>/);
  assert.match(pageSource, /<h2 className=.*>ISO 22301<\/h2>/);
  assert.match(pageSource, /<h2 className=.*>セキュリティ対策とコンプライアンスの詳細情報<\/h2>/);
  assert.match(pageSource, /<h2 className=.*>まずは小さく、失敗しないAXを始めよう<\/h2>/);

  assert.doesNotMatch(pageSource, /const certifications = \[/);
  assert.doesNotMatch(pageSource, /function CertificationCard\(/);
  assert.doesNotMatch(pageSource, /function TrialCtaSection\(/);

  assert.match(sectionSource, /export function CertificationsPageSection\(/);
  assert.match(sectionSource, /export function CertificationsGrid\(/);
  assert.match(sectionSource, /export function CertificationCard\(/);
  assert.match(sectionSource, /export function CertificationCardImage\(/);
  assert.match(sectionSource, /export function CertificationsTrustCenterSection\(/);
  assert.match(sectionSource, /export function CertificationsTrustCenterAction\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaSection\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaAction\(/);

  assert.doesNotMatch(sectionSource, /export function CertificationsPageTitle\(/);
  assert.doesNotMatch(sectionSource, /export function CertificationsPageDescription\(/);
  assert.doesNotMatch(sectionSource, /export function CertificationCardContent\(/);
  assert.doesNotMatch(sectionSource, /export function CertificationCardDescription\(/);
  assert.doesNotMatch(sectionSource, /export function CertificationCardDescriptionLine\(/);
  assert.doesNotMatch(sectionSource, /export function CertificationsTrialCtaContent\(/);
  assert.doesNotMatch(sectionSource, /export function CertificationsTrialCtaDescription\(/);
});
