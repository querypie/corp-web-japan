import { readdir } from "node:fs/promises";
import { join } from "node:path";

const PRIVACY_POLICY_CONTENT_DIR = join(process.cwd(), "src/content/privacy-policy");
const PRIVACY_POLICY_FILE_PATTERN = /^\d{4}-\d{2}-\d{2}\.mdx$/;

export async function listPrivacyPolicySlugs() {
  const entries = await readdir(PRIVACY_POLICY_CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && PRIVACY_POLICY_FILE_PATTERN.test(entry.name))
    .map((entry) => entry.name.replace(/\.mdx$/, ""))
    .sort()
    .reverse();
}

export async function getLatestPrivacyPolicySlug() {
  const slugs = await listPrivacyPolicySlugs();
  return slugs[0] ?? null;
}

export async function hasPrivacyPolicySlug(slug: string) {
  const slugs = await listPrivacyPolicySlugs();
  return slugs.includes(slug);
}
