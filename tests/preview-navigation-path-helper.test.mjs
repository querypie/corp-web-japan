import test from "node:test";
import assert from "node:assert/strict";
import { createTsModuleLoader } from "./helpers/ts-module-loader.mjs";

const loader = createTsModuleLoader();
const { t } = loader.importModule("src/lib/preview-navigation.ts");

test("preview navigation helper only treats explicit /t/... paths as already-previewed", () => {
  assert.equal(t("/", true), "/");
  assert.equal(t("/t/platforms/aip", true), "/t/platforms/aip");

  assert.equal(t("/platforms/aip", true), "/t/platforms/aip");
  assert.equal(t("/services/fde", true), "/t/services/fde");
});

test("preview navigation helper leaves canonical paths unchanged when preview mode is disabled", () => {
  assert.equal(t("/platforms/aip", false), "/platforms/aip");
  assert.equal(t("/services/fde", false), "/services/fde");
});
