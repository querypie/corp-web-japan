import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(path) {
  return readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
}

test("/t/certifications uses intrinsic image dimensions instead of fill-only sizing for certification logos", () => {
  const sectionSource = readSource("src/components/sections/certifications-page.tsx");

  assert.match(sectionSource, /type CertificationItem = \{[\s\S]*width: number;[\s\S]*height: number;/);
  assert.match(sectionSource, /export function CertificationCard\(\{ title, description, src, alt, width, height \}: CertificationItem\)/);
  assert.match(sectionSource, /<Image[\s\S]*src=\{src\}[\s\S]*alt=\{alt\}[\s\S]*width=\{width\}[\s\S]*height=\{height\}/);
  assert.doesNotMatch(sectionSource, /<Image[^>]*\sfill\s/);
});
