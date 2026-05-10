import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/t/certifications keeps visible page copy in page.tsx and uses a shared image slot instead of per-item sizing props", () => {
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
  assert.doesNotMatch(pageSource, /<CertificationCardImage[^>]*className=/);
  assert.doesNotMatch(pageSource, /<CertificationCardImage[^>]*width=\{/);
  assert.doesNotMatch(pageSource, /<CertificationCardImage[^>]*height=\{/);

  assert.match(sectionSource, /export function CertificationsPageSection\(/);
  assert.match(sectionSource, /export function CertificationsGrid\(/);
  assert.match(sectionSource, /export function CertificationCard\(/);
  assert.match(sectionSource, /export function CertificationCardImage\(\{ src, alt \}/);
  assert.match(sectionSource, /<Image src=\{src\} alt=\{alt\} fill className="object-contain"/);
  assert.match(sectionSource, /max-w-\[180px\] sm:max-w-\[238px\]/);
  assert.match(sectionSource, /export function CertificationsTrustCenterSection\(/);
  assert.match(sectionSource, /export function CertificationsTrustCenterAction\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaSection\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaAction\(/);
});
