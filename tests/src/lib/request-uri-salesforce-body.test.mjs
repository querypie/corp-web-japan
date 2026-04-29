import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "../../helpers/ts-module-loader.mjs";

test("contact-us Salesforce body keeps the referrer field and shows the request URI explicitly in the description", () => {
  const { importModule } = createTsModuleLoader();
  const { buildContactUsSalesforceBody } = importModule("src/lib/contact-us.ts");

  const result = buildContactUsSalesforceBody(
    {
      lastName: "Yamada",
      firstName: "Taro",
      email: "taro@example.co.jp",
      company: "QueryPie",
      title: "Manager",
      phone: "010-1234-5678",
      inquiry: "demo-request",
      products: ["aip"],
      timeline: "3ヶ月以内",
      message: "Need a demo",
      marketing: true,
    },
    "https://stage.querypie.ai/contact-us?inquiry=demo-request&product=aip",
  );

  assert.equal(
    result.requestBody.Referrer_URL__c,
    "https://stage.querypie.ai/contact-us?inquiry=demo-request&product=aip",
  );
  assert.match(result.requestBody.Description, /RequestURI: https:\/\/stage\.querypie\.ai\/contact-us\?inquiry=demo-request&product=aip/);
});

test("gating Salesforce body keeps the referrer field and shows the request URI explicitly in the description", () => {
  const { importModule } = createTsModuleLoader();
  const { buildGatingSalesforceBody } = importModule("src/lib/gating-form.ts");

  const result = buildGatingSalesforceBody(
    {
      lastName: "Yamada",
      firstName: "Taro",
      email: "taro@example.co.jp",
      company: "QueryPie",
      title: "Manager",
      phone: "010-1234-5678",
      inquiry: "download",
      products: ["aip"],
      timeline: "3ヶ月以内",
      marketing: true,
    },
    "https://stage.querypie.ai/whitepapers/24/slug",
    "whitepaper-24",
  );

  assert.equal(result.requestBody.Referrer_URL__c, "https://stage.querypie.ai/whitepapers/24/slug");
  assert.match(result.requestBody.Description, /RequestURI: https:\/\/stage\.querypie\.ai\/whitepapers\/24\/slug/);
});
