import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "../../../../helpers/ts-module-loader.mjs";

test("Slack helper logs warn for skips, info for success, and error for failures with endpoint context", async () => {
  const { importModule } = createTsModuleLoader();
  const { postSlackNotification, getSlackEnvironmentTag } = importModule("src/lib/forms/server/slack-notification.ts");

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

  const previousTarget = process.env.VERCEL_TARGET_ENV;
  process.env.VERCEL_TARGET_ENV = "preview";

  try {
    assert.equal(getSlackEnvironmentTag(), "[TEST] ");

    const skipped = await postSlackNotification({
      endpointName: "contact-us",
      requestPath: "/contact-us/submit",
      requestBody: { Email: "user@example.com" },
      title: "Custom Title",
    });
    assert.deepEqual(JSON.parse(JSON.stringify(skipped)), { ok: false, reason: "missing_credentials" });
    assert.equal(warnLogs.length, 1);
    assert.match(warnLogs[0], /"service":"slack"/);
    assert.match(warnLogs[0], /"endpointName":"contact-us"/);
    assert.match(warnLogs[0], /"requestPath":"\/contact-us\/submit"/);
    assert.match(warnLogs[0], /"outcome":"skipped"/);
    assert.match(warnLogs[0], /"reason":"missing_credentials"/);

    const fetchCalls = [];
    global.fetch = async (url, options) => {
      fetchCalls.push({ url, options });
      return {
        ok: true,
        json: async () => ({ ok: true }),
      };
    };

    const success = await postSlackNotification({
      endpointName: "gating-form",
      requestPath: "/api/gating-form/unlock",
      requestBody: { Email: "user@example.com", HasOptedInMarketing__c: false, Referrer_URL__c: "https://example.com" },
      token: "xoxb-test",
      channel: "C123",
      title: "Custom Title",
    });

    assert.deepEqual(JSON.parse(JSON.stringify(success)), { ok: true });
    assert.equal(fetchCalls.length, 1);
    assert.equal(fetchCalls[0].url, "https://slack.com/api/chat.postMessage");
    const body = JSON.parse(fetchCalls[0].options.body);
    assert.equal(body.channel, "C123");
    assert.match(body.text, /^\[TEST\] Custom Title$/);
    assert.match(body.blocks[0].text.text, /\[TEST\] \*Custom Title\*/);
    assert.doesNotMatch(body.blocks[0].text.text, /HasOptedInMarketing__c/);
    assert.match(body.blocks[0].text.text, /\*Request URI\*: https:\/\/example\.com/);
    assert.equal(infoLogs.length, 1);
    assert.match(infoLogs[0], /"service":"slack"/);
    assert.match(infoLogs[0], /"endpointName":"gating-form"/);
    assert.match(infoLogs[0], /"requestPath":"\/api\/gating-form\/unlock"/);
    assert.match(infoLogs[0], /"outcome":"success"/);

    global.fetch = async () => ({ ok: false, status: 500, json: async () => ({ ok: false, error: "internal_error" }) });
    const failed = await postSlackNotification({
      endpointName: "contact-us",
      requestPath: "/contact-us/submit",
      requestBody: { Email: "user@example.com" },
      token: "xoxb-test",
      channel: "C123",
      title: "Custom Title",
    });
    assert.deepEqual(JSON.parse(JSON.stringify(failed)), { ok: false, reason: "api_internal_error" });
    assert.equal(errorLogs.length, 1);
    assert.match(errorLogs[0], /"service":"slack"/);
    assert.match(errorLogs[0], /"endpointName":"contact-us"/);
    assert.match(errorLogs[0], /"outcome":"failed"/);
    assert.match(errorLogs[0], /"reason":"api_internal_error"/);
  } finally {
    global.fetch = originalFetch;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
    process.env.VERCEL_TARGET_ENV = previousTarget;
  }
});
