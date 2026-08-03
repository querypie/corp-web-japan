import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { SOURCE_FAMILIES } from "./source-family-map.mjs";

const GLOBAL_MENU_CONFIG = "src/features/content/publicPathConfig.ts";
const JAPAN_MENU_CONFIG = "src/components/layout/site-header-client.tsx";
const GLOBAL_INDEX_PATHS = new Set(["/demo", "/documentation"]);

function quotedPaths(source) {
  return new Set([...source.matchAll(/:\s*["'](\/[^"']*)["']/g)].map((match) => match[1]));
}

async function assertDirectory(directory, message) {
  let value;
  try {
    value = await stat(directory);
  } catch (error) {
    if (error.code === "ENOENT") throw new Error(message);
    throw error;
  }
  if (!value.isDirectory()) throw new Error(message);
}

export async function assertMenuFamilyParity(globalRepo, targetRepo) {
  const [globalMenuSource, japanMenuSource] = await Promise.all([
    readFile(path.join(globalRepo, GLOBAL_MENU_CONFIG), "utf8"),
    readFile(path.join(targetRepo, JAPAN_MENU_CONFIG), "utf8"),
  ]);
  const globalMenuPaths = quotedPaths(globalMenuSource);
  const expectedGlobalPaths = new Set(SOURCE_FAMILIES.map(({ globalMenuPath }) => globalMenuPath));
  for (const configuredPath of globalMenuPaths) {
    if (!GLOBAL_INDEX_PATHS.has(configuredPath) && !expectedGlobalPaths.has(configuredPath)) {
      throw new Error(`unmapped Global public content menu path: ${configuredPath}`);
    }
  }
  for (const descriptor of SOURCE_FAMILIES) {
    if (!globalMenuPaths.has(descriptor.globalMenuPath)) {
      throw new Error(`Global public menu missing source path: ${descriptor.globalMenuPath}`);
    }
    const japanMenuPattern = new RegExp(`href:\\s*["']${descriptor.japanMenuPath.replaceAll("/", "\\/")}["']`);
    if (!japanMenuPattern.test(japanMenuSource)) {
      throw new Error(`Japan public menu missing target path: ${descriptor.japanMenuPath}`);
    }
    await assertDirectory(
      path.join(targetRepo, "src/content", descriptor.targetFamily),
      `Japan target root must be a directory: src/content/${descriptor.targetFamily}`,
    );
  }
}
