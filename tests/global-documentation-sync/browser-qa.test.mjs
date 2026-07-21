import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

import { assessPageMetrics, publicationRoute, stopPreviewServer } from "../../scripts/global-documentation-sync/browser-qa.mjs";

test("fails closed on broken media or horizontal overflow", () => {
  assert.deepEqual(assessPageMetrics({ clientWidth: 390, scrollWidth: 391, images: [] }).status, "failed");
  assert.deepEqual(assessPageMetrics({ clientWidth: 390, scrollWidth: 390, images: [{ complete: true, naturalWidth: 0, naturalHeight: 0, width: 100, height: 100 }] }).status, "failed");
  assert.deepEqual(assessPageMetrics({ clientWidth: 390, scrollWidth: 390, images: [{ complete: true, naturalWidth: 100, naturalHeight: 50, width: 330, height: 165 }] }).status, "passed");
});

test("stops the complete detached preview process group", { skip: process.platform === "win32" }, async () => {
  const script = [
    'const { spawn } = require("node:child_process");',
    'const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });',
    'process.stdout.write(String(child.pid));',
    'setInterval(() => {}, 1000);',
  ].join("");
  const server = spawn(process.execPath, ["-e", script], { detached: true, stdio: ["ignore", "pipe", "ignore"] });
  const childPid = Number((await new Promise((resolve) => server.stdout.once("data", resolve))).toString());
  await stopPreviewServer(server);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { process.kill(childPid, 0); } catch (error) { if (error.code === "ESRCH") return; throw error; }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail(`preview child ${childPid} survived process-group cleanup`);
});

test("builds canonical local publication routes for every family", () => {
  const expected = {
    blog: "/blog/7/slug", whitepapers: "/whitepapers/7/slug", news: "/news/7/slug",
    events: "/events/7/slug", manuals: "/manuals/7/slug", glossary: "/glossary/7/slug",
    "use-cases": "/use-cases/7/slug", "introduction-deck": "/introduction-deck/7/slug",
  };
  for (const [family, route] of Object.entries(expected)) assert.equal(publicationRoute({ targetFamily: family, targetId: 7, meta: { id: "slug" } }), route);
});
