import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("contact-us submit caller composes reusable shared form server modules", () => {
  const helper = readSource("src/lib/contact-us-submit.ts");
  const contactUsLib = readSource("src/lib/contact-us.ts");

  assert.match(helper, /hasValidMxRecord/);
  assert.match(helper, /sanitizeRecordStrings/);
  assert.match(helper, /toSalesforceUtmFields/);
  assert.match(helper, /postSlackNotification/);
  assert.match(helper, /deliverSalesforcePayload/);
  assert.match(helper, /buildContactUsSalesforceBody/);
  assert.match(contactUsLib, /processType:\s*"LEAD_MS"/);
});
