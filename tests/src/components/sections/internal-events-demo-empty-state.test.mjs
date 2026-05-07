import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoEmptyState renders a shorter bordered empty-state box with crossed diagonal background lines", () => {
  const file = "src/components/sections/internal-events-demo-empty-state.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/internal-events-demo-empty-state.tsx", import.meta.url)), true);
  assert.match(source, /min-h-\[240px\]/);
  assert.match(source, /rounded-lg border border-slate-200 bg-white/);
  assert.match(source, /linear-gradient\(45deg, transparent calc\(50% - 0\.5px\), #f4efe6/);
  assert.match(source, /linear-gradient\(-45deg, transparent calc\(50% - 0\.5px\), #f4efe6/);
  assert.match(source, /bg-white\/88/);
  assert.match(source, /<svg viewBox="0 0 24 24"/);
  assert.match(source, /現在予定されているイベントはありません。/);
  assert.match(source, /最新のお知らせをお待ちください。業界リーダーのインサイトや技術セミナーの日程はまもなく更新される予定です。/);
});
