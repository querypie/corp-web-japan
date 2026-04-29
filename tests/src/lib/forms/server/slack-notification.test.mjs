import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "../../../../helpers/ts-module-loader.mjs";

test("Slack helper applies non-production tag and posts expected payload", async () => {
  const fetchCalls = [];
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    fetchCalls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  const previousTarget = process.env.VERCEL_TARGET_ENV;
  process.env.VERCEL_TARGET_ENV = "preview";

  try {
    const { importModule } = createTsModuleLoader();
    const { getSlackEnvironmentTag, postSlackNotification } = importModule("src/lib/forms/server/slack-notification.ts");

    assert.equal(getSlackEnvironmentTag(), "[TEST] ");

    await postSlackNotification({
      requestBody: { Email: "user@example.com", HasOptedInMarketing__c: false, Referrer_URL__c: "https://example.com" },
      token: "xoxb-test",
      channel: "C123",
      title: "Custom Title",
    });

    assert.equal(fetchCalls.length, 1);
    assert.equal(fetchCalls[0].url, "https://slack.com/api/chat.postMessage");
    const body = JSON.parse(fetchCalls[0].options.body);
    assert.equal(body.channel, "C123");
    assert.match(body.text, /^\[TEST\] Custom Title$/);
    assert.match(body.blocks[0].text.text, /\[TEST\] \*Custom Title\*/);
    assert.doesNotMatch(body.blocks[0].text.text, /HasOptedInMarketing__c/);
    assert.doesNotMatch(body.blocks[0].text.text, /Referrer_URL__c/);
  } finally {
    global.fetch = originalFetch;
    process.env.VERCEL_TARGET_ENV = previousTarget;
  }
});
