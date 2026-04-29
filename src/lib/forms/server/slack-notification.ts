import isProduction from "@/lib/is-production";

export type SlackNotificationInput = {
  requestBody: Record<string, unknown>;
  token?: string;
  channel?: string;
  title?: string;
};

export function getSlackEnvironmentTag() {
  return isProduction() ? "" : "[TEST] ";
}

export async function postSlackNotification({
  requestBody,
  token,
  channel,
  title = "New Contact Sales Received",
}: SlackNotificationInput) {
  if (!token || !channel) {
    throw new Error("Slack environment variables not configured");
  }

  const environmentTag = getSlackEnvironmentTag();
  const visibleEntries = Object.entries(requestBody)
    .filter(([key]) => !key.startsWith("Has") && !key.startsWith("Referrer") && !key.startsWith("pi__"))
    .map(([key, value]) => `• *${key}*: ${String(value || "-")}`)
    .join("\n");

  const text = `${environmentTag}*${title}*\n\n${visibleEntries}`;
  const response = await fetch("https://slack.com/api/chat.postMessage", {
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
    throw new Error(`Slack API failed: ${json?.error ?? response.status}`);
  }
}
