import { headers } from "next/headers";

const SEARCH_BOT_USER_AGENT_PATTERN = /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex(?:bot)?|applebot|crawler|spider|bot)/i;

export function isSearchBotUserAgent(userAgent: string | null | undefined) {
  return typeof userAgent === "string" && SEARCH_BOT_USER_AGENT_PATTERN.test(userAgent);
}

export async function shouldRedirectHumanVisitorFromRedirectablePublication() {
  const requestHeaders = await headers();
  return !isSearchBotUserAgent(requestHeaders.get("user-agent"));
}
