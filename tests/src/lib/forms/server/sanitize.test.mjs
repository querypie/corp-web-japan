import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader, toPlainJson } from "../../../../helpers/ts-module-loader.mjs";

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
