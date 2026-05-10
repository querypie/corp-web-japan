import type { Metadata } from "next";
import { PrivacyPolicyDocumentPage, generatePrivacyPolicyMetadata } from "./privacy-policy-document";
import { LATEST_PRIVACY_POLICY_VERSION } from "./privacy-policy-versions";

export async function generateMetadata(): Promise<Metadata> {
  return generatePrivacyPolicyMetadata({
    canonicalPath: "/t/privacy-policy",
    slug: LATEST_PRIVACY_POLICY_VERSION.slug,
  });
}

export default async function PreviewPrivacyPolicyPage() {
  return <PrivacyPolicyDocumentPage slug={LATEST_PRIVACY_POLICY_VERSION.slug} />;
}
