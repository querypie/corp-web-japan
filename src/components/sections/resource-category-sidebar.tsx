import {
  ResourceListSidebar,
  ResourceListSidebarItem,
  ResourceListSidebarLabel,
  ResourceListSidebarLink,
  ResourceListSidebarList,
  ResourceListSidebarNav,
  ResourceListSidebarViewport,
  type ResourceCategoryLink,
} from "@/components/sections/resource-list-section";

export const resourceCategorySidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "全て", href: "/resources" },
  { label: "紹介資料", href: "/introduction-deck" },
  { label: "用語集", href: "/glossary" },
  { label: "マニュアル", href: "/manuals" },
  { label: "ホワイトペーパー", href: "/whitepapers" },
  { label: "ブログ", href: "/blog" },
] as const;

type ResourceCategorySidebarProps = {
  activeLabel?: (typeof resourceCategorySidebarLinks)[number]["label"];
};

export function ResourceCategorySidebar({ activeLabel }: ResourceCategorySidebarProps) {
  return (
    <ResourceListSidebar>
      <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
      <ResourceListSidebarViewport>
        <ResourceListSidebarNav label="Sidebar Navigation">
          <ResourceListSidebarList>
            {resourceCategorySidebarLinks.map((link) => (
              <ResourceListSidebarItem key={link.label}>
                <ResourceListSidebarLink href={link.href} active={link.label === activeLabel} label={link.label}>
                  {link.label}
                </ResourceListSidebarLink>
              </ResourceListSidebarItem>
            ))}
          </ResourceListSidebarList>
        </ResourceListSidebarNav>
      </ResourceListSidebarViewport>
    </ResourceListSidebar>
  );
}
