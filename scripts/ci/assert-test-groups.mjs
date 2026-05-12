import assert from "node:assert/strict";
import { allTestFiles, filesForGroup, matchingGroupsForFile, testGroupOrder } from "./test-groups.mjs";

const files = allTestFiles();
const perGroupCounts = Object.fromEntries(
  testGroupOrder.map((groupName) => [groupName, filesForGroup(groupName).length]),
);

const unassigned = [];
const overlapping = [];

for (const relativePath of files) {
  const groups = matchingGroupsForFile(relativePath);

  if (groups.length === 0) {
    unassigned.push(relativePath);
    continue;
  }

  if (groups.length > 1) {
    overlapping.push({ relativePath, groups });
  }
}

assert.equal(unassigned.length, 0, `Unassigned test files:\n${unassigned.join("\n")}`);
assert.equal(
  overlapping.length,
  0,
  `Overlapping test files:\n${overlapping
    .map(({ relativePath, groups }) => `${relativePath} -> ${groups.join(", ")}`)
    .join("\n")}`,
);

console.log(JSON.stringify({ total: files.length, perGroupCounts }, null, 2));
