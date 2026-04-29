import {
  logExternalApiError,
  logExternalApiInfo,
  logExternalApiWarn,
} from "@/lib/forms/server/external-api-log";

export type SalesforceDeliveryResult =
  | { ok: true; recordUUID?: string }
  | { ok: false; reason: string };

export async function deliverSalesforcePayload(options: {
  endpoint?: string;
  endpointName?: string;
  requestPath?: string;
  payload: Record<string, unknown>;
  successIdField?: string;
}): Promise<SalesforceDeliveryResult> {
  const {
    endpoint,
    endpointName = "unknown",
    requestPath,
    payload,
    successIdField = "recordUUID",
  } = options;

  if (!endpoint) {
    logExternalApiWarn({
      service: "salesforce",
      endpointName,
      requestPath,
      outcome: "skipped",
      reason: "missing_endpoint",
    });
    return { ok: false, reason: "missing_endpoint" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok) {
      logExternalApiError({
        service: "salesforce",
        endpointName,
        requestPath,
        outcome: "failed",
        reason: `http_${response.status}`,
        statusCode: response.status,
        remoteUrl: endpoint,
      });
      return { ok: false, reason: `http_${response.status}` };
    }

    const recordUUID = typeof json?.[successIdField] === "string" ? (json[successIdField] as string) : undefined;

    if (!recordUUID) {
      logExternalApiError({
        service: "salesforce",
        endpointName,
        requestPath,
        outcome: "failed",
        reason: `missing_${successIdField}`,
        remoteUrl: endpoint,
      });
      return { ok: false, reason: `missing_${successIdField}` };
    }

    logExternalApiInfo({
      service: "salesforce",
      endpointName,
      requestPath,
      outcome: "success",
      recordUUID,
      remoteUrl: endpoint,
    });
    return { ok: true, recordUUID };
  } catch {
    logExternalApiError({
      service: "salesforce",
      endpointName,
      requestPath,
      outcome: "failed",
      reason: "request_error",
      remoteUrl: endpoint,
    });
    return { ok: false, reason: "request_error" };
  }
}
