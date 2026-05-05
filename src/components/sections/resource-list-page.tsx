import type { ResourceItem } from "@/content/resources";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
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

type ResourceListPageProps = {
  title: string;
  description: string;
  activeCategory: string;
  items: readonly ResourceItem[];
  initialVisibleCount?: number;
  sidebarBasePath?: string;
};

const sidebarLinks = [
  { label: "全て", href: "/resources", key: "resources" },
  { label: "紹介資料", href: "/introduction-deck", key: "introduction-deck" },
  { label: "用語集", href: "/glossary", key: "glossary" },
  { label: "マニュアル", href: "/manuals", key: "manuals" },
  { label: "ホワイトペーパー", href: "/whitepapers", key: "whitepaper" },
  { label: "ブログ", href: "/blog", key: "blog" },
] as const;

export function ResourceListPage({
  title,
  description,
  activeCategory,
  items,
  initialVisibleCount,
  sidebarBasePath = "",
}: ResourceListPageProps) {
  const categoryLinks: ResourceCategoryLink[] = sidebarLinks.map((link) => ({
    label: link.label,
    href: `${sidebarBasePath}${link.href}`,
    active: link.key === activeCategory,
  }));

  return (
    <>
      <ResourceListHeroSection>
        <ResourceListHeroTitle>{title}</ResourceListHeroTitle>
        <ResourceListHeroDescription>{description}</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceListSidebar>
          <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
          <ResourceListSidebarViewport>
            <ResourceListSidebarNav label="Sidebar Navigation">
              <ResourceListSidebarList>
                {categoryLinks.map((link) => (
                  <ResourceListSidebarItem key={link.label}>
                    <ResourceListSidebarLink href={link.href} active={link.active} label={link.label}>
                      {link.label}
                    </ResourceListSidebarLink>
                  </ResourceListSidebarItem>
                ))}
              </ResourceListSidebarList>
            </ResourceListSidebarNav>
          </ResourceListSidebarViewport>
        </ResourceListSidebar>

        {typeof initialVisibleCount === "number" ? (
          <ResourceListLoadMore
            key={`${activeCategory}:${initialVisibleCount}`}
            items={items}
            initialVisibleCount={initialVisibleCount}
          />
        ) : (
          <ResourceListItems items={items} />
        )}
      </ResourceListContentSection>
    </>
  );
}
