import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("/events applies load-more only to the past-events list", () => {
  const source = readSource("src/app/events/page.tsx");

  assert.match(source, /resolveEventTimeline\(resolvedSearchParams\?\.asof\)/);
  assert.match(source, /resolveResourceListVisibleCount\(pastEvents, resolvedSearchParams\?\.until\)/);
  assert.match(source, /<ResourceListLoadMore[\s\S]*items=\{pastEvents\}[\s\S]*initialVisibleCount=\{initialVisibleCount\}/);
  assert.match(source, /key={`events:\$\{initialVisibleCount\}`}/);
  assert.doesNotMatch(source, /<ResourceListItems items=\{pastEvents\} \/>/);
});
