import { whitepaperItems } from "@/content/whitepapers";
import { blogItems } from "./resources/blog";
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

export { blogItems } from "./resources/blog";
export { eventItems } from "./resources/events";
export { whitepaperItems } from "@/content/whitepapers";

export function getResourceItems(category: ResourceCategory) {
  if (category === "blog") return blogItems;
  if (category === "whitepaper") return whitepaperItems;
  return eventItems;
}
