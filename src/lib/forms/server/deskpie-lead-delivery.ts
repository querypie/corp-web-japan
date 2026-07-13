import {
  logExternalApiError,
  logExternalApiInfo,
  logExternalApiWarn,
} from "@/lib/forms/server/external-api-log";

export type DeskPieLeadPayload = {
  processType: string;
  requestBody: Record<string, unknown>;
};

export async function deliverDeskPieLeadPayload(options: {
  endpoint?: string;
  apiKey?: string;
  endpointName?: string;
  requestPath?: string;
  payload: DeskPieLeadPayload;
}): Promise<void> {
  const {
    endpoint = process.env.DESKPIE_LEAD_API_ENDPOINT,
    apiKey = process.env.DESKPIE_LEAD_API_KEY,
    endpointName = "unknown",
    requestPath,
    payload,
  } = options;

  if (!endpoint || !apiKey) {
    logExternalApiWarn({
      service: "deskpie",
      endpointName,
      requestPath,
      outcome: "skipped",
      reason: "missing_credentials",
      remoteUrl: endpoint,
    });
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logExternalApiError({
        service: "deskpie",
        endpointName,
        requestPath,
        outcome: "failed",
        reason: `http_${response.status}`,
        statusCode: response.status,
        remoteUrl: endpoint,
      });
      return;
    }

    const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const leadId = typeof json?.leadId === "string" ? json.leadId : undefined;

    logExternalApiInfo({
      service: "deskpie",
      endpointName,
      requestPath,
      outcome: "success",
      reason: leadId ? undefined : "missing_lead_id",
      recordUUID: leadId,
      remoteUrl: endpoint,
    });
  } catch {
    logExternalApiError({
      service: "deskpie",
      endpointName,
      requestPath,
      outcome: "failed",
      reason: "request_error",
      remoteUrl: endpoint,
    });
  }
}
