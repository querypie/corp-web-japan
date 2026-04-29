import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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

test("contact-us form keeps preview page routing but submits through the production-ready endpoint", () => {
  const formComponent = readSource("src/components/sections/contact-us-form.tsx");
  const contactUsLib = readSource("src/lib/contact-us.ts");
  const page = readSource("src/app/t/contact-us/page.tsx");

  assert.match(page, /getPrefilledContactUsFormState\(urlSearchParams\)/);
  assert.match(formComponent, /fetch\("\/contact-us\/submit"/);
  assert.doesNotMatch(formComponent, /fetch\("\/t\/contact-us\/submit"/);
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

test("contact-us submit route lives at /contact-us/submit and includes production-ready integration hooks", () => {
  const newRoutePath = path.join(repoRoot, "src/app/contact-us/submit/route.ts");
  const oldRoutePath = path.join(repoRoot, "src/app/t/contact-us/submit/route.ts");
  const helperPath = path.join(repoRoot, "src/lib/contact-us-submit.ts");

  assert.equal(existsSync(newRoutePath), true, "expected src/app/contact-us/submit/route.ts to exist");
  assert.equal(existsSync(oldRoutePath), false, "expected src/app/t/contact-us/submit/route.ts to be removed");
  assert.equal(existsSync(helperPath), true, "expected src/lib/contact-us-submit.ts to exist");

  const submitRoute = readSource("src/app/contact-us/submit/route.ts");
  const helper = readSource("src/lib/contact-us-submit.ts");

  assert.match(submitRoute, /submitContactUsForm/);
  assert.match(helper, /SLACK_BOT_OAUTH_TOKEN/);
  assert.match(helper, /SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES/);
  assert.match(helper, /resolveMx/);
  assert.match(helper, /sanitizeText/);
  assert.match(helper, /SALESFORCE_ENDPOINT/);
  assert.match(helper, /toSalesforceFields/);
  assert.match(helper, /buildContactUsSalesforceBody/);
  assert.match(readSource("src/lib/contact-us.ts"), /processType:\s*"LEAD_MS"/);
  assert.match(helper, /salesforce: skipped/);
  assert.match(helper, /postToSlack/);
});
