import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/t/certifications keeps authored copy in the route, drives the card list from JSON data, and uses shared card and CTA UI from the section file", () => {
  const pageSource = readSource("src/app/t/certifications/page.tsx");
  const sectionSource = readSource("src/components/sections/certifications-page.tsx");

  assert.match(pageSource, /from "@\/components\/sections\/certifications-page"/);
  assert.match(pageSource, /const certifications: readonly CertificationItem\[] = \[/);
  assert.match(pageSource, /title: "SOC 2 Type II"/);
  assert.match(pageSource, /title: "PCI DSS"/);
  assert.match(pageSource, /title: "ISO 22301"/);
  assert.match(pageSource, /<h1 className=.*>認証<\/h1>/);
  assert.match(pageSource, /<h2 className=.*>セキュリティ対策とコンプライアンスの詳細情報<\/h2>/);
  assert.match(pageSource, /<h2 className=.*>まずは小さく、失敗しないAXを始めよう<\/h2>/);
  assert.match(pageSource, /\{certifications\.map\(\(item, index\) => \(/);
  assert.match(pageSource, /<CertificationCard key=\{`\$\{item\.title\}-\$\{item\.src\}-\$\{index\}`\} \{\.\.\.item\} \/>/);

  assert.doesNotMatch(pageSource, /className: "w-\[/);
  assert.doesNotMatch(pageSource, /width: \d+/);
  assert.doesNotMatch(pageSource, /height: \d+/);
  assert.doesNotMatch(pageSource, /function CertificationCard\(/);
  assert.doesNotMatch(pageSource, /function TrialCtaSection\(/);

  assert.match(sectionSource, /export type CertificationItem = \{/);
  assert.match(sectionSource, /description: readonly string\[];/);
  assert.match(sectionSource, /export function CertificationCard\(\{ title, description, src, alt \}: CertificationItem\)/);
  assert.match(sectionSource, /<Image src=\{src\} alt=\{alt\} fill className="object-contain"/);
  assert.match(sectionSource, /max-w-\[180px\] sm:max-w-\[238px\]/);
  assert.match(sectionSource, /export function CertificationsTrialCtaSection\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaAction\(/);
});
