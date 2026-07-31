import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { deleteLastSlackSend } from "./slack-history.mjs";

const destination = process.argv[2];
if (!new Set(["test", "prod"]).has(destination)) {
  throw new Error("Usage: npm run global-content:delete-last -- test|prod");
}

const commonGitDir = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8" }).trim();
const mainCheckout = path.dirname(commonGitDir);
const envText = await readFile(path.join(mainCheckout, ".env.local"), "utf8");
const env = Object.fromEntries(envText
  .split("\n")
  .filter((line) => line && !line.startsWith("#") && line.includes("="))
  .map((line) => {
    const separator = line.indexOf("=");
    return [line.slice(0, separator), line.slice(separator + 1)];
  }));

const entry = await deleteLastSlackSend(path.join(mainCheckout, ".tmp/global-content-slack-history.json"), {
  destination,
  botToken: env.GLOBAL_CONTENT_DIFF_SLACK_BOT_TOKEN,
});

process.stdout.write(`${JSON.stringify({ deleted: true, destination, messages: entry.messages })}\n`);
