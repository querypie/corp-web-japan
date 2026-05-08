import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/terms-of-service/page.tsx";
const helperPath = new URL("../src/lib/legal-preview/terms-of-service.tsx", import.meta.url);
const contentPath = new URL("../src/content/legal-preview/terms-of-service.mdx", import.meta.url);
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("terms of service preview page keeps noindex metadata and route-local legal copy in page.tsx", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/terms-of-service"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /QueryPie Terms of Service/);
  assert.match(source, /Article 1 \(Purpose\)/);
  assert.match(source, /Article 17 \(Governing Law and Jurisdiction\)/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(source, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.doesNotMatch(source, /corp-web-contents \/ corp-web-app/);
  assert.doesNotMatch(source, /法務・ポリシー関連のご質問/);
});

test("terms of service preview removes the old helper/content layers and keeps preview-aware footer routing", () => {
  const footerSource = readFileSync(footerPath, "utf8");

  assert.equal(existsSync(helperPath), false, "legacy terms preview helper should be removed");
  assert.equal(existsSync(contentPath), false, "legacy terms preview content file should be removed");
  assert.match(footerSource, /label: "利用規約", href: t\("\/terms-of-service", previewModeEnabled\)/);
});
