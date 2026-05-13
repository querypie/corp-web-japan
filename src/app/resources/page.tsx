import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  resourceCategorySidebarLinks,
  ResourceCategorySidebar,
} from "@/components/sections/resource-category-sidebar";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listResourcePreviewItems } from "@/lib/resources/resource-preview-items";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ドキュメント | QueryPie AI",
  description:
    "包括的なガイド、技術マニュアル、業界ホワイトペーパー、専門家ブログを一か所で確認できるリソース一覧です。",
  alternates: {
    canonical: "/resources",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type ResourcesPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const [items, resolvedSearchParams] = await Promise.all([listResourcePreviewItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(items, resolvedSearchParams?.until);

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ドキュメント</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={resourceCategorySidebarLinks} activeLabel="全て" />

        <ResourceListLoadMore
          key={`resources:${initialVisibleCount}`}
          items={items}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
