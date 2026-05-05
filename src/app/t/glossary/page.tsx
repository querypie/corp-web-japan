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
import { listGlossaryPublicationItems } from "@/lib/resources/glossary-publications";

export const metadata: Metadata = {
  title: "用語集 | QueryPie AI",
  description: "QueryPie AI の主要セキュリティ・AI用語を local MDX detail route で確認できる preview 一覧です。",
  alternates: {
    canonical: "/t/glossary",
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

export default function PreviewGlossaryPage() {
  const items = listGlossaryPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>用語集</ResourceListHeroTitle>
        <ResourceListHeroDescription>corp-web-contents の glossary-items source を local MDX detail route として移設した preview 一覧です。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceListSidebar>
          <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
          <ResourceListSidebarViewport>
            <ResourceListSidebarNav label="Sidebar Navigation">
              <ResourceListSidebarList>
                {sidebarLinks.map((link) => (
                  <ResourceListSidebarItem key={link.label}>
                    <ResourceListSidebarLink href={link.href} active={link.label === "用語集"} label={link.label}>
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
