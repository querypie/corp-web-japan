import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const tsconfig = JSON.parse(
  readFileSync(new URL("../tsconfig.json", import.meta.url), "utf8"),
);
const nextTsconfig = JSON.parse(
  readFileSync(new URL("../tsconfig.next.json", import.meta.url), "utf8"),
);
const nextConfigSource = readFileSync(
  new URL("../next.config.ts", import.meta.url),
  "utf8",
);

test("routine typecheck keeps tsconfig.json on the stable non-dev Next type output", () => {
  assert.ok(Array.isArray(tsconfig.include));
  assert.ok(tsconfig.include.includes(".next/types/**/*.ts"));
  assert.ok(!tsconfig.include.includes(".next/dev/types/**/*.ts"));
});

test("Next build uses a dedicated tsconfig that includes both stable and dev Next type outputs", () => {
  assert.equal(nextTsconfig.extends, "./tsconfig.json");
  assert.ok(Array.isArray(nextTsconfig.include));
  assert.ok(nextTsconfig.include.includes(".next/types/**/*.ts"));
  assert.ok(nextTsconfig.include.includes(".next/dev/types/**/*.ts"));
  assert.match(nextConfigSource, /tsconfigPath:\s*"tsconfig\.next\.json"/);
});
