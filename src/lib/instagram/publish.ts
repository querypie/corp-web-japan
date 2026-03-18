import { INSTAGRAM_CONFIG } from "./config";
import type {
  InstagramMediaContainerResponse,
  InstagramContainerStatus,
  InstagramPublishResponse,
} from "./types";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

export async function createMediaContainer(
  igUserId: string,
  accessToken: string,
  imageUrl: string,
  caption: string
): Promise<string> {
  const res = await fetch(
    `${INSTAGRAM_CONFIG.graphApiBase}/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      `Media container creation failed: ${JSON.stringify(err)}`
    );
  }

  const data: InstagramMediaContainerResponse = await res.json();
  return data.id;
}

export async function createCarouselContainer(
  igUserId: string,
  accessToken: string,
  imageUrls: string[],
  caption: string
): Promise<string> {
  // Create individual item containers
  const childIds: string[] = [];
  for (const url of imageUrls) {
    const res = await fetch(
      `${INSTAGRAM_CONFIG.graphApiBase}/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: url,
          is_carousel_item: true,
          access_token: accessToken,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        `Carousel item creation failed: ${JSON.stringify(err)}`
      );
    }
    const data: InstagramMediaContainerResponse = await res.json();
    childIds.push(data.id);
  }

  // Create carousel container
  const res = await fetch(
    `${INSTAGRAM_CONFIG.graphApiBase}/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "CAROUSEL",
        children: childIds.join(","),
        caption,
        access_token: accessToken,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      `Carousel container creation failed: ${JSON.stringify(err)}`
    );
  }

  const data: InstagramMediaContainerResponse = await res.json();
  return data.id;
}

export async function waitForContainerReady(
  containerId: string,
  accessToken: string
): Promise<void> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    const res = await fetch(
      `${INSTAGRAM_CONFIG.graphApiBase}/${containerId}?fields=status_code,status&access_token=${accessToken}`
    );

    if (!res.ok) {
      throw new Error("Failed to check container status");
    }

    const status: InstagramContainerStatus = await res.json();

    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(
        `Container processing failed: ${status.status_code} - ${status.status || "unknown"}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Container processing timed out after 60 seconds");
}

export async function publishContainer(
  igUserId: string,
  accessToken: string,
  containerId: string
): Promise<string> {
  const res = await fetch(
    `${INSTAGRAM_CONFIG.graphApiBase}/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Publish failed: ${JSON.stringify(err)}`);
  }

  const data: InstagramPublishResponse = await res.json();
  return data.id;
}
