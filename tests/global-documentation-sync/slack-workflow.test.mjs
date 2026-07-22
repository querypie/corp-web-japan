import assert from "node:assert/strict";
import { execFile, spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const workflow = path.resolve(".github/workflows/content-sync-slack.yml");
const reportFailure = path.resolve("ops/global-documentation-sync/report-failure.sh");
const execFileAsync = promisify(execFile);

function extractWorkflowRunScript(workflowSource) {
  const lines = workflowSource.split("\n");
  const stepIndex = lines.findIndex((line) => line.includes("- name: Send Slack notification"));
  assert.notEqual(stepIndex, -1, "expected Send Slack notification step");
  const runIndex = lines.findIndex((line, index) => index > stepIndex && line.trim() === "run: |");
  assert.notEqual(runIndex, -1, "expected Send Slack notification run block");

  const scriptLines = [];
  for (let index = runIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === "") {
      scriptLines.push("");
      continue;
    }
    if (!line.startsWith("          ")) break;
    scriptLines.push(line.slice(10));
  }

  return scriptLines.join("\n").trim();
}

async function runWorkflowShell(env) {
  const source = await readFile(workflow, "utf8");
  const runScript = extractWorkflowRunScript(source);
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "content-sync-slack-"));
  const requestPath = path.join(tempDir, "request.json");
  const curlPath = path.join(tempDir, "curl");
  const scriptPath = path.join(tempDir, "workflow.sh");

  await writeFile(curlPath, `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
const dataIndex = args.indexOf("-d");
if (dataIndex === -1) throw new Error("missing -d");
const payload = args[dataIndex + 1];
const url = args.at(-1);
fs.writeFileSync(${JSON.stringify(requestPath)}, JSON.stringify({ url, payload }, null, 2));
`, { mode: 0o755 });
  await writeFile(scriptPath, `${runScript}\n`, { mode: 0o755 });

  const result = await execFileAsync("bash", [scriptPath], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PATH: `${tempDir}:${process.env.PATH}`,
      ...env,
    },
  });

  const request = JSON.parse(await readFile(requestPath, "utf8"));
  const payload = JSON.parse(request.payload);
  return { source, payload, url: request.url, stdout: result.stdout, stderr: result.stderr };
}

function reviewsAndValidationBody(marker) {
  return [
    "## Reviews",
    "- Fidelity: pass",
    "- Contract: pass",
    "",
    "## Validation",
    "- npm run test:ci",
    "- npm run build",
    "",
    marker,
  ].join("\n");
}

test("Slack workflow shell parses with bash -n", async () => {
  const source = await readFile(workflow, "utf8");
  const runScript = extractWorkflowRunScript(source);
  const tempScript = path.join(os.tmpdir(), `content-sync-slack-${process.pid}.sh`);
  await writeFile(tempScript, `${runScript}\n`, "utf8");
  await execFileAsync("bash", ["-n", tempScript]);
});

test("Slack workflow keeps same-repository pull_request_target security and contract env names", async () => {
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
  assert.doesNotMatch(source, /secrets\.ALERT_WEBHOOK_URL/);
  assert.doesNotMatch(source, /actions\/checkout/);
});

