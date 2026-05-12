import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const tsconfig = JSON.parse(
  readFileSync(new URL("../tsconfig.json", import.meta.url), "utf8"),
);

test("routine typecheck includes stable Next type output but excludes transient dev validator output", () => {
  assert.ok(Array.isArray(tsconfig.include));
  assert.ok(tsconfig.include.includes(".next/types/**/*.ts"));
  assert.ok(!tsconfig.include.includes(".next/dev/types/**/*.ts"));
});
