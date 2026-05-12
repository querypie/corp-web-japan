import { existsSync, readFileSync } from "node:fs";

export function repoUrl(relativePath) {
  return new URL(`../../${relativePath}`, import.meta.url);
}

export function readSource(relativePath) {
  return readFileSync(repoUrl(relativePath), "utf8");
}

export function sourceExists(relativePath) {
  return existsSync(repoUrl(relativePath));
}

export function readRepoText(relativePath) {
  return readFileSync(repoUrl(relativePath), "utf8");
}

export function repoExists(relativePath) {
  return existsSync(repoUrl(relativePath));
}

export function readFirstExistingSource(relativePaths) {
  for (const relativePath of relativePaths) {
    if (sourceExists(relativePath)) {
      return readSource(relativePath);
    }
  }

  throw new Error(`None of the candidate source files exist: ${relativePaths.join(", ")}`);
}
