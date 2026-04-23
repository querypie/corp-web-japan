export const siteUrl = new URL("https://querypie.ai");

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
