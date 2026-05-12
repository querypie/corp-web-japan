import test from "node:test";
import assert from "node:assert/strict";
import { sourceExists } from "../../../../helpers/source-readers.mjs";

test("/t/whitepapers preview entrypoint has been removed", () => {
  assert.equal(sourceExists("src/app/t/whitepapers/page.tsx"), false);
});
