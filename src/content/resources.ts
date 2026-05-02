import { blogItems } from "@/lib/publications/blog-items";
import { querypieJapanWhitepaperItems } from "@/content/publications/querypie-ja-whitepaper-links";
import { eventItems } from "./resources/events";

export type ResourceCategory = "blog" | "whitepaper" | "events";

export type ResourceItem = {
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
};

export { blogItems } from "@/lib/publications/blog-items";
export { eventItems } from "./resources/events";
export { querypieJapanWhitepaperItems as whitepaperItems } from "@/content/publications/querypie-ja-whitepaper-links";

export function getResourceItems(category: ResourceCategory) {
  if (category === "blog") return blogItems;
  if (category === "whitepaper") return querypieJapanWhitepaperItems;
  return eventItems;
}
