import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/t/certifications keeps authored copy and JSON card data in the route while shared section UI owns the rendering shells", () => {
  const pageSource = readSource("src/app/t/certifications/page.tsx");
  const sectionSource = readSource("src/components/sections/certifications-page.tsx");

  assert.match(pageSource, /from "@\/components\/sections\/certifications-page"/);
  assert.match(pageSource, /const certifications: readonly CertificationItem\[] = \[/);
  assert.match(pageSource, /id: "soc-2-type-ii"/);
  assert.match(pageSource, /title: "SOC 2 Type II"/);
  assert.match(pageSource, /title: "PCI DSS"/);
  assert.match(pageSource, /title: "ISO 22301"/);
  assert.match(pageSource, /export default function CertificationsPage\(\)/);
  assert.match(pageSource, /<CertificationsIntroSection>/);
  assert.match(pageSource, /<CertificationsIntroDescription>/);
  assert.match(pageSource, /<CertificationsTrialCtaContent>/);
  assert.match(pageSource, /\{certifications\.map\(\(item\) => \(/);
  assert.match(pageSource, /<CertificationCard key=\{item\.id\} \{\.\.\.item\} \/>/);

  assert.doesNotMatch(pageSource, /CertificationsPreviewPage/);
  assert.match(pageSource, /src: "\/certifications\/csa-star-level-1\.svg"/);
  assert.match(pageSource, /src: "\/certifications\/csa-star-level-2\.svg"/);
  assert.match(pageSource, /src: "\/certifications\/pci-dss\.svg"/);
  assert.match(pageSource, /imageWidth: 120/);
  assert.match(pageSource, /imageHeight: 120/);
  assert.match(pageSource, /displayWidth: "112\.5px"/);
  assert.match(pageSource, /displayHeight: "112\.5px"/);
  assert.match(pageSource, /imageWidth: 238/);
  assert.match(pageSource, /imageHeight: 72/);
  assert.match(pageSource, /displayWidth: "222\.9px"/);
  assert.match(pageSource, /displayHeight: "67\.5px"/);
  assert.doesNotMatch(pageSource, /function CertificationCard\(/);
  assert.doesNotMatch(pageSource, /function TrialCtaSection\(/);

  assert.match(sectionSource, /export type CertificationItem = \{/);
  assert.match(sectionSource, /id: string;/);
  assert.match(sectionSource, /export function CertificationsIntroSection\(/);
  assert.match(sectionSource, /export function CertificationsIntroDescription\(/);
  assert.match(sectionSource, /export function CertificationCard\(\{ title, description, src, alt, imageWidth, imageHeight, displayWidth, displayHeight \}: CertificationItem\)/);
  assert.match(sectionSource, /<Image[\s\S]*width=\{imageWidth\}[\s\S]*height=\{imageHeight\}/);
  assert.match(sectionSource, /style=\{\{ width: displayWidth, height: displayHeight \}\}/);
  assert.doesNotMatch(sectionSource, /<Image[^>]*\sfill\s/);
  assert.match(sectionSource, /export function CertificationsTrialCtaContent\(/);
  assert.match(sectionSource, /export function CertificationsTrialCtaAction\(/);
});
