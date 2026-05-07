import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/api/gating-form/preview-unlock sets the same unlock cookie without delegating to external submit side effects", () => {
  const previewUnlockRoute = readSource("src/app/api/gating-form/preview-unlock/route.ts");

  assert.match(previewUnlockRoute, /isPreviewNavigationToggleVisible/);
  assert.doesNotMatch(previewUnlockRoute, /submitGatingForm/);
  assert.match(previewUnlockRoute, /buildGatingCookieName/);
  assert.match(previewUnlockRoute, /response\.cookies\.set/);
  assert.match(previewUnlockRoute, /NextResponse\.json\(\{ success: true \}\)/);
});
