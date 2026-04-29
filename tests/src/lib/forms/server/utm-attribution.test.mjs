import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader, toPlainJson } from "../../../../helpers/ts-module-loader.mjs";

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
