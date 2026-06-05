import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { readSource } from "./helpers/source-readers.mjs";

const sameSitePaths = [
  "/about-us",
  "/contact-us",
  "/terms-of-service",
  "/privacy-policy",
  "/eula",
];

const lingoImplementationRoots = [
  "src/app/lingo",
  "src/components/layout/lingo",
  "src/components/lingo",
  "src/components/sections/lingo",
  "src/lib/lingo",
];

function listSourceFiles(path) {
  const entry = statSync(path);

  if (entry.isFile()) {
    return /\.(?:ts|tsx|js|jsx)$/.test(path) ? [path] : [];
  }

  return readdirSync(path).flatMap((name) => listSourceFiles(join(path, name)));
}

test("Lingo implementation normalizes querypie.ai links to same-tab relative paths", () => {
  const files = lingoImplementationRoots.flatMap(listSourceFiles);

  assert.ok(files.length > 0, "expected Lingo implementation files to be scanned");

  for (const file of files) {
    const source = readSource(file);

    assert.doesNotMatch(
      source,
      /https:\/\/(?:www\.)?querypie\.ai\//,
      `${file} must not keep absolute querypie.ai links`,
    );
  }
});

test("Lingo footer same-site company and legal links use current-tab relative paths", () => {
  const footer = readSource("src/components/layout/lingo/Footer.tsx");

  for (const path of sameSitePaths) {
    assert.match(footer, new RegExp(`\"${path.replaceAll("/", "\\/")}\"`));
  }

  assert.doesNotMatch(footer, /https:\/\/(?:www\.)?querypie\.ai\/(about-us|contact-us|terms-of-service|privacy-policy|eula)/);
  assert.doesNotMatch(footer, /https:\/\/www\.querypie\.com\//);
  assert.doesNotMatch(footer, /target="_blank"/);
  assert.doesNotMatch(footer, /rel="noopener noreferrer"/);
});

test("Lingo GNB company links use same-tab relative navigation", () => {
  const gnb = readSource("src/components/layout/lingo/GNB.tsx");

  assert.match(gnb, /href: "\/about-us"/);
  assert.match(gnb, /href: "\/contact-us"/);
  assert.doesNotMatch(gnb, /https:\/\/(?:www\.)?querypie\.ai\/(about-us|contact-us)/);
  assert.doesNotMatch(gnb, /target="_blank"/);
  assert.doesNotMatch(gnb, /rel="noopener noreferrer"/);
});

test("Lingo contact CTA uses same-tab relative navigation", () => {
  const button = readSource("src/components/lingo/common/Button.tsx");

  assert.match(button, /const contactUrl = "\/contact-us"/);
  assert.doesNotMatch(button, /https:\/\/(?:www\.)?querypie\.ai\/contact-us/);
  assert.doesNotMatch(button, /href=\{contactUrl\}[\s\S]{0,160}target="_blank"/);
  assert.doesNotMatch(button, /href=\{contactUrl\}[\s\S]{0,160}rel="noopener noreferrer"/);
});

test("Lingo cookie consent Privacy Policy link uses same-tab relative navigation", () => {
  const cookieConsent = readSource("src/components/layout/lingo/CookieConsent.tsx");

  assert.match(cookieConsent, /"\/privacy-policy"/);
  assert.doesNotMatch(cookieConsent, /https:\/\/(?:www\.)?querypie\.ai\/privacy-policy/);
  assert.doesNotMatch(cookieConsent, /target="_blank"/);
  assert.doesNotMatch(cookieConsent, /rel="noopener noreferrer"/);
});

test("Lingo OpenSpec records the migration and same-site link contract", () => {
  const spec = readSource("openspec/specs/contract-lingo-website-migration/spec.md");

  assert.match(spec, /Requirement: same-site link targets/);
  assert.match(spec, /root-relative paths/);
  assert.match(spec, /current tab\/window/);
  assert.match(spec, /Footer, GNB, CTA buttons, cookie consent, and other\s+in-page links/);
  assert.match(spec, /https:\/\/querypie\.ai\/\.\.\./);
  assert.match(spec, /target="_blank"/);
});
