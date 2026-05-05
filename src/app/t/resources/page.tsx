import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
  ResourceListSidebar,
  ResourceListSidebarItem,
  ResourceListSidebarLabel,
  ResourceListSidebarLink,
  ResourceListSidebarList,
  ResourceListSidebarNav,
  ResourceListSidebarViewport,
  type ResourceCategoryLink,
} from "@/components/sections/resource-list-section";
import { listResourcePreviewItems } from "@/lib/resources/resource-preview-items";

export const metadata: Metadata = {
  title: "ドキュメント | QueryPie AI",
  description:
    "corp-web-contents の documentation source と local MDX loader を元にした preview リソース一覧です。",
  alternates: {
    canonical: "/t/resources",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const sidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "全て", href: "/t/resources" },
  { label: "紹介資料", href: "/t/introduction-deck" },
  { label: "用語集", href: "/t/glossary" },
  { label: "マニュアル", href: "/t/manuals" },
  { label: "ホワイトペーパー", href: "/t/whitepapers" },
  { label: "ブログ", href: "/t/blog" },
] as const;

export default function PreviewResourcesPage() {
  const items = listResourcePreviewItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ドキュメント</ResourceListHeroTitle>
        <ResourceListHeroDescription>紹介資料、用語集、マニュアルに加えて、現在の日本向けホワイトペーパーとブログもまとめて確認できる preview リソース一覧です。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceListSidebar>
          <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
          <ResourceListSidebarViewport>
            <ResourceListSidebarNav label="Sidebar Navigation">
              <ResourceListSidebarList>
                {sidebarLinks.map((link) => (
                  <ResourceListSidebarItem key={link.label}>
                    <ResourceListSidebarLink href={link.href} active={link.label === "全て"} label={link.label}>
                      {link.label}
                    </ResourceListSidebarLink>
                  </ResourceListSidebarItem>
                ))}
              </ResourceListSidebarList>
            </ResourceListSidebarNav>
          </ResourceListSidebarViewport>
        </ResourceListSidebar>

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
