import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import { PublicResourceSidebar } from "@/components/sections/resource-list-public-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "Internal Load More Demo | QueryPie AI",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/internal/load-more",
  },
};

type InternalLoadMorePageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function InternalLoadMorePage({ searchParams }: InternalLoadMorePageProps) {
  const [blogItems, resolvedSearchParams] = await Promise.all([listBlogPublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(blogItems, resolvedSearchParams?.until);

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>Internal Load More Demo</ResourceListHeroTitle>
        <ResourceListHeroDescription>既存の blog / whitepapers の公開リスト動作は変えずに、共通 Resource list UI の load-more ボタンだけを internal route で確認するためのデモページです。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <PublicResourceSidebar activeLabel="ブログ" />

        <ResourceListLoadMore
          key={`blog:${initialVisibleCount}`}
          items={blogItems}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
