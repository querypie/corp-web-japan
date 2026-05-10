import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/t/certifications authors visible page copy in page.tsx and keeps UI primitives in a section file", () => {
  const pageSource = readSource("src/app/t/certifications/page.tsx");
  const sectionSource = readSource("src/components/sections/certifications-page.tsx");

  assert.match(pageSource, /from "@\/components\/sections\/certifications-page"/);
  assert.match(pageSource, /<CertificationsPageTitle>認証<\/CertificationsPageTitle>/);
  assert.match(pageSource, /<CertificationCardTitle>SOC 2 Type II<\/CertificationCardTitle>/);
  assert.match(pageSource, /<CertificationCardTitle>ISO 22301<\/CertificationCardTitle>/);
  assert.match(pageSource, /<CertificationsTrustCenterTitle>セキュリティ対策とコンプライアンスの詳細情報<\/CertificationsTrustCenterTitle>/);
  assert.match(pageSource, /<CertificationsTrialCtaTitle>まずは小さく、失敗しないAXを始めよう<\/CertificationsTrialCtaTitle>/);

  assert.doesNotMatch(pageSource, /const certifications = \[/);
  assert.doesNotMatch(pageSource, /function CertificationCard\(/);
  assert.doesNotMatch(pageSource, /function TrialCtaSection\(/);

  assert.match(sectionSource, /export function CertificationCard\(/);
  assert.match(sectionSource, /export function CertificationsTrustCenterSection\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaSection\(/);
});
