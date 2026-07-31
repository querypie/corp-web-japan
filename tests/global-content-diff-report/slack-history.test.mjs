import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { deleteLastSlackSend, recordSlackSend } from "../../scripts/global-content-diff-report/slack-history.mjs";

test("records sends and deletes only the latest matching destination", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "global-content-slack-history-"));
  const file = path.join(root, "history.json");
  try {
    await recordSlackSend(file, {
      destination: "test",
      sentAt: "2026-07-31T03:00:00.000Z",
      messages: [{ channel: "C0123456789", ts: "1720000000.000100" }],
    });
    await recordSlackSend(file, {
      destination: "prod",
      sentAt: "2026-07-31T03:01:00.000Z",
      messages: [{ channel: "C9876543210", ts: "1720000001.000100" }],
    });

    const deleted = await deleteLastSlackSend(file, {
      destination: "test",
      botToken: "xoxb-test-token",
      deletedAt: "2026-07-31T03:02:00.000Z",
      fetchImpl: async (_url, request) => {
        assert.deepEqual(JSON.parse(request.body), { channel: "C0123456789", ts: "1720000000.000100" });
        return { ok: true, status: 200, json: async () => ({ ok: true }) };
      },
    });

    assert.equal(deleted.deletedAt, "2026-07-31T03:02:00.000Z");
    const history = JSON.parse(await readFile(file, "utf8"));
    assert.equal(history[0].deletedAt, "2026-07-31T03:02:00.000Z");
    assert.equal(history[1].deletedAt, undefined);
    await assert.rejects(
      () => deleteLastSlackSend(file, { destination: "test", botToken: "xoxb-test-token" }),
      /No deletable test Slack message found/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
