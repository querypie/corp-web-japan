import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/contact-us/submit route exists at the production-ready path and uses reusable shared form server modules", () => {
  const newRoutePath = path.join(repoRoot, "src/app/contact-us/submit/route.ts");
  const oldRoutePath = path.join(repoRoot, "src/app/t/contact-us/submit/route.ts");
  const helperPath = path.join(repoRoot, "src/lib/contact-us-submit.ts");
  const sanitizePath = path.join(repoRoot, "src/lib/forms/server/sanitize.ts");
  const emailPath = path.join(repoRoot, "src/lib/forms/server/email-deliverability.ts");
  const utmPath = path.join(repoRoot, "src/lib/forms/server/utm-attribution.ts");
  const slackPath = path.join(repoRoot, "src/lib/forms/server/slack-notification.ts");
  const salesforcePath = path.join(repoRoot, "src/lib/forms/server/salesforce-delivery.ts");

  assert.equal(existsSync(newRoutePath), true, "expected src/app/contact-us/submit/route.ts to exist");
  assert.equal(existsSync(oldRoutePath), false, "expected src/app/t/contact-us/submit/route.ts to be removed");
  assert.equal(existsSync(helperPath), true, "expected src/lib/contact-us-submit.ts to exist");
  assert.equal(existsSync(sanitizePath), true, "expected shared sanitize helper to exist");
  assert.equal(existsSync(emailPath), true, "expected shared email deliverability helper to exist");
  assert.equal(existsSync(utmPath), true, "expected shared UTM helper to exist");
  assert.equal(existsSync(slackPath), true, "expected shared Slack helper to exist");
  assert.equal(existsSync(salesforcePath), true, "expected shared Salesforce helper to exist");

  const submitRoute = readSource("src/app/contact-us/submit/route.ts");
  const helper = readSource("src/lib/contact-us-submit.ts");
  const sanitize = readSource("src/lib/forms/server/sanitize.ts");
  const email = readSource("src/lib/forms/server/email-deliverability.ts");
  const utm = readSource("src/lib/forms/server/utm-attribution.ts");
  const slack = readSource("src/lib/forms/server/slack-notification.ts");
  const salesforce = readSource("src/lib/forms/server/salesforce-delivery.ts");

  assert.match(submitRoute, /submitContactUsForm/);
  assert.match(helper, /hasValidMxRecord/);
  assert.match(helper, /sanitizeRecordStrings/);
  assert.match(helper, /toSalesforceUtmFields/);
  assert.match(helper, /postSlackNotification/);
  assert.match(helper, /deliverSalesforcePayload/);
  assert.match(helper, /buildContactUsSalesforceBody/);
  assert.match(readSource("src/lib/contact-us.ts"), /processType:\s*"LEAD_MS"/);
  assert.match(sanitize, /sanitizeText/);
  assert.match(email, /resolveMx/);
  assert.match(utm, /pi__utm_source__c/);
  assert.match(slack, /getSlackEnvironmentTag/);
  assert.match(slack, /isProduction\(\)/);
  assert.match(salesforce, /skipped \(env not set\)/);
});
