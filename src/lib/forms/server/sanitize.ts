export function sanitizeText(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeRecordStrings<T extends Record<string, unknown>>(record: T): T {
  const sanitizedEntries = Object.entries(record).map(([key, value]) => [
    key,
    typeof value === "string" ? sanitizeText(value) : value,
  ]);

  return Object.fromEntries(sanitizedEntries) as T;
}
