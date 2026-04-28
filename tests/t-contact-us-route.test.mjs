import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/t/contact-us page stays isolated and non-indexed", () => {
  const page = readSource("src/app/t/contact-us/page.tsx");

  assert.match(page, /title:\s*"お問い合わせ \| QueryPie AI"/);
  assert.match(page, /robots:\s*\{[\s\S]*index:\s*false,[\s\S]*follow:\s*false,[\s\S]*\}/);
  assert.match(page, /canonical:\s*"\/t\/contact-us"/);
  assert.match(page, /<ContactUsForm[^>]*\/>/);
});

test("contact-us form uses production-ready copy and validation with stable query prefills", () => {
  const formComponent = readSource("src/components/sections/contact-us-form.tsx");
  const contactUsLib = readSource("src/lib/contact-us.ts");
  const page = readSource("src/app/t/contact-us/page.tsx");

  assert.match(page, /getPrefilledContactUsFormState\(urlSearchParams\)/);
  assert.match(formComponent, /fetch\("\/t\/contact-us\/submit"/);
  assert.match(formComponent, /お問い合わせ/);
  assert.match(formComponent, /1〜2営業日以内にご連絡いたします/);
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

test("/t/contact-us submit route degrades safely when the upstream endpoint is not configured", () => {
  const submitRoute = readSource("src/app/t/contact-us/submit/route.ts");

  assert.match(submitRoute, /process\.env\.SALESFORCE_ENDPOINT/);
  assert.match(submitRoute, /現在この環境ではお問い合わせ送信が有効化されていません/);
  assert.match(submitRoute, /buildContactUsSalesforceBody/);
  assert.match(submitRoute, /recordUUID/);
});
