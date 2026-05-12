import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRootUrl = new URL("../../", import.meta.url);

export function sourceUrl(relativePath) {
  return new URL(relativePath, repoRootUrl);
}

export function sourcePath(relativePath) {
  return fileURLToPath(sourceUrl(relativePath));
}

export function readSource(relativePath) {
  return readFileSync(sourcePath(relativePath), "utf8");
}

export function sourceExists(relativePath) {
  return existsSync(sourcePath(relativePath));
}

export function readFirstExistingSource(relativePaths) {
  for (const relativePath of relativePaths) {
    if (sourceExists(relativePath)) {
      return readSource(relativePath);
    }
  }

  throw new Error(`None of the candidate source files exist: ${relativePaths.join(", ")}`);
}
