import assert from "node:assert/strict";
import { mkdtemp, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { durableEvidenceConfig } from "../../scripts/global-documentation-sync/production-run.mjs";
import { createValidationHome, runValidationCommand, validationEnvironment } from "../../scripts/global-documentation-sync/validation-env.mjs";

test("validationEnvironment preserves runtime basics and strips automation controls and secrets", async () => {
  const reportsDir = await mkdtemp(path.join(os.tmpdir(), "validation-env-"));
  const home = await createValidationHome(reportsDir);
  const serviceEnv = {
    PATH: "/usr/bin:/bin",
    TURBOPACK_ROOT: "/repo",
    PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright",
    LANG: "ja_JP.UTF-8",
    LC_ALL: "ja_JP.UTF-8",
    npm_config_userconfig: "/tmp/.npmrc",
    NPM_CONFIG_CACHE: "/tmp/npm-cache",
    DURABLE_EVIDENCE_REQUIRED: "1",
    EVIDENCE_ISSUE_NUMBER: "688",
    ALERT_WEBHOOK_URL: "https://hooks.slack.test/services/secret",
    GH_TOKEN: "ghp_abcdefghijklmnopqrstuvwxyz123456",
    GH_CONFIG_DIR: "/tmp/gh",
    PI_CODING_AGENT_DIR: "/tmp/pi-agent",
    SSH_AUTH_SOCK: "/tmp/ssh.sock",
    API_KEY: "api-secret",
    PRIVATE_KEY_PATH: "/tmp/private-key",
    CUSTOM_SECRET: "secret",
  };

  const sanitized = validationEnvironment(serviceEnv, { home });
  assert.equal(sanitized.HOME, home);
  assert.equal(sanitized.PATH, serviceEnv.PATH);
  assert.equal(sanitized.TURBOPACK_ROOT, serviceEnv.TURBOPACK_ROOT);
  assert.equal(sanitized.PLAYWRIGHT_BROWSERS_PATH, serviceEnv.PLAYWRIGHT_BROWSERS_PATH);
  assert.equal(sanitized.LANG, serviceEnv.LANG);
  assert.equal(sanitized.LC_ALL, serviceEnv.LC_ALL);
  assert.equal(sanitized.npm_config_userconfig, serviceEnv.npm_config_userconfig);
  assert.equal(sanitized.NPM_CONFIG_CACHE, serviceEnv.NPM_CONFIG_CACHE);
  for (const blocked of [
    "DURABLE_EVIDENCE_REQUIRED",
    "EVIDENCE_ISSUE_NUMBER",
    "ALERT_WEBHOOK_URL",
    "GH_TOKEN",
    "GH_CONFIG_DIR",
    "PI_CODING_AGENT_DIR",
    "SSH_AUTH_SOCK",
    "API_KEY",
    "PRIVATE_KEY_PATH",
    "CUSTOM_SECRET",
  ]) {
    assert.equal(blocked in sanitized, false, `${blocked} should be removed`);
  }
  assert.deepEqual(durableEvidenceConfig({ env: sanitized }), { evidenceIssueNumber: null, githubRepo: null, required: false });
  const homeStat = await stat(home);
  assert.equal(homeStat.mode & 0o777, 0o700);
});

test("runValidationCommand writes full command logs before throwing and bounds user error", async () => {
  const reportsDir = await mkdtemp(path.join(os.tmpdir(), "validation-log-"));
  const env = validationEnvironment({ PATH: process.env.PATH || "" }, { home: await createValidationHome(reportsDir) });
  const longStdout = `${"stdout-line\n".repeat(800)}final failing test name\n`;
  const longStderr = `${"stderr-line\n".repeat(800)}fatal detail\n`;

  await assert.rejects(
    () => runValidationCommand({
      command: process.execPath,
      args: ["-e", `process.stdout.write(${JSON.stringify(longStdout)}); process.stderr.write(${JSON.stringify(longStderr)}); process.exit(3);`],
      cwd: process.cwd(),
      env,
      reportsDir,
      label: "validation-failure",
    }),
    (error) => {
      assert.match(error.message, /failed \(3\)/);
      assert.match(error.message, /see .*validation-failure\.log/);
      assert.match(error.message, /final failing test name/);
      assert.ok(error.message.length < 10000);
      return true;
    },
  );

  const logPath = path.join(reportsDir, "validation-failure.log");
  const log = await readFile(logPath, "utf8");
  assert.match(log, /command:/);
  assert.match(log, /stdout:/);
  assert.match(log, /stderr:/);
  assert.match(log, /final failing test name/);
  assert.match(log, /fatal detail/);
  const logStat = await stat(logPath);
  assert.equal(logStat.mode & 0o777, 0o600);
});
