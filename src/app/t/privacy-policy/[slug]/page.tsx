import type { Metadata } from "next";
import { PrivacyPolicyDocumentPage, generatePrivacyPolicyMetadata } from "@/components/sections/privacy-policy-document-page";
import { listPrivacyPolicySlugs } from "@/lib/privacy-policy/records";

type PrivacyPolicyVersionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await listPrivacyPolicySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PrivacyPolicyVersionPageProps): Promise<Metadata> {
  const { slug } = await params;

  return generatePrivacyPolicyMetadata({
    canonicalPath: `/t/privacy-policy/${slug}`,
    slug,
  });
}

export default async function PrivacyPolicyVersionPage({ params }: PrivacyPolicyVersionPageProps) {
  const { slug } = await params;

  return <PrivacyPolicyDocumentPage slug={slug} />;
}
