import { spawnSync } from "node:child_process";

import { discoverNextCandidate } from "./discovery.mjs";
import { fetchTextWithRetry } from "./fetch-retry.mjs";
import { loadAllPullRequests } from "./github-state.mjs";
import { SOURCE_FAMILIES } from "./source-family-map.mjs";

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", maxBuffer: 100_000_000 });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

export async function discoverLive({ globalRepo, targetRepo, githubRepo = "querypie/corp-web-japan", fetchText = fetchTextWithRetry, execute = run }) {
  const listUrls = [...new Set(SOURCE_FAMILIES.map(({ productionListUrl }) => productionListUrl))];
  const [sitemapXml, ...listBodies] = await Promise.all([
    fetchText("https://www.querypie.com/sitemap.xml"),
    ...listUrls.map((url) => fetchText(url)),
  ]);
  const productionListHtmlByUrl = Object.fromEntries(listUrls.map((url, index) => [url, listBodies[index]]));
  const prRecords = await loadAllPullRequests({ githubRepo, cwd: targetRepo, execute });
  const branchOutput = execute("git", ["ls-remote", "--heads", "origin", "refs/heads/content-sync/*"], targetRepo);
  const branchNames = branchOutput.split("\n").filter(Boolean).map((line) => line.split("refs/heads/")[1]).filter(Boolean);
  return discoverNextCandidate({ globalRepo, targetRepo, sitemapXml, productionListHtmlByUrl, prRecords, branchNames });
}
