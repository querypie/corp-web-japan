import isProduction from "@/lib/is-production";
import {
  logExternalApiError,
  logExternalApiInfo,
  logExternalApiWarn,
} from "@/lib/forms/server/external-api-log";

const slackApiUrl = "https://slack.com/api/chat.postMessage";

export type SlackNotificationResult = { ok: true } | { ok: false; reason: string };

export type SlackNotificationInput = {
  endpointName?: string;
  requestPath?: string;
  requestBody: Record<string, unknown>;
  token?: string;
  channel?: string;
  title?: string;
};

export function getSlackEnvironmentTag() {
  return isProduction() ? "" : "[TEST] ";
}

export async function postSlackNotification({
  endpointName = "unknown",
  requestPath,
  requestBody,
  token,
  channel,
  title = "New Contact Sales Received",
}: SlackNotificationInput): Promise<SlackNotificationResult> {
  if (!token || !channel) {
    logExternalApiWarn({
      service: "slack",
      endpointName,
      requestPath,
      outcome: "skipped",
      reason: "missing_credentials",
      remoteUrl: slackApiUrl,
    });
    return { ok: false, reason: "missing_credentials" };
  }

  const environmentTag = getSlackEnvironmentTag();
  const visibleEntries = Object.entries(requestBody)
    .filter(([key]) => !key.startsWith("Has") && !key.startsWith("pi__"))
    .map(([key, value]) => {
      if (key === "Referrer_URL__c") {
        return `• *RequestURI*: ${String(value || "-")}`;
      }
      return `• *${key}*: ${String(value || "-")}`;
    })
    .join("\n");

  const text = `${environmentTag}*${title}*\n\n${visibleEntries}`;
  const response = await fetch(slackApiUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      channel,
      text: `${environmentTag}${title}`,
      blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
    }),
  });

  const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !json?.ok) {
    logExternalApiError({
      service: "slack",
      endpointName,
      requestPath,
      outcome: "failed",
      reason: `api_${json?.error ?? response.status}`,
      statusCode: response.ok ? undefined : response.status,
      remoteUrl: slackApiUrl,
    });
    return { ok: false, reason: `api_${json?.error ?? response.status}` };
  }

  logExternalApiInfo({
    service: "slack",
    endpointName,
    requestPath,
    outcome: "success",
    remoteUrl: slackApiUrl,
  });
  return { ok: true };
}
