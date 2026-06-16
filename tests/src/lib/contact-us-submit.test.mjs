import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createTsModuleLoader, toPlainJson } from "../../helpers/ts-module-loader.mjs";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");
const restoreEnv = (key, value) => {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
};

test("contact-us submit caller composes reusable shared form server modules", () => {
  const helper = readSource("src/lib/contact-us-submit.ts");
  const contactUsLib = readSource("src/lib/contact-us.ts");

  assert.match(helper, /hasValidMxRecord/);
  assert.match(helper, /sanitizeRecordStrings/);
  assert.match(helper, /toSalesforceUtmFields/);
  assert.match(helper, /postSlackNotification/);
  assert.doesNotMatch(helper, /deliverSalesforcePayload/);
  assert.match(helper, /buildContactUsSalesforceBody/);
  assert.match(helper, /endpointName:\s*"contact-us"/);
  assert.match(helper, /requestPath:\s*"\/contact-us\/submit"/);
  assert.match(contactUsLib, /processType:\s*"LEAD_MS"/);
});

test("contact-us submit sends only the Slack notification while Salesforce is paused", async () => {
  const dnsMock = {
    Resolver: class {
      async resolveMx() {
        return [{ exchange: "mail.querypie.com", priority: 10 }];
      }
    },
  };
  const { importModule } = createTsModuleLoader({ "node:dns/promises": dnsMock });
  const { submitContactUsForm } = importModule("src/lib/contact-us-submit.ts");

  const previousSlackToken = process.env.SLACK_BOT_OAUTH_TOKEN;
  const previousSlackChannel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;
  const previousSalesforceEndpoint = process.env.SALESFORCE_ENDPOINT;
  const originalFetch = global.fetch;
  const originalInfo = console.info;
  const fetchUrls = [];

  process.env.SLACK_BOT_OAUTH_TOKEN = "xoxb-test";
  process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES = "C123";
  process.env.SALESFORCE_ENDPOINT = "https://sf.example.com";
  console.info = () => {};
  global.fetch = async (url) => {
    fetchUrls.push(String(url));
    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  try {
    const result = await submitContactUsForm(
      {
        form: {
          lastName: "Yamada",
          firstName: "Taro",
          email: "taro@querypie.com",
          company: "QueryPie",
          title: "Manager",
          phone: "",
          inquiry: "demo-request",
          products: ["aip"],
          timeline: "3ヶ月以内",
          message: "Please contact me.",
          marketing: true,
        },
        referrerUrl: "https://querypie.ai/contact-us",
      },
      "",
    );

    assert.deepEqual(toPlainJson(result), { success: true, status: 200 });
    assert.deepEqual(fetchUrls, ["https://slack.com/api/chat.postMessage"]);
  } finally {
    restoreEnv("SLACK_BOT_OAUTH_TOKEN", previousSlackToken);
    restoreEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", previousSlackChannel);
    restoreEnv("SALESFORCE_ENDPOINT", previousSalesforceEndpoint);
    global.fetch = originalFetch;
    console.info = originalInfo;
  }
});
