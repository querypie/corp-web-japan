import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { redactSecrets } from "./redaction.mjs";

const SENSITIVE_KEY_PATTERN = /(?:token|secret|password|webhook|credential|api[_-]?key|private[_-]?key)/i;
const BLOCKED_KEYS = new Set([
  "ALERT_WEBHOOK_URL",
  "DURABLE_EVIDENCE_REQUIRED",
  "EVIDENCE_ISSUE_NUMBER",
  "GH_CONFIG_DIR",
  "PI_CODING_AGENT_DIR",
  "SSH_AUTH_SOCK",
]);

function shouldKeepKey(key) {
  if (!key) return false;
  if (key === "HOME") return false;
  if (BLOCKED_KEYS.has(key)) return false;
  if (SENSITIVE_KEY_PATTERN.test(key)) return false;
  return true;
}

export function validationEnvironment(baseEnv = process.env, { home } = {}) {
  if (!home) throw new Error("home required for validation environment");
  const env = {};
  for (const [key, value] of Object.entries(baseEnv || {})) {
    if (!shouldKeepKey(key)) continue;
    if (typeof value !== "string") continue;
    env[key] = value;
  }
  env.HOME = home;
  return env;
}

export async function createValidationHome(reportsDir) {
  const home = path.join(reportsDir, "validation-home");
  await rm(home, { recursive: true, force: true });
  await mkdir(home, { recursive: true, mode: 0o700 });
  return home;
}

function validationLogPath(reportsDir, label) {
  return path.join(reportsDir, `${label}.log`);
}

function boundedOutput(value) {
  return redactSecrets(value.slice(-4000));
}

function boundedCommand(command, args) {
  const raw = [command, ...args].join(" ");
  if (raw.length <= 500) return redactSecrets(raw);
  return `${redactSecrets(raw.slice(0, 500))}…`;
}

export async function runValidationCommand({
  command,
  args,
  cwd,
  env,
  reportsDir,
  label,
  spawnImpl = spawn,
}) {
  if (!reportsDir) throw new Error("reportsDir required");
  if (!label) throw new Error("label required");
  const logFile = validationLogPath(reportsDir, label);
  return new Promise((resolve, reject) => {
    const commandSummary = boundedCommand(command, args);
    const child = spawnImpl(command, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const persistLog = async (code, errorMessage = null) => {
      const content = [
        `command: ${[command, ...args].join(" ")}`,
        `cwd: ${cwd}`,
        `exitCode: ${code ?? "spawn-error"}`,
        errorMessage ? `spawnError: ${redactSecrets(errorMessage)}` : null,
        "stdout:",
        stdout,
        "stderr:",
        stderr,
      ].filter((part) => part !== null).join("\n\n");
      await writeFile(logFile, content, { mode: 0o600 });
    };
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", async (error) => {
      try { await persistLog(null, error.message); }
      catch {}
      reject(new Error(redactSecrets(`${commandSummary} failed to start: ${error.message}`)));
    });
    child.on("close", async (code) => {
      try { await persistLog(code); }
      catch (error) {
        reject(error);
        return;
      }
      if (code === 0) {
        resolve({ command: [command, ...args].join(" "), code, stdout: boundedOutput(stdout), logFile });
        return;
      }
      reject(new Error(redactSecrets(`${commandSummary} failed (${code})\nsee ${logFile}\nstderr:\n${boundedOutput(stderr)}\nstdout:\n${boundedOutput(stdout)}`)));
    });
  });
}
