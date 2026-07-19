import { spawnSync } from "node:child_process";

function defaultExecute(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", maxBuffer: 100_000_000 });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

export async function loadAllPullRequests({ githubRepo, cwd, execute = defaultExecute }) {
  const output = await execute("gh", ["api", "--paginate", "--slurp", `repos/${githubRepo}/pulls?state=all&per_page=100`], cwd);
  const pages = JSON.parse(output);
  if (!Array.isArray(pages) || pages.some((page) => !Array.isArray(page))) throw new Error("GitHub paginated PR response must be an array of pages");
  return pages.flat().map((pull) => ({
    number: pull.number,
    state: pull.merged_at ? "MERGED" : String(pull.state).toUpperCase(),
    isDraft: pull.draft === true,
    body: pull.body || "",
    headRefName: pull.head?.ref || "",
    labels: pull.labels || [],
    url: pull.html_url || "",
  }));
}
