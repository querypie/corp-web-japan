export type LeadSurface = "contact_us" | "gated_content" | "whitepaper_download";

type GenerateLeadEventOptions = {
  onComplete: () => void;
  timeoutMs?: number;
};

type GenerateLeadEventParams = {
  lead_surface: LeadSurface;
  event_callback?: () => void;
  event_timeout?: number;
};

type WindowWithGtag = Window & {
  gtag?: (command: "event", eventName: "generate_lead", params: GenerateLeadEventParams) => void;
};

const DEFAULT_COMPLETION_TIMEOUT_MS = 1000;

export function sendGenerateLeadEvent(
  leadSurface: LeadSurface,
  options?: GenerateLeadEventOptions,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as WindowWithGtag).gtag;

  if (typeof gtag !== "function") {
    options?.onComplete();
    return;
  }

  let completionHandled = false;
  let fallbackTimeout: number | undefined;
  const complete = () => {
    if (completionHandled) {
      return;
    }

    completionHandled = true;

    if (fallbackTimeout !== undefined) {
      window.clearTimeout(fallbackTimeout);
    }

    options?.onComplete();
  };

  try {
    const params: GenerateLeadEventParams = { lead_surface: leadSurface };

    if (options) {
      const timeoutMs = options.timeoutMs ?? DEFAULT_COMPLETION_TIMEOUT_MS;

      fallbackTimeout = window.setTimeout(complete, timeoutMs);
      params.event_callback = complete;
      params.event_timeout = timeoutMs;
    }

    gtag("event", "generate_lead", params);
  } catch {
    // Analytics must never block success UI, gated unlock, or redirects.
    complete();
  }
}
