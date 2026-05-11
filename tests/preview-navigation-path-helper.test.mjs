import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "./helpers/ts-module-loader.mjs";

const loader = createTsModuleLoader();
const { t } = loader.importModule("src/lib/preview-navigation.ts");

test("preview navigation helper only treats the explicit /t namespace as already-previewed", () => {
  assert.equal(t("/", true), "/");
  assert.equal(t("/t", true), "/t");
  assert.equal(t("/t/terms-of-service", true), "/t/terms-of-service");

  assert.equal(t("/terms-of-service", true), "/t/terms-of-service");
  assert.equal(t("/privacy-policy", true), "/t/privacy-policy");
  assert.equal(t("/eula", true), "/t/eula");
  assert.equal(t("/cookie-preference", true), "/t/cookie-preference");
});

test("preview navigation helper leaves canonical paths unchanged when preview mode is disabled", () => {
  assert.equal(t("/terms-of-service", false), "/terms-of-service");
  assert.equal(t("/privacy-policy", false), "/privacy-policy");
});
