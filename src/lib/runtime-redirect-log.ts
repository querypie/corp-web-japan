type RuntimeRedirectLogMarker = "[runtime-redirect]" | "[runtime-missing-redirect]";

type RuntimeRedirectLogEntry = {
  requestedPath: string;
  redirectTarget: string | URL;
  requestUrl?: string | URL | null;
  statusCode?: number;
  marker?: RuntimeRedirectLogMarker;
  host?: string | null;
  referer?: string | null;
  userAgent?: string | null;
};

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

export function logRuntimeRedirect({
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
