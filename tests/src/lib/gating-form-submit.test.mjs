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

test("gating submit caller reuses the shared form server modules and LEAD_MS request shape", () => {
  const helper = readSource("src/lib/gating-form-submit.ts");
  const gatingLib = readSource("src/lib/gating-form.ts");

  assert.match(helper, /hasValidMxRecord/);
  assert.match(helper, /sanitizeRecordStrings/);
  assert.match(helper, /toSalesforceUtmFields/);
  assert.match(helper, /postSlackNotification/);
  assert.doesNotMatch(helper, /deliverSalesforcePayload/);
  assert.match(helper, /buildGatingSalesforceBody/);
  assert.match(helper, /endpointName:\s*"gating-form"/);
  assert.match(helper, /requestPath:\s*"\/api\/gating-form\/unlock"/);
  assert.match(gatingLib, /buildContactUsSalesforceBody/);
  assert.match(gatingLib, /message:\s*""/);
  assert.match(gatingLib, /GatedContentKey:/);
});

test("gating submit sends only the Slack notification while Salesforce is paused", async () => {
  const dnsMock = {
    Resolver: class {
      async resolveMx() {
        return [{ exchange: "mail.querypie.com", priority: 10 }];
      }
    },
  };
  const { importModule } = createTsModuleLoader({ "node:dns/promises": dnsMock });
  const { submitGatingForm } = importModule("src/lib/gating-form-submit.ts");

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
    const result = await submitGatingForm(
      {
        contentKey: "whitepapers/example",
        form: {
          lastName: "Yamada",
          firstName: "Taro",
          email: "taro@querypie.com",
          company: "QueryPie",
          title: "Manager",
          phone: "",
          inquiry: "download",
          products: ["aip"],
          timeline: "3ヶ月以内",
          marketing: true,
        },
        referrerUrl: "https://querypie.ai/whitepapers/1/example",
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
