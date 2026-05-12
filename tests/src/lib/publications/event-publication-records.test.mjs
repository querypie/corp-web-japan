import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

test("event publication records expose eventDate-aware timeline helpers and a dedicated internal events demo resolver", () => {
  const file = "src/lib/publications/events/records.ts";
  const source = readSource(file);

  assert.equal(sourceExists("src/lib/publications/events/records.ts"), true);
  assert.match(source, /eventDate\?: string;/);
  assert.match(source, /const EVENT_DATE_PATTERN = \/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\//);
  assert.match(source, /function parseIsoCalendarDate\(value: string\)/);
  assert.match(source, /function getCurrentJstDate\(\)/);
  assert.match(source, /function normalizeAsofDate\(/);
  assert.match(source, /function normalizeUpcomingMode\(/);
  assert.match(source, /return parsedDate\.toISOString\(\)\.slice\(0, 10\) === value \? value : null/);
  assert.match(source, /function getEffectiveEventDate\(/);
  assert.match(source, /function isUpcomingEvent\(/);
  assert.match(source, /function getVisibleEventRecords\(\)/);
  assert.match(source, /export function resolveEventTimeline\(/);
  assert.match(source, /export function resolveInternalEventsDemoState\(/);
  assert.match(source, /const normalizedCandidate = candidate \? parseIsoCalendarDate\(candidate\) : null/);
  assert.match(source, /if \(typeof eventDateValue === "string" && !parseIsoCalendarDate\(eventDateValue\)\)/);
  assert.match(source, /date: formatJapaneseDateFromIsoDate\(getEffectiveEventDate\(record\)\)/);
  assert.match(source, /return getEffectiveEventDate\(record\) >= asofDate/);
  assert.match(source, /const heroEvent = upcomingEvents\.at\(0\) \? getEventListItem\(upcomingEvents\.at\(0\)!\) : null/);
  assert.match(source, /const demoHeroEvent = visibleRecords\.at\(0\) \? getEventListItem\(visibleRecords\.at\(0\)!\) : null/);
  assert.match(source, /const showUpcomingEvent = demoHeroEvent \? normalizeUpcomingMode\(params\?\.upcoming\) === "show" : false/);
  assert.match(source, /const visiblePastEvents = demoHeroEvent \? pastEvents\.filter\(\(event\) => event\.id !== demoHeroEvent\.id\) : pastEvents/);
});
