import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/api/gating-form/unlock route delegates to the gating submit caller and still sets the unlock cookie", () => {
  const submitRoute = readSource("src/app/api/gating-form/unlock/route.ts");

  assert.match(submitRoute, /submitGatingForm/);
  assert.match(submitRoute, /request\.headers\.get\("referer"\)/);
  assert.match(submitRoute, /buildGatingCookieName/);
  assert.match(submitRoute, /response\.cookies\.set/);
  assert.match(submitRoute, /NextResponse\.json\(\{ success: true \}\)/);
});
