import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

test("/t/events preview list route is removed after promoting events to the canonical public route", () => {
  assert.equal(existsSync(new URL("../../../../../src/app/t/events/page.tsx", import.meta.url)), false);
});
