import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import { getGlossaryPublicationHref, getGlossaryPublicationPost, getGlossaryPublicationRecordById, listGlossaryPublicationParamsByCategory } from "@/lib/resources/glossary-post-loader";

type GlossaryDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listGlossaryPublicationParamsByCategory();
}

export async function generateMetadata({ params }: GlossaryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getGlossaryPublicationRecordById(id);

  if (!record) {
    return {};
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: getGlossaryPublicationHref(id, record.slug),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GlossaryDetailPage({ params }: GlossaryDetailPageProps) {
  const { id, slug } = await params;
  const record = getGlossaryPublicationRecordById(id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getGlossaryPublicationHref(id, record.slug));
  }

  const post = await getGlossaryPublicationPost(id);
  if (!post) {
    notFound();
  }

  return (
    <main {...componentNameDebugProps("GlossaryPostPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
