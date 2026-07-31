import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { assertSupportedSourceRoots, buildGlobalOnlyReport } from "./report.mjs";
import { recordSlackSend } from "./slack-history.mjs";
import { buildSlackPayloads, sendSlackPayloads } from "./slack.mjs";
import { fetchTextWithRetry } from "./fetch-retry.mjs";
import { loadProductionInputs, validateProductionInputs } from "./production-inputs.mjs";

function usage() {
  return [
    "Usage:",
    "  node scripts/global-content-diff-report/cli.mjs --global-repo /path/to/corp-web-v2 --target-repo /path/to/corp-web-japan [--dry-run]",
  ].join("\n");
}

function parseArgs(argv) {
  const options = { dryRun: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--global-repo" || arg === "--target-repo") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`missing value for ${arg}`);
      options[arg === "--global-repo" ? "globalRepo" : "targetRepo"] = value;
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  if (!options.globalRepo || !options.targetRepo) {
    throw new Error("--global-repo and --target-repo are required");
  }

  return options;
}

function defaultExecute(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", maxBuffer: 100_000_000 });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

function gitHeadSha(repo, execute) {
  return execute("git", ["rev-parse", "HEAD"], repo).trim();
}

export async function runCli(argv = process.argv.slice(2), {
  fetchText = fetchTextWithRetry,
  execute = defaultExecute,
  sendSlack = sendSlackPayloads,
  stdout = process.stdout,
  env = process.env,
  now = new Date().toISOString(),
} = {}) {
  const options = parseArgs(argv);
  await assertSupportedSourceRoots(options.globalRepo);
  const { sitemapXml, productionListHtmlByUrl } = await loadProductionInputs(fetchText);
  await validateProductionInputs(options.globalRepo, { sitemapXml, productionListHtmlByUrl });
  const metadata = {
    globalSha: gitHeadSha(options.globalRepo, execute),
    japanSha: gitHeadSha(options.targetRepo, execute),
  };
  const report = await buildGlobalOnlyReport({
    globalRepo: options.globalRepo,
    targetRepo: options.targetRepo,
    sitemapXml,
    productionListHtmlByUrl,
    now,
  });
  const payloads = buildSlackPayloads(report, metadata);

  if (options.dryRun) {
    const output = {
      mode: "dry-run",
      metadata,
      report,
      payloads,
    };
    stdout.write(`${JSON.stringify(output)}\n`);
    return output;
  }

  const destination = env.GLOBAL_CONTENT_DIFF_SLACK_DESTINATION;
  if (!new Set(["test", "prod"]).has(destination)) {
    throw new Error("GLOBAL_CONTENT_DIFF_SLACK_DESTINATION must be test or prod");
  }
  const channelId = destination === "test"
    ? env.GLOBAL_CONTENT_DIFF_TEST_SLACK_CHANNEL_ID
    : env.GLOBAL_CONTENT_DIFF_PROD_SLACK_CHANNEL_ID;
  const messages = await sendSlack({
    botToken: env.GLOBAL_CONTENT_DIFF_SLACK_BOT_TOKEN,
    channelId,
    payloads,
  });
  const commonGitDir = execute("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], options.targetRepo).trim();
  const historyFile = path.join(path.dirname(commonGitDir), ".tmp/global-content-slack-history.json");
  await recordSlackSend(historyFile, { destination, messages, sentAt: now });

  const output = {
    mode: "send",
    destination,
    metadata,
    report,
    payloadsSent: payloads.length,
    messages,
  };
  stdout.write(`${JSON.stringify(output)}\n`);
  return output;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  runCli().catch((error) => {
    process.stderr.write(`${error.message}\n\n${usage()}\n`);
    process.exitCode = 1;
  });
}
