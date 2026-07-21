import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { externalMediaIdentity } from "./external-media.mjs";
import { SCHEMA_VERSION, validateArtifact } from "./lib.mjs";
import { redactSecrets } from "./redaction.mjs";

export function publicationRoute(candidate) {
  const roots = {
    blog: "blog", whitepapers: "whitepapers", events: "events", manuals: "manuals",
    glossary: "glossary", news: "news", "use-cases": "use-cases", "introduction-deck": "introduction-deck",
    "demo/aip": "demo/aip", "demo/acp": "demo/acp",
  };
  const root = roots[candidate.targetFamily];
  if (!root) throw new Error(`unsupported browser route family: ${candidate.targetFamily}`);
  return `/${root}/${candidate.targetId}/${candidate.meta.id}`;
}

export function assessPageMetrics(metrics) {
  const findings = [];
  if (metrics.scrollWidth > metrics.clientWidth) findings.push(`horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  metrics.images.forEach((image, index) => {
    if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) findings.push(`image ${index} failed to decode`);
    if (image.width <= 0 || image.height <= 0) findings.push(`image ${index} has zero rendered size`);
  });
  (metrics.media || []).forEach((media, index) => {
    if (media.width <= 0 || media.height <= 0) findings.push(`media ${index} has zero rendered size`);
    if (media.tag === "video" && (!(media.videoWidth > 0) || !(media.videoHeight > 0) || !(media.duration > 0))) findings.push(`video ${index} failed metadata load`);
    if (media.tag === "iframe" && !/^https:\/\//.test(media.src)) findings.push(`iframe ${index} is not HTTPS`);
  });
  return { status: findings.length ? "failed" : "passed", findings };
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`preview server exited with ${child.exitCode}`);
    try { const response = await fetch(url); if (response.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`preview server did not become ready: ${url}`);
}

export async function stopPreviewServer(server) {
  if (!server.pid || server.exitCode !== null) return;
  const closed = once(server, "close").then(() => true);
  const kill = (signal) => {
    if (process.platform === "win32") server.kill(signal);
    else process.kill(-server.pid, signal);
  };
  try { kill("SIGTERM"); } catch (error) { if (error.code !== "ESRCH") throw error; }
  if (await Promise.race([closed, new Promise((resolve) => setTimeout(() => resolve(false), 5_000))])) return;
  try { kill("SIGKILL"); } catch (error) { if (error.code !== "ESRCH") throw error; }
  await closed;
}

export async function runBrowserQa({ targetRepo, candidate, reportsDir, port = 43129 }) {
  const route = publicationRoute(candidate);
  const url = `http://127.0.0.1:${port}${route}`;
  const server = spawn("npm", ["start", "--", "-p", String(port)], { cwd: targetRepo, env: process.env, stdio: ["ignore", "ignore", "pipe"], detached: process.platform !== "win32" });
  let serverError = "";
  server.stderr.on("data", (chunk) => { serverError = `${serverError}${chunk}`.slice(-4000); });
  try {
    await waitForServer(url, server);
    const { chromium } = await import("playwright");
    let browser;
    try { browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || "chrome" }); }
    catch { browser = await chromium.launch({ headless: true }); }
    const results = [];
    try {
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        const page = await browser.newPage({ viewport });
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
        const height = await page.evaluate(() => document.body.scrollHeight);
        for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
          await page.evaluate((y) => window.scrollTo(0, y), Math.floor(height * ratio));
          await page.waitForTimeout(250);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        const metrics = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          images: [...document.querySelectorAll("main img")].map((image) => {
            const rect = image.getBoundingClientRect();
            return { complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, width: rect.width, height: rect.height, src: image.currentSrc || image.src };
          }),
          pdfLinks: [...document.querySelectorAll('main a[href*=".pdf"]')].map((anchor) => anchor.href),
          media: [...document.querySelectorAll("main video, main iframe")].map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(), src: element.currentSrc || element.src || "",
              width: rect.width, height: rect.height,
              videoWidth: element.videoWidth || null, videoHeight: element.videoHeight || null,
              duration: Number.isFinite(element.duration) ? element.duration : null,
            };
          }),
        }));
        const assessment = assessPageMetrics(metrics);
        for (const href of metrics.pdfLinks) {
          const response = await page.request.fetch(href, { method: "HEAD" });
          if (!response.ok() || !/application\/pdf/i.test(response.headers()["content-type"] || "")) assessment.findings.push(`broken PDF: ${href}`);
        }
        const approvedExternalMedia = new Set((candidate.externalMedia || []).map(({ identity }) => identity));
        for (const media of metrics.media) {
          const mediaUrl = new URL(media.src, url);
          if (mediaUrl.origin !== new URL(url).origin) {
            let identity;
            try { identity = externalMediaIdentity(mediaUrl.href); }
            catch { assessment.findings.push(`unapproved external media: ${mediaUrl.href}`); continue; }
            if (!approvedExternalMedia.has(identity)) { assessment.findings.push(`external media not present in source: ${mediaUrl.href}`); continue; }
          }
          const response = await page.request.fetch(mediaUrl.href, { method: "HEAD", timeout: 20_000 });
          if (!response.ok()) assessment.findings.push(`broken media response: ${mediaUrl.href}`);
        }
        if (assessment.findings.length) assessment.status = "failed";
        const screenshot = path.join(reportsDir, `target-${viewport.width}x${viewport.height}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        results.push({ viewport, url, screenshot, metrics, ...assessment });
        await page.close();
      }
    } finally { await browser.close(); }
    const artifact = {
      schemaVersion: SCHEMA_VERSION, artifactType: "browser-results", runId: candidate.runId,
      sourceId: candidate.sourceId, results,
    };
    validateArtifact("browser-results", artifact);
    await mkdir(reportsDir, { recursive: true });
    await writeFile(path.join(reportsDir, "browser-results.json"), `${JSON.stringify(redactSecrets(artifact), null, 2)}\n`, { mode: 0o600 });
    return artifact;
  } catch (error) {
    throw new Error(`${error.message}${serverError ? `\n${serverError}` : ""}`);
  } finally {
    await stopPreviewServer(server);
  }
}
