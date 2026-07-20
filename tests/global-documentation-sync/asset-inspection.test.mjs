import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { inspectOwnedAsset } from "../../scripts/global-documentation-sync/asset-inspection.mjs";

test("validates signatures and positive image dimensions", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "asset-inspect-"));
  const png = path.join(root, "image.png");
  await writeFile(png, Buffer.from("89504e470d0a1a0a0000000d49484452", "hex"));
  const result = await inspectOwnedAsset({ sourcePath: png, fileName: "image.png", bytes: 16, mime: "image/png" }, { probe: async () => ({ streams: [{ codec_type: "video", codec_name: "png", width: 1200, height: 675 }], format: { format_name: "png_pipe" } }) });
  assert.equal(result.width, 1200);
  assert.equal(result.height, 675);
});

test("rejects extension-signature mismatch, zero dimensions, and Git-host oversized files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "asset-reject-"));
  const pdf = path.join(root, "fake.pdf");
  await writeFile(pdf, "not a pdf");
  await assert.rejects(() => inspectOwnedAsset({ sourcePath: pdf, fileName: "fake.pdf", bytes: 9, mime: "application/pdf" }), /signature/);
  const png = path.join(root, "zero.png");
  await writeFile(png, Buffer.from("89504e470d0a1a0a", "hex"));
  await assert.rejects(() => inspectOwnedAsset({ sourcePath: png, fileName: "zero.png", bytes: 8, mime: "image/png" }, { probe: async () => ({ streams: [{ codec_type: "video", width: 0, height: 0 }] }) }), /dimensions/);
  await assert.rejects(() => inspectOwnedAsset({ sourcePath: png, fileName: "huge.png", bytes: 100 * 1024 * 1024 + 1, mime: "image/png" }, { probe: async () => ({ streams: [{ codec_type: "video", width: 1, height: 1 }] }) }), /100 MiB/);
});
