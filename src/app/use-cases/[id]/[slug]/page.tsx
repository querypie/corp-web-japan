import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getUseCasePublicationHref,
  getUseCasePublicationPost,
  getUseCasePublicationRecord,
  listUseCasePublicationParams,
} from "@/lib/publications/use-cases/get-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";
import { absoluteUrl } from "@/lib/site-url";

type UseCaseDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listUseCasePublicationParams();
}

export async function generateMetadata({ params }: UseCaseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getUseCasePublicationRecord(id);

  if (!record) {
    return {};
  }

  if (record.redirectUrl) {
    return {
      title: `${record.title} | QueryPie AI`,
      description: record.description,
      alternates: {
        canonical: absoluteUrl(getUseCasePublicationHref(id, record.slug)),
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: absoluteUrl(getUseCasePublicationHref(id, record.slug)),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function UseCaseDetailPage({ params }: UseCaseDetailPageProps) {
  const { id, slug } = await params;
  const record = getUseCasePublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getUseCasePublicationHref(id, record.slug));
  }

  const post = await getUseCasePublicationPost(id);

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
