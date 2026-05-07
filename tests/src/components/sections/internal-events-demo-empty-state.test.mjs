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
  assert.match(source, /현재 예정된 이벤트가 없습니다\./);
  assert.match(source, /새로운 소식을 기다려 주세요\. 업계 리더들의 인사이트와 기술 세미나 일정이 곧 업데이트될 예정입니다\./);
  assert.doesNotMatch(source, /Event showcase is being prepared/);
  assert.doesNotMatch(source, /Next Webinar/);
});
