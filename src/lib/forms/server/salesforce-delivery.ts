export type SalesforceDeliveryResult =
  | { ok: true; recordUUID?: string }
  | { ok: false; reason: string };

export async function deliverSalesforcePayload(options: {
  endpoint?: string;
  payload: Record<string, unknown>;
  successIdField?: string;
  logPrefix?: string;
}): Promise<SalesforceDeliveryResult> {
  const {
    endpoint,
    payload,
    successIdField = "recordUUID",
    logPrefix = "[form-submit] salesforce",
  } = options;

  if (!endpoint) {
    console.warn(`${logPrefix}: skipped (env not set)`);
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
      console.error(`${logPrefix}: HTTP ${response.status}`);
      return { ok: false, reason: `http_${response.status}` };
    }

    const recordUUID = typeof json?.[successIdField] === "string" ? (json[successIdField] as string) : undefined;

    if (!recordUUID) {
      console.error(`${logPrefix}: no ${successIdField} in response`);
      return { ok: false, reason: `missing_${successIdField}` };
    }

    console.info(`${logPrefix}: success ${successIdField}=${recordUUID}`);
    return { ok: true, recordUUID };
  } catch (error) {
    console.error(`${logPrefix}: request error`, error);
    return { ok: false, reason: "request_error" };
  }
}
