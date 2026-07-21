import { spawn } from "node:child_process";
import { readFile, stat, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { runBrowserQa } from "./browser-qa.mjs";
import { validateGeneratedPublication } from "./generated-validation.mjs";
import { SCHEMA_VERSION, validateArtifact } from "./lib.mjs";
import { createValidationHome, runValidationCommand, validationEnvironment } from "./validation-env.mjs";

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr = `${stderr}${chunk}`.slice(-4000); });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} failed (${code}): ${stderr}`)));
  });
}

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

export async function revalidateRemoteBranch({ baseRepo, branch, worktreesRoot, reportsDir, candidate, port = 43159 }) {
  if (!worktreesRoot) throw new Error("worktreesRoot required for branch revalidation");
  const worktree = path.join(worktreesRoot, `resume-${candidate.sourceId}-${Date.now()}`);
  await run("git", ["fetch", "origin", branch], baseRepo);
  await run("git", ["worktree", "add", "--detach", worktree, `origin/${branch}`], baseRepo);
  try {
    if (await exists(path.join(baseRepo, "node_modules"))) await symlink(path.join(baseRepo, "node_modules"), path.join(worktree, "node_modules"), "dir");
    const remapped = {
      ...candidate,
      targetMdxPath: path.join(worktree, "src/content", candidate.targetFamily, path.basename(candidate.targetMdxPath)),
      targetAssetRoot: path.join(worktree, "public", candidate.targetFamily, String(candidate.targetId)),
      heroImagePath: path.join(worktree, "public", candidate.targetFamily, String(candidate.targetId), "thumbnail.png"),
      assets: candidate.assets.map((asset) => ({ ...asset, targetPath: path.join(worktree, "public", candidate.targetFamily, String(candidate.targetId), path.basename(asset.targetPath)) })),
    };
    const generation = JSON.parse(await readFile(path.join(reportsDir, "generation-report.json"), "utf8"));
    await validateGeneratedPublication(remapped, generation, worktree);
    const validationHome = await createValidationHome(reportsDir);
    const validationEnv = validationEnvironment(process.env, { home: validationHome });
    await runValidationCommand({ command: "npm", args: ["run", "test:ci"], cwd: worktree, env: validationEnv, reportsDir, label: "resume-validation-test-ci" });
    await runValidationCommand({ command: path.join(worktree, "node_modules/.bin/next"), args: ["build"], cwd: worktree, env: validationEnv, reportsDir, label: "resume-validation-next-build" });
    const browser = await runBrowserQa({ targetRepo: worktree, candidate: remapped, reportsDir, port, env: validationEnv });
    const validation = {
      schemaVersion: SCHEMA_VERSION, artifactType: "validation-results", runId: candidate.runId, sourceId: candidate.sourceId,
      results: [
        { command: "generated-publication-contract", code: 0 },
        { command: "npm run test:ci", code: 0 },
        { command: `${path.join(worktree, "node_modules/.bin/next")} build`, code: 0 },
      ],
      browser: browser.results.map(({ viewport, status, findings }) => ({ viewport, status, findings })),
    };
    validateArtifact("validation-results", validation);
    await writeFile(path.join(reportsDir, "resume-validation-results.json"), `${JSON.stringify(validation, null, 2)}\n`, { mode: 0o600 });
    return validation;
  } finally {
    await run("git", ["worktree", "remove", "--force", worktree], baseRepo).catch(() => {});
  }
}
