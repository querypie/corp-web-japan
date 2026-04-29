import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("gating submit caller reuses the shared form server modules and LEAD_MS request shape", () => {
  const helper = readSource("src/lib/gating-form-submit.ts");
  const gatingLib = readSource("src/lib/gating-form.ts");

  assert.match(helper, /hasValidMxRecord/);
  assert.match(helper, /sanitizeRecordStrings/);
  assert.match(helper, /toSalesforceUtmFields/);
  assert.match(helper, /postSlackNotification/);
  assert.match(helper, /deliverSalesforcePayload/);
  assert.match(helper, /buildGatingSalesforceBody/);
  assert.match(gatingLib, /buildContactUsSalesforceBody/);
  assert.match(gatingLib, /message:\s*""/);
  assert.match(gatingLib, /GatedContentKey:/);
});
