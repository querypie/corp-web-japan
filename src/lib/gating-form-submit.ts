import {
  buildGatingSalesforceBody,
  isGatingFormValid,
  type GatingFormState,
} from "@/lib/gating-form";
import { hasValidMxRecord } from "@/lib/forms/server/email-deliverability";
import { sanitizeRecordStrings, sanitizeText } from "@/lib/forms/server/sanitize";
import { deliverSalesforcePayload } from "@/lib/forms/server/salesforce-delivery";
import { postSlackNotification } from "@/lib/forms/server/slack-notification";
import { toSalesforceUtmFields } from "@/lib/forms/server/utm-attribution";

export type GatingFormSubmitPayload = {
  contentKey: string;
  form: GatingFormState;
  referrerUrl?: string;
  utmAttribution?: string;
};

export type GatingFormSubmitResult = {
  success: boolean;
  status: number;
  message?: string;
};

function buildSanitizedSalesforceBody(
  contentKey: string,
  form: GatingFormState,
  referrerUrl: string,
  utmAttribution?: string,
) {
  const body = buildGatingSalesforceBody(form, sanitizeText(referrerUrl), sanitizeText(contentKey));
  const requestBody = sanitizeRecordStrings(body.requestBody as Record<string, unknown>);

  Object.assign(requestBody, toSalesforceUtmFields(utmAttribution));

  return {
    ...body,
    requestBody,
  };
}

export async function submitGatingForm(
  payload: GatingFormSubmitPayload,
  fallbackReferrerUrl: string,
): Promise<GatingFormSubmitResult> {
  if (!payload?.contentKey.trim() || !payload?.form || !isGatingFormValid(payload.form)) {
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
    payload.contentKey,
    payload.form,
    payload.referrerUrl ?? fallbackReferrerUrl,
    payload.utmAttribution,
  );

  await deliverSalesforcePayload({
    endpoint: process.env.SALESFORCE_ENDPOINT,
    endpointName: "gating-form",
    requestPath: "/api/gating-form/unlock",
    payload: requestPayload as Record<string, unknown>,
    successIdField: "recordUUID",
  });

  const slackResult = await postSlackNotification({
    endpointName: "gating-form",
    requestPath: "/api/gating-form/unlock",
    requestBody: requestPayload.requestBody as Record<string, unknown>,
    token: slackToken,
    channel: slackChannel,
    title: "New Gated Document Unlock Received",
  });
  if (!slackResult.ok) {
    return {
      success: false,
      status: slackResult.reason === "missing_credentials" ? 500 : 502,
      message: "限定コンテンツの送信処理に失敗しました。しばらくしてから再度お試しください。",
    };
  }

  return {
    success: true,
    status: 200,
  };
}
