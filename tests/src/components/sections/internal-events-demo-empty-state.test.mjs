import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoEmptyState renders the provided no-upcoming-event hero design", () => {
  const file = "src/components/sections/internal-events-demo-empty-state.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/internal-events-demo-empty-state.tsx", import.meta.url)), true);
  assert.match(source, /min-h-\[400px\]/);
  assert.match(source, /border-b border-slate-100 bg-white/);
  assert.match(source, /<svg viewBox="0 0 24 24"/);
  assert.match(source, /現在予定されているイベントはありません。/);
  assert.match(source, /最新のお知らせをお待ちください。業界リーダーのインサイトや技術セミナーの日程はまもなく更新される予定です。/);
  assert.doesNotMatch(source, /Event showcase is being prepared/);
  assert.doesNotMatch(source, /Next Webinar/);
});
