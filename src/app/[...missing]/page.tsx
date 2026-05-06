import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { buildCorpWebJapanLegacyRedirectPath } from "@/lib/corp-web-japan-legacy-redirect";
import { buildQueryPieContentRedirectUrl } from "@/lib/querypie-content-redirect";

export const dynamic = "force-dynamic";

type MissingRoutePageProps = {
  params: Promise<{
    missing: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSearchString(searchParams: Record<string, string | string[] | undefined>) {
  const normalizedSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      normalizedSearchParams.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        normalizedSearchParams.append(key, item);
      }
    }
  }

  const serializedSearchParams = normalizedSearchParams.toString();

  return serializedSearchParams ? `?${serializedSearchParams}` : "";
}

export default async function MissingRoutePage({ params, searchParams }: MissingRoutePageProps) {
  const [{ missing }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const requestHeaders = await headers();
  const requestedPath = `/${missing.join("/")}`;
  const search = toSearchString(resolvedSearchParams);
  const localRedirectPath = buildCorpWebJapanLegacyRedirectPath(requestedPath);

  if (localRedirectPath) {
    console.log(
      "[runtime-missing-redirect]",
      JSON.stringify({
        requestedPath,
        redirectTarget: localRedirectPath + search,
        host: requestHeaders.get("host"),
        referer: requestHeaders.get("referer"),
        userAgent: requestHeaders.get("user-agent"),
      }),
    );

    redirect(localRedirectPath + search);
  }

  const redirectTarget = buildQueryPieContentRedirectUrl(requestedPath, search);

  if (redirectTarget) {
    console.log(
      "[runtime-missing-redirect]",
      JSON.stringify({
        requestedPath,
        redirectTarget: redirectTarget.toString(),
        host: requestHeaders.get("host"),
        referer: requestHeaders.get("referer"),
        userAgent: requestHeaders.get("user-agent"),
      }),
    );

    redirect(redirectTarget.toString());
  }

  console.log(
    "[runtime-404]",
    JSON.stringify({
      requestedPath,
      host: requestHeaders.get("host"),
      referer: requestHeaders.get("referer"),
      userAgent: requestHeaders.get("user-agent"),
    }),
  );

  notFound();
}
