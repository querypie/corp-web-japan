import { spawnSync } from "node:child_process";
import { filesForGroup, testGroupOrder } from "./test-groups.mjs";

const requestedGroup = process.argv[2];

if (!requestedGroup) {
  console.error(`Usage: node scripts/ci/run-node-tests.mjs <${['all', ...testGroupOrder].join('|')}>`);
  process.exit(1);
}

const runGroup = (groupName) => {
  const files = filesForGroup(groupName);

  if (files.length === 0) {
    console.log(`No tests matched group: ${groupName}`);
    return;
  }

  console.log(`Running ${groupName} tests (${files.length} files)`);
  const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

if (requestedGroup === 'all') {
  for (const groupName of testGroupOrder) {
    runGroup(groupName);
  }
  process.exit(0);
}

if (!testGroupOrder.includes(requestedGroup)) {
  console.error(`Unknown test group: ${requestedGroup}`);
  process.exit(1);
}

runGroup(requestedGroup);
