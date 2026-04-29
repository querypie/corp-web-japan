import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import ts from "typescript";

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, "src");

function createTsModuleLoader(mocks = {}) {
  const cache = new Map();

  function resolveModulePath(request, parentPath) {
    if (request.startsWith("@/")) {
      return path.join(srcRoot, `${request.slice(2)}.ts`);
    }

    if (request.startsWith("./") || request.startsWith("../")) {
      const candidate = path.resolve(path.dirname(parentPath), request);
      if (candidate.endsWith(".ts") || candidate.endsWith(".js")) {
        return candidate;
      }
      return `${candidate}.ts`;
    }

    return null;
  }

  function loadModule(modulePath) {
    const normalized = path.resolve(modulePath);
    if (cache.has(normalized)) {
      return cache.get(normalized).exports;
    }

    const source = readFileSync(normalized, "utf8");
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
      fileName: normalized,
    }).outputText;

    const cjsModule = { exports: {} };
    cache.set(normalized, cjsModule);

    const localRequire = (request) => {
      if (request in mocks) {
        return mocks[request];
      }

      const resolved = resolveModulePath(request, normalized);
      if (resolved) {
        return loadModule(resolved);
      }

      throw new Error(`Unsupported import in test loader: ${request}`);
    };

    const context = {
      module: cjsModule,
      exports: cjsModule.exports,
      require: localRequire,
      process,
      console,
      fetch: (...args) => global.fetch(...args),
      URL,
      JSON,
      Buffer,
      setTimeout,
      clearTimeout,
    };

    vm.runInNewContext(transpiled, context, { filename: normalized });
    return cjsModule.exports;
  }

  return {
    importModule(relativePath) {
      return loadModule(path.join(repoRoot, relativePath));
    },
  };
}

function toPlainJson(value) {
  return JSON.parse(JSON.stringify(value));
}

test("sanitize helpers normalize strings and leave non-string values untouched", () => {
  const { importModule } = createTsModuleLoader();
  const { sanitizeText, sanitizeRecordStrings } = importModule("src/lib/forms/server/sanitize.ts");

  assert.equal(sanitizeText("  <b>Hello</b>\u0007   world  "), "Hello world");
  assert.equal(sanitizeText(undefined), "");

  const sanitized = sanitizeRecordStrings({
    a: " <script>alert(1)</script> test ",
    b: 42,
    c: true,
  });

  assert.deepEqual(toPlainJson(sanitized), {
    a: "alert(1) test",
    b: 42,
    c: true,
  });
});

test("UTM helper maps valid attribution into Salesforce fields and ignores invalid payloads", () => {
  const { importModule } = createTsModuleLoader();
  const { toSalesforceUtmFields } = importModule("src/lib/forms/server/utm-attribution.ts");

  const encoded = encodeURIComponent(JSON.stringify({
    first: { landing: "/ja/contact", ts: "2026-01-01T00:00:00Z" },
    recent: [{ source: "linkedin", medium: "paid", campaign: "spring", term: "ai", content: "banner", landing: "/ja/contact", ts: "2026-02-01T00:00:00Z" }],
  }));

  assert.deepEqual(toPlainJson(toSalesforceUtmFields(encoded)), {
    pi__utm_source__c: "linkedin",
    pi__utm_medium__c: "paid",
    pi__utm_campaign__c: "spring",
    pi__utm_term__c: "ai",
    pi__utm_content__c: "banner",
    pi__first_touch_url__c: "/ja/contact",
  });

  assert.deepEqual(toPlainJson(toSalesforceUtmFields("%broken")), {});
  assert.deepEqual(toPlainJson(toSalesforceUtmFields(undefined)), {});
});

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

test("email deliverability helper returns true only when MX records exist", async () => {
  const dnsMock = {
    Resolver: class {
      async resolveMx(domain) {
        if (domain === "example.com") {
          return [{ exchange: "mx.example.com", priority: 10 }];
        }
        throw new Error("ENODATA");
      }
    },
  };

  const { importModule } = createTsModuleLoader({ "node:dns/promises": dnsMock });
  const { hasValidMxRecord } = importModule("src/lib/forms/server/email-deliverability.ts");

  assert.equal(await hasValidMxRecord("user@example.com"), true);
  assert.equal(await hasValidMxRecord("user@invalid.test"), false);
  assert.equal(await hasValidMxRecord("not-an-email"), false);
});
