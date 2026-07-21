const SECRET_QUERY = /^(?:x-amz-|x-goog-|token$|access_token$|signature$|sig$|expires$|credential$|key$|api_key$|apikey$|authorization$|auth$|password$|secret$|client_secret$)/i;

function redactString(value) {
  let result = value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer REDACTED")
    .replace(/\b(?:gh[opsu]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,})\b/g, "REDACTED");
  result = result.replace(/https?:\/\/[^\s"'<>]+/g, (raw) => {
    try {
      const url = new URL(raw);
      for (const key of [...url.searchParams.keys()]) if (SECRET_QUERY.test(key)) url.searchParams.set(key, "REDACTED");
      return url.href;
    } catch { return raw; }
  });
  return result;
}

export function redactSecrets(value) {
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /(?:secret|token|api.?key|authorization)/i.test(key) ? "REDACTED" : redactSecrets(item)]));
  return value;
}
