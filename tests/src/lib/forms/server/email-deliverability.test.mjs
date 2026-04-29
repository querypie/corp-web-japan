import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "../../../../helpers/ts-module-loader.mjs";

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
