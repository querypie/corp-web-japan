import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/certifications uses original-source display dimensions together with intrinsic image dimensions for certification logos", () => {
  const pageSource = readSource("src/app/certifications/page.tsx");
  const sectionSource = readSource("src/components/sections/certifications/section.tsx");

  assert.match(sectionSource, /type CertificationItem = \{[\s\S]*imageWidth: number;[\s\S]*imageHeight: number;[\s\S]*displayWidth: string;[\s\S]*displayHeight: string;/);
  assert.match(sectionSource, /export function CertificationCard\(\{ title, description, src, alt, imageWidth, imageHeight, displayWidth, displayHeight \}: CertificationItem\)/);
  assert.match(sectionSource, /<Image[\s\S]*src=\{src\}[\s\S]*alt=\{alt\}[\s\S]*width=\{imageWidth\}[\s\S]*height=\{imageHeight\}[\s\S]*style=\{\{ width: displayWidth, height: displayHeight \}\}/);
  assert.doesNotMatch(sectionSource, /<Image[^>]*\sfill\s/);

  assert.match(pageSource, /src: "\/certifications\/csa-star-level-1\.svg"/);
  assert.match(pageSource, /src: "\/certifications\/csa-star-level-2\.svg"/);
  assert.match(pageSource, /src: "\/certifications\/pci-dss\.svg"/);
  assert.match(pageSource, /src: "\/certifications\/iso-iec-42001\.png"/);
  assert.match(pageSource, /displayWidth: "112\.5px"/);
  assert.match(pageSource, /displayHeight: "67\.42px"/);
  assert.match(pageSource, /displayHeight: "119\.53px"/);
  assert.match(pageSource, /displayWidth: "187\.5px"/);
  assert.match(pageSource, /displayHeight: "121\.88px"/);
  assert.match(pageSource, /displayWidth: "119\.84px"/);
  assert.match(pageSource, /displayHeight: "82\.86px"/);
  assert.match(pageSource, /displayWidth: "177\.89px"/);
  assert.match(pageSource, /displayHeight: "89\.63px"/);
});
