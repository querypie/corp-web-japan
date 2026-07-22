import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const builder = path.resolve("ops/global-documentation-sync/build-failure-alert.py");
const latestReportSelector = path.resolve("ops/global-documentation-sync/select-latest-report.py");

function buildAlert(args = []) {
  const result = spawnSync("python3", [builder, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("failure alert builder emits compact Block Kit payload with a default-collapsed reason container", () => {
  const alert = buildAlert([
    "--mention", "<@U123>",
    "--unit", "global-documentation-sync.service",
    "--run-id", "run-123",
    "--stage", "review",
    "--host", "vm-01",
    "--report-path", "/var/lib/global-documentation-sync/reports/run-123",
    "--reason", 'line "one"\nline two\n```danger```',
  ]);

  assert.deepEqual(alert.payload, {
    text: "<@U123> — Global publication sync failed | Unit: global-documentation-sync.service | Run: run-123 | Stage: review | Host: vm-01",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Global publication sync failed", emoji: true },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: "<@U123> Please investigate this failure." },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: "*Unit*\nglobal-documentation-sync.service" },
          { type: "mrkdwn", text: "*Run*\nrun-123" },
          { type: "mrkdwn", text: "*Stage*\nreview" },
          { type: "mrkdwn", text: "*Host*\nvm-01" },
        ],
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: "*Report* /var/lib/global-documentation-sync/reports/run-123" },
        ],
      },
      {
        type: "container",
        title: { type: "plain_text", text: "Failure reason", emoji: true },
        is_collapsible: true,
        default_collapsed: true,
        child_blocks: [
          { type: "section", text: { type: "mrkdwn", text: "line \"one\"\nline two\n``​`danger``​`" } },
        ],
      },
    ],
  });
  assert.equal(alert.sanitizedReason, 'line "one"\nline two\n``​`danger``​`');
  assert.ok(alert.logMessage.includes('reason=line "one" | line two | ``​`danger``​`'));
  assert.ok(!alert.payload.text.includes("Reason"));
  assert.ok(!alert.payload.text.includes("line two"));
  assert.doesNotThrow(() => JSON.stringify(alert.payload));
});

test("failure alert builder bounds and redacts the long reason while keeping fallback compact", () => {
  const fakeSlackToken = ["xoxb", "123456789012", "123456789012", "abcdefghijklmnopqrstuvwxyz"].join("-");
  const longReason = [
    "Bearer secret-token-value",
    fakeSlackToken,
    "sk-proj-abcdefghijklmnopqrstuvwxyz123456",
    "https://example.com/path?token=secret&api_key=raw&apikey=raw2&AUTHORIZATION=raw3&auth=raw4&password=raw5&secret=raw6&client_secret=raw7&ok=1",
    "A".repeat(5000),
  ].join("\n");
  const alert = buildAlert([
    "--mention", "<@U999>",
    "--unit", "global-documentation-sync.service",
    "--run-id", "run-999",
    "--stage", "failed",
    "--host", "vm-99",
    "--report-path", "/tmp/report",
    "--reason", longReason,
  ]);

  const reasonBlock = alert.payload.blocks.at(-1);
  assert.equal(reasonBlock.type, "container");
  assert.equal(reasonBlock.is_collapsible, true);
  assert.equal(reasonBlock.default_collapsed, true);
  assert.equal(reasonBlock.child_blocks.length, 1);
  assert.ok(reasonBlock.child_blocks[0].text.text.startsWith("Bearer REDACTED\nREDACTED\nREDACTED\nhttps://example.com/path?token=REDACTED&api_key=REDACTED&apikey=REDACTED&AUTHORIZATION=REDACTED&auth=REDACTED&password=REDACTED&secret=REDACTED&client_secret=REDACTED&ok=1\n"));
  assert.ok(reasonBlock.child_blocks[0].text.text.endsWith("…"));
  assert.ok(alert.sanitizedReason.length <= 2400);
  const payloadJson = JSON.stringify(alert.payload);
  assert.ok(!alert.sanitizedReason.includes("secret-token-value"));
  assert.ok(!alert.sanitizedReason.includes(fakeSlackToken));
  assert.ok(!alert.sanitizedReason.includes("sk-proj-abcdefghijklmnopqrstuvwxyz123456"));
  assert.ok(!alert.sanitizedReason.includes("api_key=raw"));
  assert.ok(!alert.sanitizedReason.includes("AUTHORIZATION=raw3"));
  assert.ok(!payloadJson.includes("secret-token-value"));
  assert.ok(!payloadJson.includes(fakeSlackToken));
  assert.ok(!payloadJson.includes("sk-proj-abcdefghijklmnopqrstuvwxyz123456"));
  assert.ok(!payloadJson.includes("api_key=raw"));
  assert.ok(!payloadJson.includes("AUTHORIZATION=raw3"));
  assert.ok(!alert.logMessage.includes("secret-token-value"));
  assert.ok(!alert.logMessage.includes(fakeSlackToken));
  assert.ok(!alert.logMessage.includes("sk-proj-abcdefghijklmnopqrstuvwxyz123456"));
  assert.ok(!alert.logMessage.includes("api_key=raw"));
  assert.ok(!alert.logMessage.includes("AUTHORIZATION=raw3"));
  assert.ok(!alert.payload.text.includes("REDACTED"));
  assert.ok(!alert.payload.text.includes("Reason"));
  assert.ok(alert.logMessage.length <= 1400);
});

test("failure alert builder derives Slack and logger reason from the same sanitized string", () => {
  const alert = buildAlert([
    "--reason", "sk-proj-abcdefghijklmnopqrstuvwxyz123456\nhttps://example.com/path?Authorization=raw&ok=1",
  ]);

  assert.equal(alert.sanitizedReason, "REDACTED\nhttps://example.com/path?Authorization=REDACTED&ok=1");
  assert.equal(alert.payload.blocks.at(-1).child_blocks[0].text.text, alert.sanitizedReason);
  assert.ok(alert.logMessage.includes(`reason=${alert.sanitizedReason.replaceAll("\n", " | ")}`));
});

test("latest report selector prefers newest run-status mtime over lexicographic directory order and ignores dirs without run-status", async () => {
  const reportsRoot = await mkdtemp(path.join(os.tmpdir(), "report-failure-"));
  const newerNumericRun = path.join(reportsRoot, "20260722T010227958Z");
  const lexicographicallyLaterOldRun = path.join(reportsRoot, "zzz-old-composite-review");
  const ignoredDir = path.join(reportsRoot, "zzzz-no-status");
  await Promise.all([
    mkdir(newerNumericRun, { recursive: true }),
    mkdir(lexicographicallyLaterOldRun, { recursive: true }),
    mkdir(ignoredDir, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(path.join(newerNumericRun, "run-status.json"), JSON.stringify({ runId: "20260722T010227958Z" })),
    writeFile(path.join(lexicographicallyLaterOldRun, "run-status.json"), JSON.stringify({ runId: "old-run" })),
    writeFile(path.join(ignoredDir, "failure-summary.json"), JSON.stringify({ reason: "ignore" })),
  ]);
  const now = new Date();
  const oldTime = new Date(now.getTime() - 60_000);
  const newTime = new Date(now.getTime() + 60_000);
  await Promise.all([
    utimes(path.join(lexicographicallyLaterOldRun, "run-status.json"), oldTime, oldTime),
    utimes(path.join(newerNumericRun, "run-status.json"), newTime, newTime),
  ]);

  const result = spawnSync("python3", [latestReportSelector, reportsRoot], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), newerNumericRun);
});
