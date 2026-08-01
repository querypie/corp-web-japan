import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { SiteNoticeSurface } from "@/components/sections/site-notice/site-notice-surface";
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
  title: "リソース | QueryPie AI",
  description:
    "QueryPie AIの紹介資料、用語集、マニュアル、ホワイトペーパー、ブログをまとめたリソース一覧です。導入・活用に必要な情報を目的別に確認できます。",
  alternates: {
    canonical: "/resources",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

type ResourcesPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const [items, resolvedSearchParams] = await Promise.all([listResourcePreviewItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(items, resolvedSearchParams?.until);

  return (
    <main {...componentNameDebugProps("ResourcesPage")} className="relative bg-white text-slate-950">
      <SiteHeader />
      <SiteNoticeSurface />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>リソース</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          QueryPie AIの製品・サービスを理解し、導入・活用を進めるための情報をまとめています。
          紹介資料、用語集、マニュアル、ホワイトペーパー、ブログから、目的に合うコンテンツをお探しください。
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
