import isProduction from "@/lib/is-production";

export const PREVIEW_NAVIGATION_COOKIE = "querypie-preview-navigation";

export function isPreviewNavigationToggleVisible() {
  return !isProduction();
}

export function isPreviewNavigationEnabled(cookieValue?: string | null) {
  if (!isPreviewNavigationToggleVisible()) {
    return false;
  }

  return cookieValue === "on";
}

export function getPreviewNavigationState(cookieValue?: string | null) {
  const showToggle = isPreviewNavigationToggleVisible();

  return {
    showToggle,
    enabled: showToggle ? isPreviewNavigationEnabled(cookieValue) : false,
  };
}

export function t(path: string, previewModeEnabled: boolean) {
  if (!previewModeEnabled || path === "/" || path.startsWith("/t")) {
    return path;
  }

  return `/t${path}`;
}
