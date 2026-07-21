#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { runBrowserQa } from "./browser-qa.mjs";
import { finalize, parseArgs, prepare } from "./cli.mjs";
import { validateGeneratedPublication } from "./generated-validation.mjs";
import { SCHEMA_VERSION, validateArtifact } from "./lib.mjs";
import { runPiInvocations } from "./pi-runner.mjs";
import { redactSecrets } from "./redaction.mjs";
import { runReviewCycle } from "./review-cycle.mjs";
import { updateRunStatus } from "./runtime-status.mjs";
import { createValidationHome, runValidationCommand, validationEnvironment } from "./validation-env.mjs";

async function main() {
  const options = parseArgs(process.argv.slice(2));
  options.command = undefined;
  if (!options.dryRun) throw new Error("--dry-run is mandatory");
  for (const key of ["piBin", "provider", "model"]) if (!options[key]) throw new Error(`--${key} required`);
  await mkdir(options.reportsDir, { recursive: true });
  const status = (stage, state = "running", details = {}) => updateRunStatus({ reportsDir: options.reportsDir, runId: options.runId || "pending", stage, state, ...details });
  await status("prepare");
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
    onProcess: ({ role, attempt, state, pid }) => status("pi", state, { sourceId: candidate.sourceId, role, attempt, pid }),
  };
  await status("pi", "running", { sourceId: candidate.sourceId });
  if (resumed) await runPiInvocations({ ...agentOptions, roles: ["fidelity", "japanese-editorial", "contract"] });
  else await runReviewCycle(agentOptions);
  await status("generated-validation", "running", { sourceId: candidate.sourceId });
  const generation = JSON.parse(await readFile(path.join(options.reportsDir, "generation-report.json"), "utf8"));
  await validateGeneratedPublication(candidate, generation, options.targetRepo);
  const validationHome = await createValidationHome(options.reportsDir);
  const validationEnv = validationEnvironment(process.env, { home: validationHome });
  const validationCommands = [
    { command: "npm", args: ["run", "test:ci"], label: "validation-test-ci", stage: "test-ci" },
    { command: path.join(options.targetRepo, "node_modules/.bin/next"), args: ["build"], label: "validation-next-build", stage: "next-build" },
  ];
  const results = [{ command: "generated-publication-contract", code: 0, stdout: "passed" }];
  for (const { command, args, label, stage } of validationCommands) {
    await status(stage, "running", { sourceId: candidate.sourceId });
    results.push(await runValidationCommand({ command, args, cwd: options.targetRepo, env: validationEnv, reportsDir: options.reportsDir, label }));
  }
  const validation = {
    schemaVersion: SCHEMA_VERSION, artifactType: "validation-results",
    runId: candidate.runId, sourceId: candidate.sourceId, results,
    browser: { status: "not-run", reason: "browser parity is a separate post-generation gate in the local pilot" },
  };
  validateArtifact("validation-results", validation);
  await writeFile(path.join(options.reportsDir, "validation-results.json"), `${JSON.stringify(validation, null, 2)}\n`, { mode: 0o600 });
  await status("browser-qa", "running", { sourceId: candidate.sourceId });
  await runBrowserQa({ targetRepo: options.targetRepo, candidate, reportsDir: options.reportsDir, port: Number(options.port || 43129), env: validationEnv });
  const summary = await finalize({ reportsDir: options.reportsDir });
  await status("complete", "passed", { sourceId: candidate.sourceId });
  process.stdout.write(`${JSON.stringify(summary)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({ event: "failed", message: redactSecrets(error.message) })}\n`);
  process.exitCode = 1;
});
