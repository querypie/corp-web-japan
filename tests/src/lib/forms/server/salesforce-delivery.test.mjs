import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader, toPlainJson } from "../../../../helpers/ts-module-loader.mjs";

test("Salesforce delivery helper logs warn for skips, info for success, and error for failures with endpoint context", async () => {
  const { importModule } = createTsModuleLoader();
  const { deliverSalesforcePayload } = importModule("src/lib/forms/server/salesforce-delivery.ts");

  const originalFetch = global.fetch;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  const infoLogs = [];
  const warnLogs = [];
  const errorLogs = [];

  console.info = (...args) => infoLogs.push(args.map(String).join(" "));
  console.warn = (...args) => warnLogs.push(args.map(String).join(" "));
  console.error = (...args) => errorLogs.push(args.map(String).join(" "));

  try {
    assert.deepEqual(
      toPlainJson(
        await deliverSalesforcePayload({
          endpointName: "contact-us",
          requestPath: "/contact-us/submit",
          payload: { hello: "world" },
        }),
      ),
      { ok: false, reason: "missing_endpoint" },
    );
    assert.equal(warnLogs.length, 1);
    assert.match(warnLogs[0], /"service":"salesforce"/);
    assert.match(warnLogs[0], /"endpointName":"contact-us"/);
    assert.match(warnLogs[0], /"requestPath":"\/contact-us\/submit"/);
    assert.match(warnLogs[0], /"outcome":"skipped"/);
    assert.match(warnLogs[0], /"reason":"missing_endpoint"/);

    global.fetch = async () => ({ ok: true, json: async () => ({ recordUUID: "uuid-123" }) });
    assert.deepEqual(
      toPlainJson(
        await deliverSalesforcePayload({
          endpointName: "gating-form",
          requestPath: "/api/gating-form/unlock",
          endpoint: "https://sf.example.com",
          payload: { hello: "world" },
        }),
      ),
      { ok: true, recordUUID: "uuid-123" },
    );
    assert.equal(infoLogs.length, 1);
    assert.match(infoLogs[0], /"service":"salesforce"/);
    assert.match(infoLogs[0], /"endpointName":"gating-form"/);
    assert.match(infoLogs[0], /"requestPath":"\/api\/gating-form\/unlock"/);
    assert.match(infoLogs[0], /"outcome":"success"/);
    assert.match(infoLogs[0], /"recordUUID":"uuid-123"/);

    global.fetch = async () => ({ ok: true, json: async () => ({}) });
    assert.deepEqual(
      toPlainJson(
        await deliverSalesforcePayload({
          endpointName: "contact-us",
          requestPath: "/contact-us/submit",
          endpoint: "https://sf.example.com",
          payload: { hello: "world" },
        }),
      ),
      { ok: false, reason: "missing_recordUUID" },
    );
    assert.equal(errorLogs.length, 1);
    assert.match(errorLogs[0], /"service":"salesforce"/);
    assert.match(errorLogs[0], /"endpointName":"contact-us"/);
    assert.match(errorLogs[0], /"outcome":"failed"/);
    assert.match(errorLogs[0], /"reason":"missing_recordUUID"/);
  } finally {
    global.fetch = originalFetch;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }
});
