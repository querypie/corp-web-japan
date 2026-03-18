import { FACEBOOK_CONFIG } from "./config";
import type { FacebookPostResponse, FacebookPhotoResponse } from "./types";

/**
 * Publish a text-only post to a Facebook Page.
 */
export async function publishTextPost(
  pageId: string,
  accessToken: string,
  message: string
): Promise<string> {
  const res = await fetch(
    `${FACEBOOK_CONFIG.graphApiBase}/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: accessToken,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Facebook post failed: ${JSON.stringify(err)}`);
  }

  const data: FacebookPostResponse = await res.json();
  return data.id;
}

/**
 * Publish a single photo post to a Facebook Page.
 */
export async function publishPhotoPost(
  pageId: string,
  accessToken: string,
  imageUrl: string,
  message: string
): Promise<string> {
  const res = await fetch(
    `${FACEBOOK_CONFIG.graphApiBase}/${pageId}/photos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: imageUrl,
        message,
        access_token: accessToken,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Facebook photo post failed: ${JSON.stringify(err)}`);
  }

  const data: FacebookPhotoResponse = await res.json();
  return data.post_id || data.id;
}

/**
 * Publish a multi-photo post to a Facebook Page.
 * 1. Upload each photo as unpublished
 * 2. Create a post with all photos attached
 */
export async function publishMultiPhotoPost(
  pageId: string,
  accessToken: string,
  imageUrls: string[],
  message: string
): Promise<string> {
  // Step 1: Create unpublished photos
  const photoIds: string[] = [];

  for (const url of imageUrls) {
    const res = await fetch(
      `${FACEBOOK_CONFIG.graphApiBase}/${pageId}/photos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          published: false,
          access_token: accessToken,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        `Facebook unpublished photo failed: ${JSON.stringify(err)}`
      );
    }

    const data: FacebookPhotoResponse = await res.json();
    photoIds.push(data.id);
  }

  // Step 2: Create post with attached media
  const attachedMedia: Record<string, string> = {};
  photoIds.forEach((id, index) => {
    attachedMedia[`attached_media[${index}]`] = JSON.stringify({
      media_fbid: id,
    });
  });

  const body: Record<string, string> = {
    message,
    access_token: accessToken,
    ...attachedMedia,
  };

  const formBody = new URLSearchParams(body);

  const res = await fetch(
    `${FACEBOOK_CONFIG.graphApiBase}/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      `Facebook multi-photo post failed: ${JSON.stringify(err)}`
    );
  }

  const data: FacebookPostResponse = await res.json();
  return data.id;
}
