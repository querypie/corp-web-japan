import { after } from "next/server";
import {
  buildContactUsSalesforceBody,
  isContactUsFormValid,
  type ContactUsFormState,
} from "@/lib/contact-us";
import { deliverDeskPieLeadPayload } from "@/lib/forms/server/deskpie-lead-delivery";
import { hasValidMxRecord } from "@/lib/forms/server/email-deliverability";
import { sanitizeRecordStrings, sanitizeText } from "@/lib/forms/server/sanitize";
import { postSlackNotification } from "@/lib/forms/server/slack-notification";
import { toSalesforceUtmFields } from "@/lib/forms/server/utm-attribution";

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

function buildSanitizedSalesforceBody(form: ContactUsFormState, referrerUrl: string, utmAttribution?: string) {
  const body = buildContactUsSalesforceBody(form, sanitizeText(referrerUrl));
  const requestBody = sanitizeRecordStrings(body.requestBody as Record<string, unknown>);

  Object.assign(requestBody, toSalesforceUtmFields(utmAttribution));

  return {
    ...body,
    requestBody,
  };
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

  const slackToken = process.env.SLACK_BOT_OAUTH_TOKEN;
  const slackChannel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;

  if (!(await hasValidMxRecord(payload.form.email))) {
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

  after(() =>
    deliverDeskPieLeadPayload({
      endpointName: "contact-us",
      requestPath: "/contact-us/submit",
      payload: requestPayload,
    }),
  );

  try {
    await postSlackNotification({
      endpointName: "contact-us",
      requestPath: "/contact-us/submit",
      requestBody: requestPayload.requestBody as Record<string, unknown>,
      token: slackToken,
      channel: slackChannel,
      title: "New Contact Sales Received",
    });
  } catch (error) {
    console.error("[contact-us] slack notification failed", error);
  }

  return {
    success: true,
    status: 200,
  };
}