test("Slack workflow success notification emits reviewer mention and rich Block Kit for composite identity PRs", async () => {
  const marker = '<!-- global-documentation-sync:v1 {"sourceSection":"documentation","sourceId":"cnt_000009","targetFamily":"manuals","targetId":9,"runId":"20260722T010227958Z","branch":"content-sync/documentation-cnt_000009"} -->';
  const result = await runWorkflowShell({
    WEBHOOK_URL: "https://hooks.slack.test/content-sync",
    MENTION: "<@U123>",
    CHANNEL_ID: "C123",
    EVENT_NAME: "pull_request_target",
    PR_URL: "https://github.com/querypie/corp-web-japan/pull/694",
    PR_TITLE: "Draft: Sync manual 9",
    PR_BRANCH: "content-sync/documentation-cnt_000009",
    PR_BODY: reviewsAndValidationBody(marker),
  });

  assert.equal(result.url, "https://hooks.slack.test/content-sync");
  assert.equal(result.payload.text, "<@U123> Please review this Draft PR.");
  assert.equal(result.payload.blocks[0].type, "header");
  assert.match(result.payload.blocks[0].text.text, /Global publication Draft PR ready/i);
  assert.deepEqual(result.payload.blocks[1], {
    type: "section",
    text: { type: "mrkdwn", text: "<@U123> Please review this Draft PR." },
  });
  assert.deepEqual(result.payload.blocks[2].fields, [
    { type: "mrkdwn", text: "*Source*\n`documentation/cnt_000009`" },
    { type: "mrkdwn", text: "*Target*\n`manuals/9`" },
    { type: "mrkdwn", text: "*Status*\nDraft PR ready" },
    { type: "mrkdwn", text: "*Run*\n`20260722T010227958Z`" },
  ]);
  assert.equal(result.payload.blocks[3].text.text, "*PR title*\nDraft: Sync manual 9");
  assert.equal(result.payload.blocks[3].accessory.text.text, "Open Draft PR");
  assert.equal(result.payload.blocks[3].accessory.url, "https://github.com/querypie/corp-web-japan/pull/694");
  assert.equal(result.payload.blocks[3].accessory.action_id, "open_draft_pr");
  assert.equal(result.payload.blocks[4].type, "context");
  assert.match(result.payload.blocks[4].elements[0].text, /Human review required/);
  assert.equal(result.payload.blocks[5].type, "container");
  assert.equal(result.payload.blocks[5].title.text, "Validation details");
  assert.equal(result.payload.blocks[5].is_collapsible, true);
  assert.equal(result.payload.blocks[5].default_collapsed, true);
  assert.equal(result.payload.blocks[5].child_blocks.length, 2);
  assert.match(result.payload.blocks[5].child_blocks[0].text.text, /\*Pi reviews\*/);
  assert.match(result.payload.blocks[5].child_blocks[0].text.text, /Fidelity: pass/);
  assert.match(result.payload.blocks[5].child_blocks[1].text.text, /\*Validation\*/);
  assert.match(result.payload.blocks[5].child_blocks[1].text.text, /npm run build/);
});

test("Slack workflow accepts exactly one legacy marker and infers sourceSection from targetFamily", async () => {
  const marker = '<!-- global-documentation-sync:v1 {"sourceId":"cnt_000212","targetFamily":"news","targetId":212,"runId":"r687","branch":"content-sync/cnt_000212"} -->';
  const result = await runWorkflowShell({
    WEBHOOK_URL: "https://hooks.slack.test/content-sync",
    MENTION: "<@U123>",
    CHANNEL_ID: "C123",
    EVENT_NAME: "pull_request_target",
    PR_URL: "https://github.com/querypie/corp-web-japan/pull/687",
    PR_TITLE: "Draft: Sync news 212",
    PR_BRANCH: "content-sync/cnt_000212",
    PR_BODY: reviewsAndValidationBody(marker),
  });

  assert.equal(result.payload.blocks[2].fields[0].text, "*Source*\n`news/cnt_000212`");
  assert.equal(result.payload.blocks[2].fields[1].text, "*Target*\n`news/212`"
  );
});

test("Slack workflow fails closed when sync marker is missing, malformed, or duplicated", async () => {
  await assert.rejects(() => runWorkflowShell({
    WEBHOOK_URL: "https://hooks.slack.test/content-sync",
    MENTION: "<@U123>",
    CHANNEL_ID: "C123",
    EVENT_NAME: "pull_request_target",
    PR_URL: "https://github.com/querypie/corp-web-japan/pull/694",
    PR_TITLE: "Draft: Missing marker",
    PR_BRANCH: "content-sync/documentation-cnt_000009",
    PR_BODY: "## Reviews\n- pass\n\n## Validation\n- pass\n",
  }), /expected exactly one global-documentation-sync marker/);

  await assert.rejects(() => runWorkflowShell({
    WEBHOOK_URL: "https://hooks.slack.test/content-sync",
    MENTION: "<@U123>",
    CHANNEL_ID: "C123",
    EVENT_NAME: "pull_request_target",
    PR_URL: "https://github.com/querypie/corp-web-japan/pull/694",
    PR_TITLE: "Draft: Malformed marker",
    PR_BRANCH: "content-sync/documentation-cnt_000009",
    PR_BODY: reviewsAndValidationBody('<!-- global-documentation-sync:v1 {"sourceSection":"documentation","sourceId":"cnt_000009",} -->'),
  }), /invalid global-documentation-sync marker JSON/);

  const duplicateMarker = [
    reviewsAndValidationBody('<!-- global-documentation-sync:v1 {"sourceSection":"documentation","sourceId":"cnt_000009","targetFamily":"manuals","targetId":9,"runId":"r","branch":"content-sync/documentation-cnt_000009"} -->'),
    '<!-- global-documentation-sync:v1 {"sourceSection":"documentation","sourceId":"cnt_000010","targetFamily":"manuals","targetId":10,"runId":"r2","branch":"content-sync/documentation-cnt_000010"} -->',
  ].join("\n");
  await assert.rejects(() => runWorkflowShell({
    WEBHOOK_URL: "https://hooks.slack.test/content-sync",
    MENTION: "<@U123>",
    CHANNEL_ID: "C123",
    EVENT_NAME: "pull_request_target",
    PR_URL: "https://github.com/querypie/corp-web-japan/pull/694",
    PR_TITLE: "Draft: Duplicate marker",
    PR_BRANCH: "content-sync/documentation-cnt_000009",
    PR_BODY: duplicateMarker,
  }), /expected exactly one global-documentation-sync marker/);
});

