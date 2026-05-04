import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getDocumentationPublicationHref,
  getDocumentationPublicationPost,
  getDocumentationPublicationRecordById,
  listDocumentationPublicationParamsByCategory,
} from "@/lib/get-documentation-publication-post";

type DocumentationPreviewDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listDocumentationPublicationParamsByCategory("glossary");
}

export async function generateMetadata({ params }: DocumentationPreviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getDocumentationPublicationRecordById("glossary", id);

  if (!record) {
    return {};
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: getDocumentationPublicationHref("glossary", id, record.slug),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function GlossaryDetailPage({ params }: DocumentationPreviewDetailPageProps) {
  const { id, slug } = await params;
  const record = getDocumentationPublicationRecordById("glossary", id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getDocumentationPublicationHref("glossary", id, record.slug));
  }

  const post = await getDocumentationPublicationPost("glossary", id);
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
