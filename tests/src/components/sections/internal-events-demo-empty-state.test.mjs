import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoEmptyState renders a sharp-corner bordered box with corner-to-corner diagonal X lines", () => {
  const file = "src/components/sections/internal-events-demo-empty-state.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/internal-events-demo-empty-state.tsx", import.meta.url)), true);
  assert.match(source, /min-h-\[240px\]/);
  assert.match(source, /overflow-hidden border bg-white/);
  assert.doesNotMatch(source, /rounded-lg/);
  assert.match(source, /borderColor: "#f4efe6"/);
  assert.match(source, /<svg className="pointer-events-none absolute inset-0 h-full w-full"/);
  assert.match(source, /<line x1="0" y1="0" x2="100" y2="100" stroke="#f4efe6" strokeWidth="1"/);
  assert.match(source, /<line x1="100" y1="0" x2="0" y2="100" stroke="#f4efe6" strokeWidth="1"/);
  assert.match(source, /vectorEffect="non-scaling-stroke"/);
  assert.match(source, /bg-white\/88/);
  assert.match(source, /現在予定されているイベントはありません。/);
  assert.match(source, /最新のお知らせをお待ちください。業界リーダーのインサイトや技術セミナーの日程はまもなく更新される予定です。/);
});
