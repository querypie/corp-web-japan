#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { runBrowserQa } from "./browser-qa.mjs";
import { finalize, parseArgs, prepare } from "./cli.mjs";
import { validateGeneratedPublication } from "./generated-validation.mjs";
import { SCHEMA_VERSION, validateArtifact } from "./lib.mjs";
import { runPiInvocations } from "./pi-runner.mjs";
import { redactSecrets } from "./redaction.mjs";
import { runReviewCycle } from "./review-cycle.mjs";

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0
      ? resolve({ command: [command, ...args].join(" "), code, stdout: redactSecrets(stdout.slice(-4000)) })
      : reject(new Error(redactSecrets(`${command} ${args.join(" ")} failed (${code})\n${stderr.slice(-4000)}\n${stdout.slice(-4000)}`))));
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  options.command = undefined;
  if (!options.dryRun) throw new Error("--dry-run is mandatory");
  for (const key of ["piBin", "provider", "model"]) if (!options[key]) throw new Error(`--${key} required`);
  await mkdir(options.reportsDir, { recursive: true });
  const resumed = options.resumeAfterWriter === "true";
  const prepared = resumed
    ? {
        candidatePath: path.join(options.reportsDir, "candidate.json"),
        candidate: JSON.parse(await readFile(path.join(options.reportsDir, "candidate.json"), "utf8")),
      }
    : await prepare(options);
  const { candidate, candidatePath } = prepared;
  const agentOptions = {
    piBin: options.piBin, provider: options.provider, model: options.model,
    targetRepo: options.targetRepo, candidatePath, reportsDir: options.reportsDir,
  };
  if (resumed) await runPiInvocations({ ...agentOptions, roles: ["fidelity", "japanese-editorial", "contract"] });
  else await runReviewCycle(agentOptions);
  const generation = JSON.parse(await readFile(path.join(options.reportsDir, "generation-report.json"), "utf8"));
  await validateGeneratedPublication(candidate, generation, options.targetRepo);
  const validationCommands = [
    ["npm", ["run", "test:ci"]],
    [path.join(options.targetRepo, "node_modules/.bin/next"), ["build"]],
  ];
  const results = [{ command: "generated-publication-contract", code: 0, stdout: "passed" }];
  for (const [command, args] of validationCommands) results.push(await run(command, args, options.targetRepo));
  const validation = {
    schemaVersion: SCHEMA_VERSION, artifactType: "validation-results",
    runId: candidate.runId, sourceId: candidate.sourceId, results,
    browser: { status: "not-run", reason: "browser parity is a separate post-generation gate in the local pilot" },
  };
  validateArtifact("validation-results", validation);
  await writeFile(path.join(options.reportsDir, "validation-results.json"), `${JSON.stringify(validation, null, 2)}\n`, { mode: 0o600 });
  await runBrowserQa({ targetRepo: options.targetRepo, candidate, reportsDir: options.reportsDir, port: Number(options.port || 43129) });
  const summary = await finalize({ reportsDir: options.reportsDir });
  process.stdout.write(`${JSON.stringify(summary)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({ event: "failed", message: redactSecrets(error.message) })}\n`);
  process.exitCode = 1;
});
