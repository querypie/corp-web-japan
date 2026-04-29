import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function hasValidMxRecord(email: string) {
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
