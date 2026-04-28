import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/PublicationPostPage";
import {
  getEventPost,
  getEventPostCanonicalHref,
  getEventPostRecord,
  listEventPostParams,
} from "@/lib/resource-posts";
import { absoluteUrl } from "@/lib/site-url";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listEventPostParams();
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getEventPostRecord(id);

  if (!record) {
    return {};
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: absoluteUrl(getEventPostCanonicalHref(id, record.slug)),
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id, slug } = await params;
  const record = getEventPostRecord(id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getEventPostCanonicalHref(id, record.slug));
  }

  const post = getEventPost(id, slug);

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
