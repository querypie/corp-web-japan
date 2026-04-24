import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const siteFooterPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);
const resourceLeadFormPath = new URL("../src/components/sections/resource-lead-form.tsx", import.meta.url);

const expectedLinks = [
  { label: "Cookie設定", href: "/cookie-preference" },
  { label: "利用規約", href: "/terms-of-service" },
  { label: "プライバシーポリシー", href: "/privacy-policy" },
  { label: "EULA", href: "/eula" },
];

test("site footer legal links point to local legal redirect endpoints", () => {
  const siteFooter = readFileSync(siteFooterPath, "utf8");

  for (const { label, href } of expectedLinks) {
    assert.match(siteFooter, new RegExp(`label: "${label}", href: "${href}"`));
  }

  assert.doesNotMatch(siteFooter, /label: "Cookie設定", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "利用規約", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "プライバシーポリシー", href: "#"/);
  assert.doesNotMatch(siteFooter, /label: "EULA", href: "#"/);
});

test("resource lead form still links directly to the same QueryPie Japan legal documents", () => {
  const resourceLeadForm = readFileSync(resourceLeadFormPath, "utf8");

  assert.match(resourceLeadForm, /href="https:\/\/www\.querypie\.com\/ja\/terms-of-service"/);
  assert.match(resourceLeadForm, /href="https:\/\/www\.querypie\.com\/ja\/privacy-policy"/);
  assert.doesNotMatch(resourceLeadForm, /<a href="#" className="underline underline-offset-4">\s*利用規約/);
  assert.doesNotMatch(resourceLeadForm, /<a href="#" className="underline underline-offset-4">\s*プライバシーポリシー/);
});
