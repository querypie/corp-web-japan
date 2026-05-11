import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import { getManualPublicationHref, getManualPublicationPost, getManualPublicationRecordById, listManualPublicationParamsByCategory } from "@/lib/resources/manual-post-loader";

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

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: getManualPublicationHref(id, record.slug),
    },
    robots: {
      index: true,
      follow: true,
    },
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
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
