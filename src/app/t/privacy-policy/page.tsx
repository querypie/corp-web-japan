import type { Metadata } from "next";
import { PrivacyPolicyDocumentPage, generatePrivacyPolicyMetadata } from "@/components/sections/privacy-policy/document-page";
import { getLatestPrivacyPolicySlug } from "@/lib/privacy-policy/records";

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

export default async function PrivacyPolicyPage() {
  const latestSlug = await getLatestPrivacyPolicySlug();

  if (!latestSlug) {
    throw new Error("No privacy policy versions found in src/content/privacy-policy");
  }

  return <PrivacyPolicyDocumentPage slug={latestSlug} />;
}
