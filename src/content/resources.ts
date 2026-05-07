import { blogItems } from "@/lib/publications/blog/items";
import { listWhitepaperPublicationItems } from "@/lib/publications/whitepapers/records";
import { eventItems } from "./resources/events";

export type ResourceCategory = "blog" | "whitepaper" | "events";

export type ResourceItem = {
  id: string;
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
};

export { blogItems } from "@/lib/publications/blog/items";
export { eventItems } from "./resources/events";
export const whitepaperItems = listWhitepaperPublicationItems();

export function getResourceItems(category: ResourceCategory) {
  if (category === "blog") return blogItems;
  if (category === "whitepaper") return whitepaperItems;
  return eventItems;
}
