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

export const previewResourceCategorySidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "全て", href: "/t/resources" },
  { label: "紹介資料", href: "/t/introduction-deck" },
  { label: "用語集", href: "/t/glossary" },
  { label: "マニュアル", href: "/t/manuals" },
  { label: "ホワイトペーパー", href: "/t/whitepapers" },
  { label: "ブログ", href: "/t/blog" },
] as const;

type ResourceCategorySidebarProps = {
  activeLabel?: ResourceCategoryLink["label"];
  links?: readonly ResourceCategoryLink[];
};

export function ResourceCategorySidebar({ activeLabel, links = resourceCategorySidebarLinks }: ResourceCategorySidebarProps) {
  return (
    <ResourceListSidebar>
      <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
      <ResourceListSidebarViewport>
        <ResourceListSidebarNav label="Sidebar Navigation">
          <ResourceListSidebarList>
            {links.map((link) => (
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
