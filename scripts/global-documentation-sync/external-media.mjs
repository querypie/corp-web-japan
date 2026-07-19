export function externalMediaIdentity(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`external media must use HTTPS: ${value}`);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id = url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : url.searchParams.get("v");
    if (id && /^[A-Za-z0-9_-]+$/.test(id)) return `youtube:${id}`;
  }
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && /^[A-Za-z0-9_-]+$/.test(id)) return `youtube:${id}`;
  }
  if (host === "player.vimeo.com" || host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).at(-1);
    if (id && /^\d+$/.test(id)) return `vimeo:${id}`;
  }
  throw new Error(`external media provider is not approved: ${value}`);
}

export function extractAllowedExternalMedia(html) {
  const media = [];
  for (const match of html.matchAll(/<(?:iframe|video|source)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    if (!/^https:\/\//i.test(match[1])) continue;
    media.push({ url: match[1], identity: externalMediaIdentity(match[1]) });
  }
  return [...new Map(media.map((item) => [item.identity, item])).values()];
}
