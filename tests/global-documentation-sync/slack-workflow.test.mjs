import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const workflow = path.resolve(".github/workflows/content-sync-slack.yml");

test("Slack workflow notifies only same-repository content-sync Draft PRs", async () => {
  const source = await readFile(workflow, "utf8");
  assert.match(source, /name: Notify Global publication sync Draft PR/);
  assert.match(source, /pull_request_target:/);
  assert.match(source, /types: \[opened, reopened\]/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /github\.event\.pull_request\.draft/);
  assert.match(source, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/);
  assert.match(source, /startsWith\(github\.event\.pull_request\.head\.ref, 'content-sync\/'\)/);
  assert.match(source, /secrets\.CONTENT_SYNC_SLACK_WEBHOOK_URL/);
  assert.match(source, /vars\.CONTENT_SYNC_SLACK_MENTION/);
  assert.match(source, /vars\.CONTENT_SYNC_SLACK_CHANNEL_ID/);
  assert.match(source, /Global publication sync Slack notification test/);
  assert.match(source, /Global publication Draft PR is ready for review/);
  assert.doesNotMatch(source, /actions\/checkout/);
});
