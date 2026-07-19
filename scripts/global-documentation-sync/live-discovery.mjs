import { spawnSync } from "node:child_process";

import { discoverNextCandidate } from "./discovery.mjs";
import { fetchTextWithRetry } from "./fetch-retry.mjs";
import { loadAllPullRequests } from "./github-state.mjs";

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", maxBuffer: 100_000_000 });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

export async function discoverLive({ globalRepo, targetRepo, githubRepo = "querypie/corp-web-japan", fetchText = fetchTextWithRetry, execute = run }) {
  const [sitemapXml, documentationListHtml] = await Promise.all([
    fetchText("https://www.querypie.com/sitemap.xml"),
    fetchText("https://www.querypie.com/en/documentation"),
  ]);
  const prRecords = await loadAllPullRequests({ githubRepo, cwd: targetRepo, execute });
  const branchOutput = execute("git", ["ls-remote", "--heads", "origin", "refs/heads/content-sync/*"], targetRepo);
  const branchNames = branchOutput.split("\n").filter(Boolean).map((line) => line.split("refs/heads/")[1]).filter(Boolean);
  return discoverNextCandidate({ globalRepo, targetRepo, sitemapXml, documentationListHtml, prRecords, branchNames });
}
