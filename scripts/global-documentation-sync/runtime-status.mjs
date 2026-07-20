import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export async function updateRunStatus({ reportsDir, runId, sourceId, stage, state = "running", ...details }) {
  const file = path.join(reportsDir, "run-status.json");
  let previous = {};
  try { previous = JSON.parse(await readFile(file, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const value = {
    runId, sourceId: sourceId || previous.sourceId || null, state, stage,
    startedAt: previous.startedAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    ...details,
  };
  await mkdir(reportsDir, { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, file);
  process.stdout.write(`${JSON.stringify({ event: "run_status", ...value })}\n`);
  return value;
}
