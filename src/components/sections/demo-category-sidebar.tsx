import { cookies } from "next/headers";
import {
  PREVIEW_NAVIGATION_COOKIE,
  getPreviewNavigationState,
} from "@/lib/preview-navigation";
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

export const publicDemoCategorySidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "活用事例", href: "/demo/use-cases" },
  { label: "AIP機能", href: "/demo/aip" },
  { label: "ACP機能", href: "/demo/acp" },
] as const;

export const previewDemoCategorySidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "活用事例", href: "/demo/use-cases" },
  { label: "AIP機能", href: "/demo/aip" },
  { label: "ACP機能", href: "/demo/acp" },
] as const;

type DemoCategorySidebarProps = {
  activeLabel?: ResourceCategoryLink["label"];
  links?: readonly ResourceCategoryLink[];
};

export function getDefaultDemoCategorySidebarLinks(previewModeEnabled: boolean) {
  return previewModeEnabled ? previewDemoCategorySidebarLinks : publicDemoCategorySidebarLinks;
}

export async function DemoCategorySidebar({ activeLabel, links }: DemoCategorySidebarProps) {
  const cookieStore = await cookies();
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled: previewModeEnabled } = getPreviewNavigationState(previewCookieValue);
  const resolvedLinks = links ?? getDefaultDemoCategorySidebarLinks(previewModeEnabled);

  return (
    <ResourceListSidebar>
      <ResourceListSidebarLabel>デモカテゴリー</ResourceListSidebarLabel>
      <ResourceListSidebarViewport>
        <ResourceListSidebarNav label="Sidebar Navigation">
          <ResourceListSidebarList>
            {resolvedLinks.map((link) => (
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
