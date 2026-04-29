import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader, toPlainJson } from "../../../../helpers/ts-module-loader.mjs";

test("Salesforce delivery helper handles missing endpoint, success, and missing record UUID", async () => {
  const { importModule } = createTsModuleLoader();
  const { deliverSalesforcePayload } = importModule("src/lib/forms/server/salesforce-delivery.ts");

  assert.deepEqual(
    toPlainJson(await deliverSalesforcePayload({ payload: { hello: "world" }, logPrefix: "[test] salesforce" })),
    { ok: false, reason: "missing_endpoint" },
  );

  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: true, json: async () => ({ recordUUID: "uuid-123" }) });
  try {
    assert.deepEqual(
      toPlainJson(await deliverSalesforcePayload({ endpoint: "https://sf.example.com", payload: { hello: "world" } })),
      { ok: true, recordUUID: "uuid-123" },
    );
  } finally {
    global.fetch = originalFetch;
  }

  global.fetch = async () => ({ ok: true, json: async () => ({}) });
  try {
    assert.deepEqual(
      toPlainJson(await deliverSalesforcePayload({ endpoint: "https://sf.example.com", payload: { hello: "world" } })),
      { ok: false, reason: "missing_recordUUID" },
    );
  } finally {
    global.fetch = originalFetch;
  }
});
