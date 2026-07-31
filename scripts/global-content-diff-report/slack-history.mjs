import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { deleteSlackMessages } from "./slack.mjs";

async function readHistory(filePath) {
  try {
    const history = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(history)) throw new Error("Slack message history must be an array");
    return history;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeHistory(filePath, history) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(history, null, 2)}\n`, { mode: 0o600 });
  await rename(temporaryPath, filePath);
}

export async function recordSlackSend(filePath, { destination, messages, sentAt = new Date().toISOString() }) {
  const history = await readHistory(filePath);
  history.push({ destination, sentAt, messages });
  await writeHistory(filePath, history.slice(-100));
}

export async function deleteLastSlackSend(filePath, { destination, botToken, fetchImpl = fetch, deletedAt = new Date().toISOString() }) {
  const history = await readHistory(filePath);
  const index = history.findLastIndex((entry) => entry.destination === destination && !entry.deletedAt);
  if (index === -1) throw new Error(`No deletable ${destination} Slack message found`);
  await deleteSlackMessages({ botToken, messages: history[index].messages, fetchImpl });
  history[index].deletedAt = deletedAt;
  await writeHistory(filePath, history);
  return history[index];
}
