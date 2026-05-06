export function resolveRedirectablePublicationHref(redirectUrl: string | undefined, fallbackHref: string) {
  return redirectUrl ?? fallbackHref;
}
