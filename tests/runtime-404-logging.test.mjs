import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("unmatched routes are forced through runtime logging before returning notFound", () => {
  const file = "src/app/[...missing]/page.tsx";

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);

  assert.match(source, /export const dynamic = "force-dynamic"/);
  assert.match(source, /const requestedPath = `\/\$\{missing\.join\("\/"\)\}`;/);
  assert.match(source, /console\.log\(\s*"\[runtime-404\]"/);
  assert.match(source, /JSON\.stringify\(/);
  assert.match(source, /notFound\(\);/);
});
