import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { buildQueryPieContentRedirectUrl } from "@/lib/querypie-content-redirect";
import { logRuntimeRedirectFromHeaders } from "@/lib/runtime-redirect-log";

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

function buildRequestUrl({
  host,
  protocol,
  requestedPath,
  search,
}: {
  host: string | null;
  protocol: string | null;
  requestedPath: string;
  search: string;
}) {
  if (!host) {
    return null;
  }

  return `${protocol ?? "https"}://${host}${requestedPath}${search}`;
}

export default async function MissingRoutePage({ params, searchParams }: MissingRoutePageProps) {
  const [{ missing }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const requestHeaders = await headers();
  const requestedPath = `/${missing.join("/")}`;
  const search = toSearchString(resolvedSearchParams);
  const redirectTarget = buildQueryPieContentRedirectUrl(requestedPath, search);
  const host = requestHeaders.get("host");
  const referer = requestHeaders.get("referer");
  const userAgent = requestHeaders.get("user-agent");
  const requestUrl = buildRequestUrl({
    host,
    protocol: requestHeaders.get("x-forwarded-proto"),
    requestedPath,
    search,
  });
  const statusCode = 307;

  if (redirectTarget) {
    logRuntimeRedirectFromHeaders({
      marker: "[runtime-missing-redirect]",
      requestedPath,
      redirectTarget,
      requestUrl,
      statusCode,
      host,
      referer,
      userAgent,
    });

    redirect(redirectTarget.toString());
  }

  console.log(
    "[runtime-404]",
    JSON.stringify({
      requestedPath,
      host,
      referer,
      userAgent,
    }),
  );

  notFound();
}
