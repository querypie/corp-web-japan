import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

const pagePath = "src/app/t/terms-of-service/page.tsx";
const contentPath = new URL("../src/app/t/terms-of-service/content.mdx", import.meta.url);
const footerPath = new URL("../src/components/layout/site-footer.tsx", import.meta.url);

test("terms of service preview page derives metadata and hero copy from content.mdx frontmatter", () => {
  assert.equal(existsSync(new URL(`../${pagePath}`, import.meta.url)), true, `${pagePath} should exist`);

  const source = readSource(pagePath);

  assert.match(source, /export async function generateMetadata\(\): Promise<Metadata>/);
  assert.match(source, /title: `\$\{frontmatter\.title\} \| QueryPie AI`,/);
  assert.match(source, /description: frontmatter\.description,/);
  assert.match(source, /canonical: "\/t\/terms-of-service"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /parseFrontmatter: true,/);
  assert.match(source, /const \{ frontmatter \} = evaluation;/);
  assert.match(source, /\{frontmatter\.date\}/);
  assert.match(source, /\{frontmatter\.title\}/);
  assert.match(source, /\{frontmatter\.description\}/);
  assert.match(source, /<BrandGradientCtaButton href="https:\/\/app\.querypie\.com\/">無料で試してみる<\/BrandGradientCtaButton>/);
  assert.doesNotMatch(source, /export const metadata: Metadata = \{/);
  assert.doesNotMatch(source, /function CenterSection/);
  assert.doesNotMatch(source, /corp-web-contents \/ corp-web-app/);
});

test("terms of service preview keeps title, description, and date in content.mdx frontmatter with legal body below", () => {
  const footerSource = readFileSync(footerPath, "utf8");
  const contentSource = readFileSync(contentPath, "utf8");

  assert.equal(existsSync(contentPath), true, "terms of service MDX content file should exist");
  assert.match(contentSource, /^---\ntitle: "QueryPie Terms of Service"\ndescription: "Terms of service for QueryPie AIP/m);
  assert.match(contentSource, /\ndate: "2025-06-05"\n/);
  assert.match(contentSource, /Article 1 \(Purpose\)/);
  assert.match(contentSource, /Article 17 \(Governing Law and Jurisdiction\)/);
  assert.doesNotMatch(contentSource, /StaticH1/);
  assert.doesNotMatch(contentSource, /<Box direction="column"/);
  assert.doesNotMatch(contentSource, /<CenterSection/);
  assert.doesNotMatch(contentSource, /まずは小さく、失敗しないAXを始めよう/);
  assert.match(footerSource, /label: "利用規約", href: t\("\/terms-of-service", previewModeEnabled\)/);
});
