import { spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

function inside(root, child) {
  const relative = path.relative(path.resolve(root), path.resolve(child));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function validateTurbopackLayout({ turbopackRoot, targetRepo, worktreesRoot }) {
  if (!turbopackRoot || !inside(turbopackRoot, targetRepo) || !inside(turbopackRoot, worktreesRoot)) throw new Error("TURBOPACK_ROOT must contain both target checkout and worktrees root");
}

function git(repo, args) {
  const result = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git preflight failed for ${repo}: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function requireCleanCurrentMain(repo, label) {
  if (git(repo, ["status", "--porcelain"])) throw new Error(`${label} checkout must be clean`);
  if (git(repo, ["branch", "--show-current"]) !== "main") throw new Error(`${label} checkout must be on main`);
  const head = git(repo, ["rev-parse", "HEAD"]);
  const remoteMain = git(repo, ["rev-parse", "origin/main"]);
  if (head !== remoteMain) throw new Error(`${label} checkout must exactly match origin/main`);
}

export function resolvePlaywrightChromium(moduleNamespace) {
  const chromium = moduleNamespace.chromium || moduleNamespace.default?.chromium;
  if (!chromium?.executablePath) throw new Error("Playwright Chromium is unavailable");
  return chromium;
}

function requireCommand(command) {
  if (path.isAbsolute(command)) return access(command);
  const result = spawnSync("which", [command], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`required command is missing: ${command}`);
}

export async function runPreflight({ globalRepo, targetRepo, worktreesRoot, piBin, turbopackRoot = process.env.TURBOPACK_ROOT }) {
  validateTurbopackLayout({ turbopackRoot, targetRepo, worktreesRoot });
  await Promise.all([
    access(path.join(globalRepo, ".git")), access(path.join(targetRepo, ".git")),
    access(path.join(targetRepo, "node_modules/.bin/next")),
  ]);
  const playwrightPath = createRequire(path.join(targetRepo, "package.json")).resolve("playwright");
  await Promise.all(["git", "gh", "ffmpeg", "ffprobe", piBin].map(requireCommand));
  if (spawnSync("gh", ["auth", "status", "--hostname", "github.com"], { encoding: "utf8" }).status !== 0) throw new Error("GitHub CLI authentication is required");
  let chrome = process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : spawnSync("which", ["google-chrome"], { encoding: "utf8" }).stdout.trim() || spawnSync("which", ["chromium"], { encoding: "utf8" }).stdout.trim();
  if (!chrome) {
    const playwright = await import(pathToFileURL(playwrightPath).href);
    chrome = resolvePlaywrightChromium(playwright).executablePath();
  }
  if (!chrome) throw new Error("Chrome/Chromium is required for browser QA");
  await access(chrome);
  requireCleanCurrentMain(globalRepo, "Global source");
  requireCleanCurrentMain(targetRepo, "Japan target");
  return { status: "passed", turbopackRoot, chrome };
}
