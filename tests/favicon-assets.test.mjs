import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("app favicon assets match the expected QueryPie favicon files", () => {
  const favicon = new URL("../src/app/favicon.ico", import.meta.url);
  const icon = new URL("../src/app/icon.png", import.meta.url);
  const appleIcon = new URL("../src/app/apple-icon.png", import.meta.url);

  assert.equal(existsSync(favicon), true);
  assert.equal(existsSync(icon), true);
  assert.equal(existsSync(appleIcon), true);

  assert.equal(readFileSync(favicon).byteLength, 863);
  assert.equal(readFileSync(icon).byteLength, 863);
  assert.equal(readFileSync(appleIcon).byteLength, 5978);
});
