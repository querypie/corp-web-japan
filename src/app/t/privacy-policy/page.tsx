import type { Metadata } from "next";
import { PrivacyPolicyDocumentPage, generatePrivacyPolicyMetadata } from "./privacy-policy-document";
import { getLatestPrivacyPolicySlug } from "./privacy-policy-sources";

export async function generateMetadata(): Promise<Metadata> {
  const latestSlug = await getLatestPrivacyPolicySlug();

  if (!latestSlug) {
    throw new Error("No privacy policy versions found in src/content/privacy-policy");
  }

  return generatePrivacyPolicyMetadata({
    canonicalPath: "/t/privacy-policy",
    slug: latestSlug,
  });
}

export default async function PreviewPrivacyPolicyPage() {
  const latestSlug = await getLatestPrivacyPolicySlug();

  if (!latestSlug) {
    throw new Error("No privacy policy versions found in src/content/privacy-policy");
  }

  return <PrivacyPolicyDocumentPage slug={latestSlug} />;
}
