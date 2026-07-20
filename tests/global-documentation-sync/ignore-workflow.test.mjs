import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readWorkflow = (name) => readFile(`.github/workflows/${name}`, "utf8");

test("ignore dispatch creates an auto-merge decision PR with a machine marker", async () => {
  const source = await readWorkflow("ignore-global-documentation-sync.yml");
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /sync_pr_number:/);
  assert.match(source, /global-documentation-sync-ignore:v1/);
  assert.match(source, /gh pr merge .*--auto --squash/);
  assert.doesNotMatch(source, /git push origin HEAD:main/);
});

test("close reconciler handles both CI completion and delayed approval", async () => {
  const source = await readWorkflow("close-ignored-sync-pr.yml");
  assert.match(source, /workflow_run:/);
  assert.match(source, /pull_request_review:/);
  assert.match(source, /github\.event\.review\.state == 'approved'/);
  assert.match(source, /startsWith\(github\.event\.pull_request\.head\.ref, 'content-sync-ignore\/'\)/);
  assert.match(source, /contents: write/);
  assert.match(source, /pull-requests: write/);
  assert.match(source, /gh pr close/);
  assert.match(source, /git\/refs\/heads\/content-sync\/\$source_id/);
});
