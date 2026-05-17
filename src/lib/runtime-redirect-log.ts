import type { NextRequest } from "next/server";

type RuntimeRedirectLogMarker = "[runtime-redirect]" | "[runtime-missing-redirect]";

type RuntimeRedirectLogOptions = {
  marker?: RuntimeRedirectLogMarker;
};

type RuntimeRedirectLogEntry = RuntimeRedirectLogOptions & {
  requestedPath: string;
  redirectTarget: string | URL;
  requestUrl?: string | URL | null;
  statusCode: number;
  host?: string | null;
  referer?: string | null;
  userAgent?: string | null;
};

type RuntimeRedirectRequest = Pick<NextRequest, "headers" | "nextUrl" | "url">;

function toUrl(value: string | URL | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return value instanceof URL ? value : new URL(value);
  } catch {
    return null;
  }
}

function getRedirectScope(redirectTarget: URL | null, requestUrl: URL | null) {
  if (redirectTarget && requestUrl && redirectTarget.origin === requestUrl.origin) {
    return "same-origin";
  }

  return "external";
}

function writeRuntimeRedirectLog({
  requestedPath,
  redirectTarget,
  requestUrl,
  statusCode = 307,
  marker = "[runtime-redirect]",
  host,
  referer,
  userAgent,
}: RuntimeRedirectLogEntry) {
  const redirectTargetUrl = toUrl(redirectTarget);
  const requestUrlValue = toUrl(requestUrl);
  const redirectScope = getRedirectScope(redirectTargetUrl, requestUrlValue);
  const log = redirectScope === "same-origin" ? console.info : console.warn;

  log(
    marker,
    JSON.stringify({
      requestedPath,
      redirectTarget: redirectTargetUrl?.toString() ?? String(redirectTarget),
      redirectScope,
      statusCode,
      host,
      referer,
      userAgent,
    }),
  );
}

export function logRuntimeRedirect(
  request: RuntimeRedirectRequest,
  redirectTarget: string | URL,
  statusCode: number,
  options: RuntimeRedirectLogOptions = {},
) {
  writeRuntimeRedirectLog({
    ...options,
    requestedPath: request.nextUrl.pathname,
    redirectTarget,
    requestUrl: request.url,
    statusCode,
    host: request.nextUrl.host,
    referer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  });
}

export function logRuntimeRedirectFromHeaders(entry: RuntimeRedirectLogEntry) {
  writeRuntimeRedirectLog(entry);
}
