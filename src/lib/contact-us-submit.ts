import { Resolver } from "node:dns/promises";
import {
  buildContactUsSalesforceBody,
  isContactUsFormValid,
  type ContactUsFormState,
} from "@/lib/contact-us";
import isProduction from "@/lib/is-production";

export type ContactUsSubmitPayload = {
  form: ContactUsFormState;
  referrerUrl?: string;
  utmAttribution?: string;
};

export type ContactUsSubmitResult = {
  success: boolean;
  status: number;
  message?: string;
};

type UtmTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landing?: string;
  ts?: string;
};

type UtmAttribution = {
  first?: UtmTouch;
  recent?: UtmTouch[];
};

const resolver = new Resolver();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function hasValidMXRecord(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return false;
  }

  const [, domain = ""] = normalizedEmail.split("@");
  if (!domain) {
    return false;
  }

  try {
    const records = await resolver.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

function toSalesforceFields(encodedAttribution: string | undefined): Record<string, string> {
  if (!encodedAttribution) {
    return {};
  }

  try {
    const attribution = JSON.parse(decodeURIComponent(encodedAttribution)) as UtmAttribution;
    const fields: Record<string, string> = {};
    const lastTouch = attribution.recent?.[attribution.recent.length - 1];

    if (lastTouch?.source) fields["pi__utm_source__c"] = sanitizeText(lastTouch.source);
    if (lastTouch?.medium) fields["pi__utm_medium__c"] = sanitizeText(lastTouch.medium);
    if (lastTouch?.campaign) fields["pi__utm_campaign__c"] = sanitizeText(lastTouch.campaign);
    if (lastTouch?.content) fields["pi__utm_content__c"] = sanitizeText(lastTouch.content);
    if (lastTouch?.term) fields["pi__utm_term__c"] = sanitizeText(lastTouch.term);
    if (attribution.first?.landing) {
      fields["pi__first_touch_url__c"] = sanitizeText(attribution.first.landing);
    }

    return fields;
  } catch {
    return {};
  }
}

function buildSanitizedSalesforceBody(form: ContactUsFormState, referrerUrl: string, utmAttribution?: string) {
  const body = buildContactUsSalesforceBody(form, sanitizeText(referrerUrl));
  const requestBody = body.requestBody as Record<string, unknown>;

  for (const [key, value] of Object.entries(requestBody)) {
    if (typeof value === "string") {
      requestBody[key] = sanitizeText(value);
    }
  }

  Object.assign(requestBody, toSalesforceFields(utmAttribution));

  return {
    ...body,
    requestBody,
  };
}

async function postToSlack(requestBody: Record<string, unknown>) {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;

  if (!token || !channel) {
    throw new Error("Slack environment variables not configured");
  }

  const environmentTag = isProduction() ? "" : "[TEST] ";
  const visibleEntries = Object.entries(requestBody)
    .filter(([key]) => !key.startsWith("Has") && !key.startsWith("Referrer") && !key.startsWith("pi__"))
    .map(([key, value]) => `• *${key}*: ${String(value || "-")}`)
    .join("\n");

  const text = `${environmentTag}*New Contact Sales Received*\n\n${visibleEntries}`;
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      channel,
      text: `${environmentTag}New Contact Sales Received`,
      blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
    }),
  });

  const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !json?.ok) {
    throw new Error(`Slack API failed: ${json?.error ?? response.status}`);
  }
}

async function postToSalesforce(endpoint: string, payload: ReturnType<typeof buildSanitizedSalesforceBody>) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json().catch(() => null)) as { recordUUID?: string } | null;

    if (!response.ok) {
      console.error(`[contact-us] salesforce: HTTP ${response.status}`);
      return;
    }

    if (!json?.recordUUID) {
      console.error("[contact-us] salesforce: no recordUUID in response");
      return;
    }

    console.info(`[contact-us] salesforce: success recordUUID=${json.recordUUID}`);
  } catch (error) {
    console.error("[contact-us] salesforce: request error", error);
  }
}

export async function submitContactUsForm(
  payload: ContactUsSubmitPayload,
  fallbackReferrerUrl: string,
): Promise<ContactUsSubmitResult> {
  if (!payload?.form || !isContactUsFormValid(payload.form)) {
    return {
      success: false,
      status: 400,
      message: "入力内容に不足または誤りがあります。",
    };
  }

  if (!process.env.SLACK_BOT_OAUTH_TOKEN || !process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES) {
    console.error("[contact-us] Slack environment variables not configured");
    return {
      success: false,
      status: 500,
      message: "現在サーバー設定に問題があります。しばらくしてから再度お試しください。",
    };
  }

  if (!(await hasValidMXRecord(payload.form.email))) {
    return {
      success: false,
      status: 400,
      message: "有効なメールアドレスを入力してください。",
    };
  }

  const requestPayload = buildSanitizedSalesforceBody(
    payload.form,
    payload.referrerUrl ?? fallbackReferrerUrl,
    payload.utmAttribution,
  );

  const endpoint = process.env.SALESFORCE_ENDPOINT;
  if (endpoint) {
    await postToSalesforce(endpoint, requestPayload);
  } else {
    console.warn("[contact-us] salesforce: skipped (env not set)");
  }

  try {
    await postToSlack(requestPayload.requestBody as Record<string, unknown>);
  } catch (error) {
    console.error("[contact-us] slack: failed", error);
    return {
      success: false,
      status: 502,
      message: "お問い合わせの送信に失敗しました。しばらくしてから再度お試しください。",
    };
  }

  return {
    success: true,
    status: 200,
  };
}
