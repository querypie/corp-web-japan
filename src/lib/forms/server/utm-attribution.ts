import { sanitizeText } from "@/lib/forms/server/sanitize";

type UtmTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landing?: string;
  ts?: string;
};

type UtmAttribution = {
  first?: UtmTouch;
  recent?: UtmTouch[];
};

export function toSalesforceUtmFields(encodedAttribution: string | undefined): Record<string, string> {
  if (!encodedAttribution) {
    return {};
  }

  try {
    const attribution = JSON.parse(decodeURIComponent(encodedAttribution)) as UtmAttribution;
    const fields: Record<string, string> = {};
    const lastTouch = attribution.recent?.[attribution.recent.length - 1];

    if (lastTouch?.source) fields["pi__utm_source__c"] = sanitizeText(lastTouch.source);
    if (lastTouch?.medium) fields["pi__utm_medium__c"] = sanitizeText(lastTouch.medium);
    if (lastTouch?.campaign) fields["pi__utm_campaign__c"] = sanitizeText(lastTouch.campaign);
    if (lastTouch?.content) fields["pi__utm_content__c"] = sanitizeText(lastTouch.content);
    if (lastTouch?.term) fields["pi__utm_term__c"] = sanitizeText(lastTouch.term);
    if (attribution.first?.landing) {
      fields["pi__first_touch_url__c"] = sanitizeText(attribution.first.landing);
    }

    return fields;
  } catch {
    return {};
  }
}
