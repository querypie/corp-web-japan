import assert from "node:assert/strict";
import test from "node:test";

import { redactSecrets } from "../../scripts/global-documentation-sync/redaction.mjs";

test("redacts credentials and signed URL query values recursively", () => {
  const value = redactSecrets({
    message: "Bearer abc123 ghp_abcdefghijklmnopqrstuvwxyz123456 sk-proj-abcdefghijklmnopqrstuvwxyz123456",
    url: "https://example.com/file?X-Amz-Signature=secret&token=abc&lang=ja&api_key=raw&apikey=raw2&AUTHORIZATION=raw3&auth=raw4&password=raw5&secret=raw6&client_secret=raw7",
  });
  assert.doesNotMatch(value.message, /abc123|ghp_|sk-proj-/);
  assert.match(value.url, /X-Amz-Signature=REDACTED/);
  assert.match(value.url, /token=REDACTED/);
  assert.match(value.url, /api_key=REDACTED/);
  assert.match(value.url, /apikey=REDACTED/);
  assert.match(value.url, /AUTHORIZATION=REDACTED/);
  assert.match(value.url, /auth=REDACTED/);
  assert.match(value.url, /password=REDACTED/);
  assert.match(value.url, /secret=REDACTED/);
  assert.match(value.url, /client_secret=REDACTED/);
  assert.match(value.url, /lang=ja/);
});

test("redacts secret query values on hostile http URLs", () => {
  const value = redactSecrets({
    url: "http://evil.example/file?X-Goog-Signature=secret&access_token=abc&signature=raw&sig=raw2&expires=raw3&credential=raw4&key=raw5&ok=1",
  });

  assert.match(value.url, /^http:\/\//);
  assert.match(value.url, /X-Goog-Signature=REDACTED/);
  assert.match(value.url, /access_token=REDACTED/);
  assert.match(value.url, /signature=REDACTED/);
  assert.match(value.url, /sig=REDACTED/);
  assert.match(value.url, /expires=REDACTED/);
  assert.match(value.url, /credential=REDACTED/);
  assert.match(value.url, /key=REDACTED/);
  assert.match(value.url, /ok=1/);
});
