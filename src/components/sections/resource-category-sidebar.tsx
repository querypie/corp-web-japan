import { cookies } from "next/headers";
import {
  PREVIEW_NAVIGATION_COOKIE,
  getPreviewNavigationState,
} from "@/lib/preview-navigation";
import {
  ResourceListMobileSidebarDrawer,
  ResourceListSidebar,
  ResourceListSidebarItem,
  ResourceListSidebarLabel,
  ResourceListSidebarLink,
  ResourceListSidebarList,
  ResourceListSidebarNav,
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
  { label: "全て", href: "/resources" },
  { label: "紹介資料", href: "/introduction-deck" },
  { label: "用語集", href: "/glossary" },
  { label: "マニュアル", href: "/manuals" },
  { label: "ホワイトペーパー", href: "/whitepapers" },
  { label: "ブログ", href: "/blog" },
  { label: "イベント", href: "/events" },
] as const;

type ResourceCategorySidebarProps = {
  activeLabel?: ResourceCategoryLink["label"];
  links?: readonly ResourceCategoryLink[];
};

export function getDefaultResourceCategorySidebarLinks(previewModeEnabled: boolean) {
  return previewModeEnabled ? previewResourceCategorySidebarLinks : resourceCategorySidebarLinks;
}

export async function ResourceCategorySidebar({ activeLabel, links }: ResourceCategorySidebarProps) {
  const cookieStore = await cookies();
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled: previewModeEnabled } = getPreviewNavigationState(previewCookieValue);
  const resolvedLinks = links ?? getDefaultResourceCategorySidebarLinks(previewModeEnabled);

  const renderSidebarList = () => (
    <ResourceListSidebarList>
      {resolvedLinks.map((link) => (
        <ResourceListSidebarItem key={link.label}>
          <ResourceListSidebarLink href={link.href} active={link.label === activeLabel} label={link.label}>
            {link.label}
          </ResourceListSidebarLink>
        </ResourceListSidebarItem>
      ))}
    </ResourceListSidebarList>
  );

  return (
    <ResourceListSidebar>
      <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
      <ResourceListMobileSidebarDrawer title="カテゴリー" activeLabel={activeLabel}>
        <ResourceListSidebarNav label="Sidebar Navigation">{renderSidebarList()}</ResourceListSidebarNav>
      </ResourceListMobileSidebarDrawer>
      <div className="hidden lg:block">
        <ResourceListSidebarNav label="Sidebar Navigation">{renderSidebarList()}</ResourceListSidebarNav>
      </div>
    </ResourceListSidebar>
  );
}
