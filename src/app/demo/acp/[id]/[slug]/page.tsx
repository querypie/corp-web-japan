import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getAcpDemoPublicationHref,
  getAcpDemoPublicationPost,
  getAcpDemoPublicationRecord,
  listAcpDemoPublicationParams,
} from "@/lib/publications/demo/acp/get-post";
import {
  buildPublicationOpenGraphMetadata,
  resolvePublicationOpenGraphImageSrc,
} from "@/lib/publications/metadata";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";
import { absoluteUrl } from "@/lib/site-url";

type AcpDemoDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listAcpDemoPublicationParams();
}

export async function generateMetadata({ params }: AcpDemoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getAcpDemoPublicationRecord(id);

  if (!record) {
    return {};
  }

  const title = `${record.title} | QueryPie AI`;
  const canonicalUrl = absoluteUrl(getAcpDemoPublicationHref(id, record.slug));

  return {
    title,
    description: record.description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...buildPublicationOpenGraphMetadata({
      title,
      description: record.description,
      canonicalUrl,
      imageAlt: record.title,
      imageSrc: resolvePublicationOpenGraphImageSrc(record),
    }),
  };
}

export default async function AcpDemoDetailPage({ params }: AcpDemoDetailPageProps) {
  const { id, slug } = await params;
  const record = getAcpDemoPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getAcpDemoPublicationHref(id, record.slug));
  }

  const post = await getAcpDemoPublicationPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main {...componentNameDebugProps("AcpDemoPostPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
