const PRODUCTION_SITE_ORIGIN = "https://querypie.ai";

type SiteUrlEnvironment = {
  [key: string]: string | undefined;
  NEXT_PUBLIC_SITE_URL?: string;
  PUBLIC_SITE_URL?: string;
  SITE_URL?: string;
  VERCEL_TARGET_ENV?: string;
  VERCEL_BRANCH_URL?: string;
  NEXT_PUBLIC_VERCEL_URL?: string;
  VERCEL_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

type ResolveDeployedSiteOriginInput = {
  env?: SiteUrlEnvironment;
  requestOrigin?: string | null;
  requestHost?: string | null;
  requestProtocol?: string | null;
};

function firstHeaderValue(value: string | null | undefined) {
  return value?.split(",")[0]?.trim() || null;
}

function protocolForHost(host: string) {
  return /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host) ? "http" : "https";
}

function normalizeOrigin(value: string | null | undefined) {
  const trimmedValue = firstHeaderValue(value);
  if (!trimmedValue) {
    return null;
  }

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `${protocolForHost(trimmedValue)}://${trimmedValue}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function originFromRequestHost(host: string | null | undefined, protocol: string | null | undefined) {
  const requestHost = firstHeaderValue(host);
  if (!requestHost) {
    return null;
  }

  const requestProtocol = firstHeaderValue(protocol)?.replace(/:$/, "") || protocolForHost(requestHost);
  return normalizeOrigin(`${requestProtocol}://${requestHost}`);
}

function resolveVercelOrigin(env: SiteUrlEnvironment) {
  return (
    normalizeOrigin(env.VERCEL_BRANCH_URL) ??
    normalizeOrigin(env.NEXT_PUBLIC_VERCEL_URL) ??
    normalizeOrigin(env.VERCEL_URL)
  );
}

export const productionSiteUrl = new URL(PRODUCTION_SITE_ORIGIN);

export function resolveDeployedSiteOrigin({
  env = process.env,
  requestOrigin,
  requestHost,
  requestProtocol,
}: ResolveDeployedSiteOriginInput = {}) {
  const currentRequestOrigin =
    normalizeOrigin(requestOrigin) ?? originFromRequestHost(requestHost, requestProtocol);

  if (currentRequestOrigin) {
    return currentRequestOrigin;
  }

  const configuredOrigin =
    normalizeOrigin(env.NEXT_PUBLIC_SITE_URL) ??
    normalizeOrigin(env.PUBLIC_SITE_URL) ??
    normalizeOrigin(env.SITE_URL);

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (env.VERCEL_TARGET_ENV === "production") {
    return normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL) ?? PRODUCTION_SITE_ORIGIN;
  }

  return resolveVercelOrigin(env) ?? PRODUCTION_SITE_ORIGIN;
}

export function getDeployedSiteUrl(input?: ResolveDeployedSiteOriginInput) {
  return new URL(resolveDeployedSiteOrigin(input));
}

export const siteUrl = getDeployedSiteUrl();

export function absoluteUrl(path: string, base: URL | string = siteUrl) {
  return new URL(path, base).toString();
}
