export type ExternalApiService = "slack" | "salesforce" | "license";
export type ExternalApiOutcome = "success" | "skipped" | "failed";

export type ExternalApiLogEntry = {
  service: ExternalApiService;
  endpointName: string;
  requestPath?: string;
  outcome: ExternalApiOutcome;
  reason?: string;
  remoteUrl?: string;
  statusCode?: number;
  recordUUID?: string;
};

function stringifyLogEntry(entry: ExternalApiLogEntry) {
  return `[external-api] ${JSON.stringify(entry)}`;
}

export function logExternalApiInfo(entry: ExternalApiLogEntry) {
  console.info(stringifyLogEntry(entry));
}

export function logExternalApiWarn(entry: ExternalApiLogEntry) {
  console.warn(stringifyLogEntry(entry));
}

export function logExternalApiError(entry: ExternalApiLogEntry) {
  console.error(stringifyLogEntry(entry));
}
