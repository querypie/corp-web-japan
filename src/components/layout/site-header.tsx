import { cookies } from "next/headers";
import {
  PREVIEW_NAVIGATION_COOKIE,
  getPreviewNavigationState,
} from "@/lib/preview-navigation";
import { SiteHeaderClient } from "./site-header-client";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export async function SiteHeader() {
  const cookieStore = await cookies();
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled, showToggle } = getPreviewNavigationState(previewCookieValue);

  return (
    <SiteHeaderClient {...componentNameDebugProps("SiteHeader")}
      previewModeEnabled={enabled}
      showPreviewModeToggle={showToggle}
    />
  );
}
