import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/internal/video renders a noindex self-hosted video demo backed by the downloaded AIP hero video", () => {
  const routeFile = "src/app/internal/video/page.tsx";
  const playerFile = "src/components/media/self-hosted-video-player.tsx";
  const videoFile = "public/internal/video/querypie-aip-hero-youtube.mp4";
  const oldSyntheticVideoFile = "public/internal/video/querypie-self-hosted-video-demo.mp4";
  const oldSyntheticPosterFile = "public/internal/video/querypie-self-hosted-video-poster.svg";
  const aipPosterFile = "public/services/aip/aip-video-thumb-jp.png";

  assert.equal(sourceExists(routeFile), true, `${routeFile} should exist`);
  assert.equal(sourceExists(playerFile), true, `${playerFile} should exist`);
  assert.equal(sourceExists(videoFile), true, `${videoFile} should exist`);
  assert.equal(sourceExists(aipPosterFile), true, `${aipPosterFile} should exist`);
  assert.equal(sourceExists(oldSyntheticVideoFile), false, `${oldSyntheticVideoFile} should be replaced`);
  assert.equal(sourceExists(oldSyntheticPosterFile), false, `${oldSyntheticPosterFile} should be replaced`);

  const routeSource = readSource(routeFile);
  const playerSource = readSource(playerFile);

  assert.match(routeSource, /title:\s*"Internal Video Demo \| QueryPie AI"/);
  assert.match(routeSource, /canonical:\s*"\/internal\/video"/);
  assert.match(routeSource, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(routeSource, /@\/components\/media\/self-hosted-video-player/);
  assert.match(routeSource, /SelfHostedVideoPlayer/);
  assert.match(routeSource, /\/internal\/video\/querypie-aip-hero-youtube\.mp4/);
  assert.match(routeSource, /\/services\/aip\/aip-video-thumb-jp\.png/);
  assert.match(routeSource, /type:\s*"video\/mp4"/);
  assert.match(routeSource, /max-w-\[1024px\]/);
  assert.match(routeSource, /frameClassName="aspect-video w-full"/);
  assert.match(routeSource, /square corners/);
  assert.match(routeSource, /same centered play icon treatment/);
  assert.match(routeSource, /object storage behind a QueryPie-owned CDN domain/);
  assert.match(routeSource, /media\.querypie\.ai/);
  assert.doesNotMatch(routeSource, /rounded-\[28px\]/);
  assert.doesNotMatch(routeSource, /querypie-self-hosted-video-demo|querypie-self-hosted-video-poster/);
  assert.doesNotMatch(routeSource, /youtube\.com|youtu\.be|<iframe/i);

  assert.match(playerSource, /^"use client";/);
  assert.match(playerSource, /export type SelfHostedVideoSource/);
  assert.match(playerSource, /export type SelfHostedVideoTrack/);
  assert.match(playerSource, /<video/);
  assert.match(playerSource, /playsInline=\{playsInline\}/);
  assert.match(playerSource, /preload=\{preload\}/);
  assert.match(playerSource, /showPosterOverlay = true/);
  assert.match(playerSource, /Play \$\{title\}/);
  assert.match(playerSource, /<Image/);
  assert.match(playerSource, /viewBox="0 0 80 80"/);
  assert.match(playerSource, /M75 40C75 59\.33 59\.33 75 40 75/);
  assert.match(playerSource, /<source key=\{`\$\{source\.type\}:\$\{source\.src\}`\}/);
  assert.match(playerSource, /<track/);
  assert.match(playerSource, /fallbackDownloadLabel/);
  assert.doesNotMatch(playerSource, /shadow-\[/);
  assert.doesNotMatch(playerSource, /youtube\.com|youtu\.be|<iframe/i);
});
