import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getEventPublicationHref,
  getEventPublicationPost,
  getEventPublicationRecord,
  listEventPublicationParams,
} from "@/lib/publications/events/get-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";
import { absoluteUrl } from "@/lib/site-url";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listEventPublicationParams();
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getEventPublicationRecord(id);

  if (!record) {
    return {};
  }

  if (record.redirectUrl) {
    return {
      title: record.title + " | QueryPie AI",
      description: record.description,
      alternates: {
        canonical: absoluteUrl(getEventPublicationHref(id, record.slug)),
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: record.title + " | QueryPie AI",
    description: record.description,
    alternates: {
      canonical: absoluteUrl(getEventPublicationHref(id, record.slug)),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id, slug } = await params;
  const record = getEventPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getEventPublicationHref(id, record.slug));
  }

  const post = await getEventPublicationPost(id);

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
