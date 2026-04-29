import { existsSync, readFileSync } from "node:fs";

export function readSource(relativePath) {
  return readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");
}

export function sourceExists(relativePath) {
  return existsSync(new URL(`../../${relativePath}`, import.meta.url));
}

export function readFirstExistingSource(relativePaths) {
  for (const relativePath of relativePaths) {
    if (sourceExists(relativePath)) {
      return readSource(relativePath);
    }
  }

  throw new Error(`None of the candidate source files exist: ${relativePaths.join(", ")}`);
}
