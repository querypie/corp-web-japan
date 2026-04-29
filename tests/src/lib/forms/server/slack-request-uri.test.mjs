import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "../../../../helpers/ts-module-loader.mjs";

test("Slack helper includes request URI in the visible Slack message body", async () => {
  const { importModule } = createTsModuleLoader();
  const { postSlackNotification } = importModule("src/lib/forms/server/slack-notification.ts");

  const fetchCalls = [];
  const originalFetch = global.fetch;
  const previousTarget = process.env.VERCEL_TARGET_ENV;
  process.env.VERCEL_TARGET_ENV = "preview";
  global.fetch = async (url, options) => {
    fetchCalls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  try {
    await postSlackNotification({
      endpointName: "contact-us",
      requestPath: "/contact-us/submit",
      requestBody: {
        Email: "user@example.com",
        Referrer_URL__c: "https://stage.querypie.ai/contact-us?inquiry=demo-request",
      },
      token: "xoxb-test",
      channel: "C123",
      title: "Custom Title",
    });

    const body = JSON.parse(fetchCalls[0].options.body);
    assert.match(body.blocks[0].text.text, /Request URI/);
    assert.match(body.blocks[0].text.text, /https:\/\/stage\.querypie\.ai\/contact-us\?inquiry=demo-request/);
  } finally {
    global.fetch = originalFetch;
    process.env.VERCEL_TARGET_ENV = previousTarget;
  }
});
