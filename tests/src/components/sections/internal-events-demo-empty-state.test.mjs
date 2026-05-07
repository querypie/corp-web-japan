import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoEmptyState provides a prepared no-upcoming-event hero box", () => {
  const file = "src/components/sections/internal-events-demo-empty-state.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/internal-events-demo-empty-state.tsx", import.meta.url)), true);
  assert.match(source, /Coming Soon/);
  assert.match(source, /まだ予定されているイベント、カンファレンス、ウェビナーはありません。/);
  assert.match(source, /新しいイベントの公開準備中です。次回の開催情報が整い次第、このエリアにヒーローイベントとして表示されます。/);
  assert.match(source, /Event showcase is being prepared/);
  assert.match(source, /Next Webinar/);
  assert.match(source, /Registration/);
});
