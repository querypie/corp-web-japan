import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { fetchTextWithRetry } from "./fetch-retry.mjs";
import { assessIgnoreEligibility, formatIgnoreEligibilityResult } from "./ignore-eligibility.mjs";
import { loadProductionInputs, validateProductionInputs } from "./production-inputs.mjs";
import { buildGlobalOnlyReport } from "./report.mjs";
import { validateDecisionManifest } from "./discovery.mjs";

function usage() {
  return "Usage: node scripts/global-content-diff-report/validate-ignore-pr.mjs --global-repo PATH --target-repo PATH --base-ignore PATH [--current-ignore PATH]";
}

function parseArgs(argv) {
  const options = {};
  const names = new Map([
    ["--global-repo", "globalRepo"],
    ["--target-repo", "targetRepo"],
    ["--base-ignore", "baseIgnorePath"],
    ["--current-ignore", "currentIgnorePath"],
    ["--report-envelope", "reportEnvelopePath"],
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const key = names.get(argv[index]);
    if (!key) throw new Error(`unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`missing value for ${argv[index]}`);
    options[key] = value;
    index += 1;
  }
  if (!options.targetRepo || !options.baseIgnorePath) throw new Error("--target-repo and --base-ignore are required");
  if (!options.reportEnvelopePath && !options.globalRepo) throw new Error("--global-repo is required without --report-envelope");
  return options;
}

function recordIdentity(record) {
  return `${record.sourceSection}:${record.sourceId}`;
}

function isActive(record, now) {
  return !record.expiresAt || Date.parse(record.expiresAt) > Date.parse(now);
}

export function addedActiveIgnoreRecords({ baseIgnoreRecords, currentIgnoreRecords, now }) {
  const base = validateDecisionManifest(baseIgnoreRecords, "ignore");
  const current = validateDecisionManifest(currentIgnoreRecords, "ignore");
  const activeBaseIdentities = new Set(base.filter((record) => isActive(record, now)).map(recordIdentity));
  const seen = new Set();
  const added = [];
  for (const record of current) {
    const identity = recordIdentity(record);
    if (seen.has(identity)) throw new Error(`ignore manifest has duplicate source identity: ${identity}`);
    seen.add(identity);
    if (!activeBaseIdentities.has(identity) && isActive(record, now)) added.push(record);
  }
  return added;
}

function defaultExecute(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

export async function runValidateIgnorePrCli(argv = process.argv.slice(2), {
  fetchText = fetchTextWithRetry,
  execute = defaultExecute,
  stdout = process.stdout,
  now = new Date().toISOString(),
} = {}) {
  const options = parseArgs(argv);
  const baseIgnoreRecords = await readJson(options.baseIgnorePath);
  const currentIgnoreRecords = await readJson(options.currentIgnorePath || `${options.targetRepo}/.github/content-sync/ignore.json`);
  const added = addedActiveIgnoreRecords({ baseIgnoreRecords, currentIgnoreRecords, now });

  let report;
  let metadata;
  if (options.reportEnvelopePath) {
    const envelope = await readJson(options.reportEnvelopePath);
    report = envelope.report;
    metadata = envelope.metadata;
  } else {
    const productionInputs = await loadProductionInputs(fetchText);
    await validateProductionInputs(options.globalRepo, productionInputs);
    report = await buildGlobalOnlyReport({
      globalRepo: options.globalRepo,
      targetRepo: options.targetRepo,
      ...productionInputs,
      ignoreRecords: baseIgnoreRecords,
      now,
    });
    metadata = {
      globalSha: execute("git", ["rev-parse", "HEAD"], options.globalRepo).trim(),
      japanSha: execute("git", ["rev-parse", "HEAD"], options.targetRepo).trim(),
    };
  }

  for (const record of added) {
    const sourceIdentity = recordIdentity(record);
    const result = assessIgnoreEligibility({ sourceIdentity, report, baseIgnoreRecords, now });
    const formatted = formatIgnoreEligibilityResult(result, metadata);
    stdout.write(`${formatted}\n`);
    if (!result.allowed) throw new Error(`Ignore manifest validation denied ${sourceIdentity}`);
  }
  stdout.write(`Validated ${added.length} newly added active Ignore row(s).\n`);
  return { added: added.map(recordIdentity), metadata };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  runValidateIgnorePrCli().catch((error) => {
    process.stderr.write(`${error.message}\n${usage()}\n`);
    process.exitCode = 1;
  });
}