test("Slack workflow preview is English rich-format preview without mention or action required", async () => {
  const result = await runWorkflowShell({
    WEBHOOK_URL: "https://hooks.slack.test/content-sync",
    MENTION: "<@U123>",
    CHANNEL_ID: "C123",
    EVENT_NAME: "workflow_dispatch",
    PR_URL: "",
    PR_TITLE: "",
    PR_BRANCH: "",
    PR_BODY: "",
  });

  assert.equal(result.url, "https://hooks.slack.test/content-sync");
  assert.ok(!result.payload.text.includes("<@U123>"));
  assert.match(result.payload.text, /format preview/i);
  assert.match(result.payload.text, /no action required/i);
  assert.ok(Array.isArray(result.payload.blocks));
  assert.match(JSON.stringify(result.payload.blocks), /format preview/i);
  assert.match(JSON.stringify(result.payload.blocks), /no action required/i);
  assert.equal(result.payload.blocks[2].fields[0].text, "*Source*\n`documentation/cnt_000000`");
  assert.equal(result.payload.blocks[5].type, "container");
  assert.equal(result.payload.blocks[5].default_collapsed, true);
  assert.doesNotMatch(JSON.stringify(result.payload.blocks), /Please review this Draft PR/);
  assert.doesNotMatch(JSON.stringify(result.payload.blocks), /<@U123>/);
});

test("success and failure notifications keep webhook contracts separated", async () => {
  const workflowSource = await readFile(workflow, "utf8");
  const reportFailureSource = await readFile(reportFailure, "utf8");
  assert.match(workflowSource, /CONTENT_SYNC_SLACK_WEBHOOK_URL/);
  assert.doesNotMatch(workflowSource, /ALERT_WEBHOOK_URL/);
  assert.match(reportFailureSource, /ALERT_WEBHOOK_URL/);
  assert.doesNotMatch(reportFailureSource, /CONTENT_SYNC_SLACK_WEBHOOK_URL/);

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "report-failure-contract-"));
  const requestPath = path.join(tempDir, "request.json");
  const curlPath = path.join(tempDir, "curl");
  const loggerPath = path.join(tempDir, "logger");
  await writeFile(curlPath, `#!/usr/bin/env node
const fs = require("node:fs");
const url = process.argv.at(-1);
fs.writeFileSync(${JSON.stringify(requestPath)}, JSON.stringify({ url }, null, 2));
`, { mode: 0o755 });
  await writeFile(loggerPath, "#!/usr/bin/env bash\nexit 0\n", { mode: 0o755 });

  const result = spawnSync("bash", [reportFailure, "global-documentation-sync.service"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${tempDir}:${process.env.PATH}`,
      ALERT_WEBHOOK_URL: "https://hooks.slack.test/alert",
      CONTENT_SYNC_SLACK_WEBHOOK_URL: "https://hooks.slack.test/content-sync-should-not-be-used",
      ALERT_SLACK_MENTION: "<@UKELLY>",
      REPORTS_ROOT: tempDir,
    },
  });
  assert.equal(result.status, 0, result.stderr);
  const request = JSON.parse(await readFile(requestPath, "utf8"));
  assert.equal(request.url, "https://hooks.slack.test/alert");
});
