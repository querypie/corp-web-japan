import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";
import { createTsModuleLoader, toPlainJson } from "../../../helpers/ts-module-loader.mjs";

test("/contact-us is the public form page and keeps production-ready form wiring", () => {
  const page = readSource("src/app/contact-us/page.tsx");
  const pageSection = readSource("src/components/sections/contact-us/page-section.tsx");
  const formComponent = readSource("src/components/sections/contact-us/form.tsx");
  const contactUsLib = readSource("src/lib/contact-us.ts");

  assert.equal(sourceExists("src/app/contact-us/page.tsx"), true);
  assert.equal(sourceExists("src/app/contact-us/route.ts"), false);

  assert.match(page, /title:\s*"お問い合わせ \| QueryPie AI"/);
  assert.match(page, /canonical:\s*"\/contact-us"/);
  assert.doesNotMatch(page, /robots:\s*\{/);
  assert.match(page, /getPrefilledContactUsFormState\(urlSearchParams\)/);
  assert.match(page, /<CompanyPageSection>/);
  assert.match(page, /<CompanyPageIntro>/);
  assert.match(page, /<CompanyPageTitle>お問い合わせ<\/CompanyPageTitle>/);
  assert.match(page, /<CompanyPageLead>/);
  assert.match(page, /<CompanyPageLayout preset="equalColumns">/);
  assert.match(page, /<ContactUsFormPanel>/);
  assert.match(page, /<ContactUsForm initialPrefills=\{initialPrefills\} \/>/);
  assert.match(page, /お問い合わせ/);
  assert.match(page, /1〜2営業日以内にご連絡いたします/);

  assert.match(pageSection, /lg:mt-\[10px\]/);

  assert.match(formComponent, /fetch\("\/contact-us\/submit"/);
  assert.doesNotMatch(formComponent, /fetch\("\/t\/contact-us\/submit"/);
  assert.doesNotMatch(formComponent, /1〜2営業日以内にご連絡いたします/);
  assert.match(formComponent, /aria-invalid/);
  assert.match(formComponent, /autoComplete=/);

  assert.match(contactUsLib, /isBusinessEmail/);
  assert.match(contactUsLib, /会社または教育機関のメールアドレスを入力してください。/);
  assert.match(contactUsLib, /"ai-consulting"/);
  assert.match(contactUsLib, /"download"/);
  assert.match(contactUsLib, /"demo-request"/);
  assert.match(contactUsLib, /"quote-request"/);
  assert.match(contactUsLib, /"technical-question"/);
  assert.match(contactUsLib, /"partnership"/);
  assert.match(contactUsLib, /"other"/);
  assert.match(contactUsLib, /"ai-crew"/);
  assert.match(contactUsLib, /"ai-dashi"/);
  assert.match(contactUsLib, /"aip"/);
  assert.match(contactUsLib, /"acp"/);
  assert.match(contactUsLib, /"fde"/);
});

test("contact-us product options prepend Lingo and NotePie before the existing products", () => {
  const { importModule } = createTsModuleLoader();
  const { productOptions } = importModule("src/lib/contact-us.ts");

  assert.deepEqual(toPlainJson(productOptions), [
    { key: "lingo", label: "会議記録・リアルタイム翻訳AI｜Lingo" },
    { key: "notepie", label: "ナレッジベース コンテンツ生成AI｜NotePie" },
    { key: "ai-crew", label: "社内業務効率化｜AI Crew" },
    { key: "ai-dashi", label: "自社サービスAI化｜AI Dashi" },
    { key: "aip", label: "AIプラットフォーム QueryPie AIP" },
    { key: "acp", label: "アクセス制御プラットフォーム QueryPie ACP" },
    { key: "fde", label: "AI専門家伴走 (FDE) サービス" },
    { key: "partnership", label: "パートナーシップ" },
  ]);
});
