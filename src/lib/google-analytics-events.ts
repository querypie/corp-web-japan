export type LeadSurface = "contact_us" | "gated_content" | "whitepaper_download";

type WindowWithGtag = Window & {
  gtag?: (command: "event", eventName: "generate_lead", params: { lead_surface: LeadSurface }) => void;
};

export function sendGenerateLeadEvent(leadSurface: LeadSurface): void {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as WindowWithGtag).gtag;

  if (typeof gtag !== "function") {
    return;
  }

  try {
    gtag("event", "generate_lead", { lead_surface: leadSurface });
  } catch {
    // Analytics must never block success UI, gated unlock, or redirects.
  }
}
