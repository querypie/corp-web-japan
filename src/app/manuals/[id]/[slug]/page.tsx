import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  buildPublicationOpenGraphMetadata,
  resolvePublicationOpenGraphImageSrc,
} from "@/lib/publications/metadata";
import { getManualPublicationHref, getManualPublicationPost, getManualPublicationRecordById, listManualPublicationParamsByCategory } from "@/lib/resources/manual-post-loader";
import { absoluteUrl } from "@/lib/site-url";
import { getRequestDeployedSiteUrl } from "@/lib/site-url.server";

type ManualsDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listManualPublicationParamsByCategory();
}

export async function generateMetadata({ params }: ManualsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getManualPublicationRecordById(id);

  if (!record) {
    return {};
  }

  const title = `${record.title} | QueryPie AI`;
  const canonicalUrl = absoluteUrl(getManualPublicationHref(id, record.slug), await getRequestDeployedSiteUrl());

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

export default async function ManualsDetailPage({ params }: ManualsDetailPageProps) {
  const { id, slug } = await params;
  const record = getManualPublicationRecordById(id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getManualPublicationHref(id, record.slug));
  }

  const post = await getManualPublicationPost(id);
  if (!post) {
    notFound();
  }

  return (
    <main {...componentNameDebugProps("ManualPostPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
