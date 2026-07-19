import assert from "node:assert/strict";
import test from "node:test";

import { resolvePlaywrightChromium, validateTurbopackLayout } from "../../scripts/global-documentation-sync/preflight.mjs";

test("resolves Playwright Chromium from ESM or CommonJS namespaces", () => {
  const chromium = { executablePath: () => "/managed/chromium" };
  assert.equal(resolvePlaywrightChromium({ chromium }), chromium);
  assert.equal(resolvePlaywrightChromium({ default: { chromium } }), chromium);
});

test("requires base checkout, worktrees, and dependencies under Turbopack root", () => {
  assert.doesNotThrow(() => validateTurbopackLayout({ turbopackRoot: "/srv/repos", targetRepo: "/srv/repos/corp-web-japan", worktreesRoot: "/srv/repos/worktrees" }));
  assert.throws(() => validateTurbopackLayout({ turbopackRoot: "/srv/repos", targetRepo: "/srv/repos/corp-web-japan", worktreesRoot: "/var/lib/worktrees" }), /TURBOPACK_ROOT/);
});
