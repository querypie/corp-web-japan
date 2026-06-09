import "server-only";

import { headers } from "next/headers";
import { getDeployedSiteUrl } from "@/lib/site-url";

export async function getRequestDeployedSiteUrl() {
  const headerStore = await headers();

  return getDeployedSiteUrl({
    requestHost: headerStore.get("x-forwarded-host") ?? headerStore.get("host"),
    requestProtocol: headerStore.get("x-forwarded-proto"),
  });
}

export async function absoluteUrlForCurrentRequest(path: string) {
  return new URL(path, await getRequestDeployedSiteUrl()).toString();
}
