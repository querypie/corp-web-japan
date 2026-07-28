import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { buildGlobalOnlyReport } from "./report.mjs";
import { buildSlackPayloads, sendSlackPayloads } from "./slack.mjs";
import { fetchTextWithRetry } from "../global-documentation-sync/fetch-retry.mjs";
import { loadAllPullRequests } from "../global-documentation-sync/github-state.mjs";
import { SOURCE_FAMILIES } from "../global-documentation-sync/source-family-map.mjs";

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

async function loadProductionInputs(fetchText) {
  const listUrls = [...new Set(SOURCE_FAMILIES.map(({ productionListUrl }) => productionListUrl))];
  const [sitemapXml, ...listBodies] = await Promise.all([
    fetchText("https://www.querypie.com/sitemap.xml"),
    ...listUrls.map((url) => fetchText(url)),
  ]);

  return {
    sitemapXml,
    productionListHtmlByUrl: Object.fromEntries(listUrls.map((url, index) => [url, listBodies[index]])),
  };
}

export async function runCli(argv = process.argv.slice(2), {
  fetchText = fetchTextWithRetry,
  loadPullRequests = loadAllPullRequests,
  execute = defaultExecute,
  sendSlack = sendSlackPayloads,
  stdout = process.stdout,
  env = process.env,
  githubRepo = "querypie/corp-web-japan",
  now = new Date().toISOString(),
} = {}) {
  const options = parseArgs(argv);
  const { sitemapXml, productionListHtmlByUrl } = await loadProductionInputs(fetchText);
  const prRecords = await loadPullRequests({ githubRepo, cwd: options.targetRepo, execute });
  const metadata = {
    globalSha: gitHeadSha(options.globalRepo, execute),
    japanSha: gitHeadSha(options.targetRepo, execute),
  };
  const report = await buildGlobalOnlyReport({
    globalRepo: options.globalRepo,
    targetRepo: options.targetRepo,
    sitemapXml,
    productionListHtmlByUrl,
    prRecords,
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

  if (!env.GH_TOKEN) throw new Error("GH_TOKEN is required unless --dry-run is set");
  if (!env.GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL) {
    throw new Error("GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL is required unless --dry-run is set");
  }

  await sendSlack({
    webhookUrl: env.GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL,
    payloads,
  });

  const output = {
    mode: "send",
    metadata,
    report,
    payloadsSent: payloads.length,
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
