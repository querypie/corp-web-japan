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

const validGatingPayload = {
  contentKey: "whitepapers/example",
  form: {
    lastName: "Yamada",
    firstName: "Taro",
    email: "taro@querypie.com",
    company: "QueryPie",
    title: "Manager",
    phone: "090-1234-5678",
    inquiry: "download",
    products: ["aip"],
    timeline: "3ヶ月以内",
    marketing: true,
  },
  referrerUrl: "https://querypie.ai/whitepapers/1/example",
};

function importSubmitGatingForm() {
  const dnsMock = {
    Resolver: class {
      async resolveMx() {
        return [{ exchange: "mail.querypie.com", priority: 10 }];
      }
    },
  };
  const { importModule } = createTsModuleLoader({
    "node:dns/promises": dnsMock,
    "next/server": { after: (callback) => void callback() },
  });
  return importModule("src/lib/gating-form-submit.ts").submitGatingForm;
}

test("gating submit caller reuses the shared form server modules and LEAD_MS request shape", () => {
  const helper = readSource("src/lib/gating-form-submit.ts");
  const gatingLib = readSource("src/lib/gating-form.ts");

  assert.match(helper, /hasValidMxRecord/);
  assert.match(helper, /sanitizeRecordStrings/);
  assert.match(helper, /toSalesforceUtmFields/);
  assert.match(helper, /postSlackNotification/);
  assert.match(helper, /deliverDeskPieLeadPayload/);
  assert.doesNotMatch(helper, /deliverSalesforcePayload/);
  assert.match(helper, /buildGatingSalesforceBody/);
  assert.match(helper, /endpointName:\s*"gating-form"/);
  assert.match(helper, /requestPath:\s*"\/api\/gating-form\/unlock"/);
  assert.match(gatingLib, /buildContactUsSalesforceBody/);
  assert.match(gatingLib, /message:\s*""/);
  assert.match(gatingLib, /GatedContentKey:/);
});

test("gating submit sends Slack and optional DeskPie lead while Salesforce is paused", async () => {
  const submitGatingForm = importSubmitGatingForm();

  const previousSlackToken = process.env.SLACK_BOT_OAUTH_TOKEN;
  const previousSlackChannel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;
  const previousSalesforceEndpoint = process.env.SALESFORCE_ENDPOINT;
  const previousDeskPieEndpoint = process.env.DESKPIE_LEAD_API_ENDPOINT;
  const previousDeskPieApiKey = process.env.DESKPIE_LEAD_API_KEY;
  const originalFetch = global.fetch;
  const originalInfo = console.info;
  const fetchUrls = [];
  const fetchBodies = [];

  process.env.SLACK_BOT_OAUTH_TOKEN = "xoxb-test";
  process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES = "C123";
  process.env.SALESFORCE_ENDPOINT = "https://sf.example.com";
  process.env.DESKPIE_LEAD_API_ENDPOINT = "https://deskpie.example.com/api/v1/public/leads";
  process.env.DESKPIE_LEAD_API_KEY = "deskpie-key";
  console.info = () => {};
  global.fetch = async (url, init) => {
    fetchUrls.push(String(url));
    fetchBodies.push(init?.body);
    return {
      ok: true,
      json: async () => ({ leadId: "lead-456" }),
    };
  };

  try {
    const result = await submitGatingForm(validGatingPayload, "");

    assert.deepEqual(toPlainJson(result), { success: true, status: 200 });
    assert.deepEqual(fetchUrls, [
      "https://deskpie.example.com/api/v1/public/leads",
      "https://slack.com/api/chat.postMessage",
    ]);
    const deskPieRequest = JSON.parse(fetchBodies[0]);
    assert.equal(deskPieRequest.processType, "LEAD_MS");
    assert.equal(deskPieRequest.requestBody.Product, "AIプラットフォーム QueryPie AIP");
    assert.equal(deskPieRequest.requestBody.PlannedImplementationDate, "3ヶ月以内");
    assert.match(deskPieRequest.requestBody.Description, /GatedContentKey: whitepapers\/example/);
  } finally {
    restoreEnv("SLACK_BOT_OAUTH_TOKEN", previousSlackToken);
    restoreEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", previousSlackChannel);
    restoreEnv("SALESFORCE_ENDPOINT", previousSalesforceEndpoint);
    restoreEnv("DESKPIE_LEAD_API_ENDPOINT", previousDeskPieEndpoint);
    restoreEnv("DESKPIE_LEAD_API_KEY", previousDeskPieApiKey);
    global.fetch = originalFetch;
    console.info = originalInfo;
  }
});

test("gating submit still succeeds and sends DeskPie lead when Slack credentials are missing", async () => {
  const submitGatingForm = importSubmitGatingForm();

  const previousSlackToken = process.env.SLACK_BOT_OAUTH_TOKEN;
  const previousSlackChannel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;
  const previousDeskPieEndpoint = process.env.DESKPIE_LEAD_API_ENDPOINT;
  const previousDeskPieApiKey = process.env.DESKPIE_LEAD_API_KEY;
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const fetchUrls = [];

  delete process.env.SLACK_BOT_OAUTH_TOKEN;
  delete process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;
  process.env.DESKPIE_LEAD_API_ENDPOINT = "https://deskpie.example.com/api/v1/public/leads";
  process.env.DESKPIE_LEAD_API_KEY = "deskpie-key";
  console.warn = () => {};
  console.info = () => {};
  global.fetch = async (url) => {
    fetchUrls.push(String(url));
    return {
      ok: true,
      json: async () => ({ leadId: "lead-456" }),
    };
  };

  try {
    const result = await submitGatingForm(validGatingPayload, "");

    assert.deepEqual(toPlainJson(result), { success: true, status: 200 });
    assert.deepEqual(fetchUrls, ["https://deskpie.example.com/api/v1/public/leads"]);
  } finally {
    restoreEnv("SLACK_BOT_OAUTH_TOKEN", previousSlackToken);
    restoreEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", previousSlackChannel);
    restoreEnv("DESKPIE_LEAD_API_ENDPOINT", previousDeskPieEndpoint);
    restoreEnv("DESKPIE_LEAD_API_KEY", previousDeskPieApiKey);
    global.fetch = originalFetch;
    console.warn = originalWarn;
    console.info = originalInfo;
  }
});
