import assert from "node:assert/strict";
import test from "node:test";

import { redactSecrets } from "../../scripts/global-documentation-sync/redaction.mjs";

test("redacts credentials and signed URL query values recursively", () => {
  const value = redactSecrets({ message: "Bearer abc123 ghp_abcdefghijklmnopqrstuvwxyz123456", url: "https://example.com/file?X-Amz-Signature=secret&token=abc&lang=ja" });
  assert.doesNotMatch(value.message, /abc123|ghp_/);
  assert.match(value.url, /X-Amz-Signature=REDACTED/);
  assert.match(value.url, /token=REDACTED/);
  assert.match(value.url, /lang=ja/);
});
