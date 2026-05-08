import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/terms-of-service/page.tsx";
const contentPath = new URL("../src/app/t/terms-of-service/content.mdx", import.meta.url);
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("terms of service preview page keeps noindex metadata and renders MDX content from src/app/t/terms-of-service/content.mdx", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export const metadata: Metadata = \{/);
  assert.match(source, /canonical: "\/t\/terms-of-service"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /src\/app\/t\/terms-of-service\/content\.mdx/);
  assert.match(source, /const source = await readFile\(sourcePath, "utf8"\);/);
  assert.doesNotMatch(source, /Article 1 \(Purpose\)/);
  assert.match(source, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(source, /<BrandGradientCtaButton href="https:\/\/app\.querypie\.com\/">無料で試してみる<\/BrandGradientCtaButton>/);
  assert.match(source, /簡単サインアップで、14日間の無料トライアルをお試しください/);
  assert.doesNotMatch(source, /corp-web-contents \/ corp-web-app/);
  assert.doesNotMatch(source, /法務・ポリシー関連のご質問/);
});

test("terms of service preview keeps legal body in src/app/t/terms-of-service/content.mdx and preview-aware footer routing", () => {
  const footerSource = readFileSync(footerPath, "utf8");
  const contentSource = readFileSync(contentPath, "utf8");

  assert.equal(existsSync(contentPath), true, "terms of service MDX content file should exist");
  assert.match(contentSource, /QueryPie Terms of Service/);
  assert.match(contentSource, /Article 1 \(Purpose\)/);
  assert.match(contentSource, /Article 17 \(Governing Law and Jurisdiction\)/);
  assert.doesNotMatch(contentSource, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(footerSource, /label: "利用規約", href: t\("\/terms-of-service", previewModeEnabled\)/);
});
