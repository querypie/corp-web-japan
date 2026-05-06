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

export const demoCategorySidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "活用事例", href: "/t/use-cases" },
  { label: "AIP機能", href: "/t/demo/aip" },
  { label: "ACP機能", href: "/t/demo/acp" },
] as const;

type DemoCategorySidebarProps = {
  activeLabel?: ResourceCategoryLink["label"];
  links?: readonly ResourceCategoryLink[];
};

export function DemoCategorySidebar({ activeLabel, links = demoCategorySidebarLinks }: DemoCategorySidebarProps) {
  return (
    <ResourceListSidebar>
      <ResourceListSidebarLabel>デモカテゴリー</ResourceListSidebarLabel>
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
