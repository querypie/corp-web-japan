import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/internal/video renders a noindex self-hosted video demo backed by public assets", () => {
  const routeFile = "src/app/internal/video/page.tsx";
  const playerFile = "src/components/media/self-hosted-video-player.tsx";
  const videoFile = "public/internal/video/querypie-self-hosted-video-demo.mp4";
  const posterFile = "public/internal/video/querypie-self-hosted-video-poster.svg";

  assert.equal(sourceExists(routeFile), true, `${routeFile} should exist`);
  assert.equal(sourceExists(playerFile), true, `${playerFile} should exist`);
  assert.equal(sourceExists(videoFile), true, `${videoFile} should exist`);
  assert.equal(sourceExists(posterFile), true, `${posterFile} should exist`);

  const routeSource = readSource(routeFile);
  const playerSource = readSource(playerFile);

  assert.match(routeSource, /title:\s*"Internal Video Demo \| QueryPie AI"/);
  assert.match(routeSource, /canonical:\s*"\/internal\/video"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /@\/components\/media\/self-hosted-video-player/);
  assert.match(routeSource, /SelfHostedVideoPlayer/);
  assert.match(routeSource, /\/internal\/video\/querypie-self-hosted-video-demo\.mp4/);
  assert.match(routeSource, /\/internal\/video\/querypie-self-hosted-video-poster\.svg/);
  assert.match(routeSource, /type:\s*"video\/mp4"/);
  assert.match(routeSource, /preload=&quot;metadata&quot;/);
  assert.match(routeSource, /object storage behind a QueryPie-owned CDN domain/);
  assert.match(routeSource, /media\.querypie\.ai/);
  assert.match(routeSource, /Out of scope for this PR/);
  assert.doesNotMatch(routeSource, /youtube\.com|youtu\.be|<iframe/i);

  assert.match(playerSource, /export type SelfHostedVideoSource/);
  assert.match(playerSource, /export type SelfHostedVideoTrack/);
  assert.match(playerSource, /<video/);
  assert.match(playerSource, /playsInline=\{playsInline\}/);
  assert.match(playerSource, /preload=\{preload\}/);
  assert.match(playerSource, /<source key=\{`\$\{source\.type\}:\$\{source\.src\}`\}/);
  assert.match(playerSource, /<track/);
  assert.match(playerSource, /fallbackDownloadLabel/);
  assert.doesNotMatch(playerSource, /youtube\.com|youtu\.be|<iframe/i);
});
