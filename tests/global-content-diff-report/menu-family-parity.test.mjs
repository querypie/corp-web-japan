import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { assertMenuFamilyParity } from "../../scripts/global-content-diff-report/menu-family-parity.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-content-diff-report/source-family-map.mjs";

async function withParityRepos(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), "global-menu-family-parity-"));
  const globalRepo = path.join(root, "global");
  const targetRepo = path.join(root, "japan");
  const globalConfig = SOURCE_FAMILIES
    .map(({ sourceCategory, globalMenuPath }) => `${JSON.stringify(sourceCategory)}: ${JSON.stringify(globalMenuPath)},`)
    .join("\n");
  const japanHeader = SOURCE_FAMILIES
    .map(({ japanMenuPath }) => `{ label: "Fixture", href: ${JSON.stringify(japanMenuPath)} },`)
    .join("\n");
  await mkdir(path.join(globalRepo, "src/features/content"), { recursive: true });
  await mkdir(path.join(targetRepo, "src/components/layout"), { recursive: true });
  await writeFile(path.join(globalRepo, "src/features/content/publicPathConfig.ts"), globalConfig);
  await writeFile(path.join(targetRepo, "src/components/layout/site-header-client.tsx"), japanHeader);
  await Promise.all([...new Set(SOURCE_FAMILIES.map(({ targetFamily }) => targetFamily))]
    .map((family) => mkdir(path.join(targetRepo, "src/content", family), { recursive: true })));
  try {
    await run({ globalRepo, targetRepo, globalConfig, japanHeader });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("accepts complete latest Global/Japan menu and target-family parity", async () => {
  await withParityRepos(async ({ globalRepo, targetRepo }) => {
    await assert.doesNotReject(() => assertMenuFamilyParity(globalRepo, targetRepo));
  });
});

test("fails closed when latest Global menu adds an unmapped content family", async () => {
  await withParityRepos(async ({ globalRepo, targetRepo, globalConfig }) => {
    await writeFile(
      path.join(globalRepo, "src/features/content/publicPathConfig.ts"),
      `${globalConfig}\n"new-family": "/demo/new-family",\n`,
    );
    await assert.rejects(
      () => assertMenuFamilyParity(globalRepo, targetRepo),
      /unmapped Global public content menu path: \/demo\/new-family/,
    );
  });
});

test("fails closed when a Japan menu path or target root is missing", async () => {
  await withParityRepos(async ({ globalRepo, targetRepo, japanHeader }) => {
    await writeFile(
      path.join(targetRepo, "src/components/layout/site-header-client.tsx"),
      japanHeader.replace('{ label: "Fixture", href: "/demo/acp" },', ""),
    );
    await assert.rejects(
      () => assertMenuFamilyParity(globalRepo, targetRepo),
      /Japan public menu missing target path: \/demo\/acp/,
    );
  });
});
