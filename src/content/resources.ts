import { blogItems } from "@/content/publications/blog";
import { whitepaperItems } from "@/content/publications/whitepaper";
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

export { blogItems } from "@/content/publications/blog";
export { eventItems } from "./resources/events";
export { whitepaperItems } from "@/content/publications/whitepaper";

export function getResourceItems(category: ResourceCategory) {
  if (category === "blog") return blogItems;
  if (category === "whitepaper") return whitepaperItems;
  return eventItems;
}
