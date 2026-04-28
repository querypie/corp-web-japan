import { createRedirectHandlers } from "@/lib/redirect-route";

export const { GET, HEAD } = createRedirectHandlers(
  "https://www.querypie.com/ja/features/documentation?category=introduction-deck",
);
