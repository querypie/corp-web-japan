import { readFile } from "node:fs/promises";

const legalMdxSourceCache = new Map<string, Promise<string>>();

export async function readCachedLegalMdxSource(sourcePath: string) {
  const cachedSource = legalMdxSourceCache.get(sourcePath);
  if (cachedSource) {
    return cachedSource;
  }

  const sourcePromise = readFile(sourcePath, "utf8").catch((error) => {
    legalMdxSourceCache.delete(sourcePath);
    throw error;
  });

  legalMdxSourceCache.set(sourcePath, sourcePromise);
  return sourcePromise;
}
