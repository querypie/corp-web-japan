import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listBlogPublicationItems } from "@/lib/publications/blog/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "Internal Load More | QueryPie AI",
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
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>Internal Load More</ResourceListHeroTitle>
        <ResourceListHeroDescription>既存の blog / whitepapers の公開リスト動作は変えずに、共通 Resource list UI の load-more ボタンだけを internal route で確認するためのデモページです。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="ブログ" />

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

