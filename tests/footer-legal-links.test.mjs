import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const siteFooterPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);
const resourceLeadFormPath = new URL("../src/components/sections/publication/lead-form.tsx", import.meta.url);

const expectedLinks = [
  'label: "Cookie設定", href: t("/cookie-preference", previewModeEnabled)',
  'label: "利用規約", href: t("/terms-of-service", previewModeEnabled)',
  'label: "プライバシーポリシー", href: t("/privacy-policy", previewModeEnabled)',
  'label: "EULA", href: t("/eula", previewModeEnabled)',
];

test("site footer legal links point to local legal redirect endpoints", () => {
  const siteFooter = readFileSync(siteFooterPath, "utf8");

  for (const expected of expectedLinks) {
    assert.match(siteFooter, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(siteFooter, /label: "Cookie設定", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "利用規約", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "プライバシーポリシー", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "EULA", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "Cookie設定", href: "https:\/\/www\.querypie\.com\/ja\/cookie-preference"/);
});

test("resource lead form legal links also point to local legal redirect endpoints", () => {
  const resourceLeadForm = readFileSync(resourceLeadFormPath, "utf8");

  assert.match(resourceLeadForm, /href="\/terms-of-service"/);
  assert.match(resourceLeadForm, /href="\/privacy-policy"/);
  assert.doesNotMatch(resourceLeadForm, /href="https:\/\/www\.querypie\.com\/ja\/terms-of-service"/);
  assert.doesNotMatch(resourceLeadForm, /href="https:\/\/www\.querypie\.com\/ja\/privacy-policy"/);
  assert.doesNotMatch(resourceLeadForm, /<a href="#" className="underline underline-offset-4">\s*利用規約/);
  assert.doesNotMatch(resourceLeadForm, /<a href="#" className="underline underline-offset-4">\s*プライバシーポリシー/);
});
