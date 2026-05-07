import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("resource list section exports shared heading primitives for route-authored list subsections", () => {
  const file = "src/components/sections/resource-list-section.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/resource-list-section.tsx", import.meta.url)), true);
  assert.match(source, /export function ResourceListSectionHeading\(/);
  assert.match(source, /export function ResourceListSectionEyebrow\(/);
  assert.match(source, /export function ResourceListSectionTitleRow\(/);
  assert.match(source, /export function ResourceListSectionTitle\(/);
  assert.match(source, /export function ResourceListSectionDescription\(/);
});
