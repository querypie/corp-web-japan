import { test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import * as http from 'node:http';
import * as https from 'node:https';
import * as path from 'node:path';

const productionOrigin = 'https://querypie.ai';
const defaultTargetOrigin = 'https://stage.querypie.ai';
const productionSitemapUrl = `${productionOrigin}/sitemap.xml`;
const targetOrigin = stripTrailingSlash(process.env.SITEMAP_E2E_BASE_URL ?? defaultTargetOrigin);
const archivedSitemapPath = path.resolve(process.cwd(), 'tests-local/fixtures/sitemap.2026-05-22.xml');
const requiredPublicUrlsPath = path.resolve(process.cwd(), 'tests-local/fixtures/required-public-urls.txt');
const requestTimeoutMs = 30000;
const redirectLimit = 10;
const defaultConcurrency = 8;
const defaultMaxRequestsPer10Seconds = 70;
const rateLimitWindowMs = 10000;
const concurrency = positiveIntegerFromEnv('SITEMAP_E2E_CONCURRENCY', defaultConcurrency);
const maxRequestsPer10Seconds = positiveIntegerFromEnv(
  'SITEMAP_E2E_MAX_REQUESTS_PER_10S',
  defaultMaxRequestsPer10Seconds,
);
const requestIntervalMs = Math.ceil(rateLimitWindowMs / maxRequestsPer10Seconds);
let nextRequestAt = 0;
let requestThrottleQueue = Promise.resolve();

test.setTimeout(10 * 60 * 1000);

function stripTrailingSlash(value) {
  return value.replace(/\/$/, '');
}

function parseIntegerFromEnv(name, fallback) {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;

  const parsedValue = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function positiveIntegerFromEnv(name, fallback) {
  return Math.max(1, parseIntegerFromEnv(name, fallback));
}

function delay(ms) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForRequestSlot() {
  const previousSlot = requestThrottleQueue;
  let releaseSlot;
  requestThrottleQueue = new Promise((resolve) => {
    releaseSlot = resolve;
  });

  await previousSlot;

  const waitMs = Math.max(0, nextRequestAt - Date.now());
  if (waitMs > 0) {
    await delay(waitMs);
  }

  nextRequestAt = Date.now() + requestIntervalMs;
  releaseSlot();
}

async function requestTargetOnce(url) {
  await waitForRequestSlot();
  return requestOnce(url);
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractLocUrls(xml) {
  return Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g))
    .map((match) => decodeXmlEntities(match[1].trim()))
    .filter((url) => url.startsWith(`${productionOrigin}/`));
}

function extractRequiredPublicUrls(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .filter((url) => url.startsWith(`${productionOrigin}/`));
}

function toTargetUrl(url) {
  const parsed = new URL(url);
  return `${targetOrigin}${parsed.pathname}${parsed.search}`;
}

function statusChain(result) {
  if (result.statuses.length === 0) return 'no-response';
  return result.statuses.join(' -> ');
}

function redirectSummary(result) {
  if (result.redirectUrls.length === 0) return 'redirects=-';
  return `redirects=${result.redirectUrls.join(' -> ')}`;
}

function formatResultLine(result) {
  const finalStatus = result.finalStatus ?? 'ERR';
  const suffix = result.error ? ` error=${result.error}` : '';
  return `${result.ok ? 'OK' : 'ERROR'} status=${statusChain(result)} final=${finalStatus} source=${result.sourceUrl} target=${result.targetUrl} ${redirectSummary(result)} finalUrl=${result.finalUrl}${suffix}`;
}

function formatFailureMessage(errors, total) {
  return [
    'Sitemap URL check failed.',
    'Every archived/live sitemap URL and required public URL should return 200 on the target origin, allowing redirects only when the final response is 200.',
    `Summary: total=${total} errors=${errors.length}`,
    'Errors:',
    ...errors.map((error) => `- ${formatResultLine(error)}`),
  ].join('\n');
}

function failWithControlledMessage(message) {
  const error = new Error(message);
  error.stack = `Error: ${message}`;
  throw error;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'QueryPie Japan sitemap E2E',
      Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function requestOnce(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'http:' ? http : https;
    const request = transport.request(
      parsed,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'QueryPie Japan sitemap E2E',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      },
      (response) => {
        response.resume();
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode ?? 0,
            location: response.headers.location,
          });
        });
      },
    );

    request.setTimeout(requestTimeoutMs, () => {
      request.destroy(new Error(`timeout after ${requestTimeoutMs}ms`));
    });
    request.on('error', reject);
    request.end();
  });
}

async function checkUrl(sourceUrl) {
  const targetUrl = toTargetUrl(sourceUrl);
  const statuses = [];
  const redirectUrls = [];
  let currentUrl = targetUrl;

  try {
    for (let redirectCount = 0; redirectCount <= redirectLimit; redirectCount += 1) {
      const response = await requestTargetOnce(currentUrl);
      statuses.push(response.statusCode);

      if (response.statusCode >= 300 && response.statusCode < 400) {
        if (!response.location) {
          return {
            sourceUrl,
            targetUrl,
            statuses,
            redirectUrls,
            finalUrl: currentUrl,
            finalStatus: response.statusCode,
            ok: false,
            error: 'redirect without Location header',
          };
        }

        const nextUrl = new URL(response.location, currentUrl).toString();
        redirectUrls.push(nextUrl);
        currentUrl = nextUrl;
        continue;
      }

      return {
        sourceUrl,
        targetUrl,
        statuses,
        redirectUrls,
        finalUrl: currentUrl,
        finalStatus: response.statusCode,
        ok: response.statusCode === 200,
      };
    }

    return {
      sourceUrl,
      targetUrl,
      statuses,
      redirectUrls,
      finalUrl: currentUrl,
      finalStatus: statuses.length > 0 ? statuses[statuses.length - 1] : null,
      ok: false,
      error: `too many redirects; limit=${redirectLimit}`,
    };
  } catch (error) {
    return {
      sourceUrl,
      targetUrl,
      statuses,
      redirectUrls,
      finalUrl: currentUrl,
      finalStatus: statuses.length > 0 ? statuses[statuses.length - 1] : null,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

test('archived and live production sitemap URLs plus required public URLs resolve on the target origin', async () => {
  const archivedXml = readFileSync(archivedSitemapPath, 'utf8');
  const requiredPublicUrlsText = readFileSync(requiredPublicUrlsPath, 'utf8');
  const liveXml = await fetchText(productionSitemapUrl);
  const archivedUrls = extractLocUrls(archivedXml);
  const liveUrls = extractLocUrls(liveXml);
  const requiredPublicUrls = extractRequiredPublicUrls(requiredPublicUrlsText);
  const urls = Array.from(new Set(archivedUrls.concat(liveUrls, requiredPublicUrls))).sort();

  console.log(`Sitemap source: archived=${archivedSitemapPath}`);
  console.log(`Sitemap source: live=${productionSitemapUrl}`);
  console.log(`Required public URL source: ${requiredPublicUrlsPath}`);
  console.log(`Archived URL count: ${archivedUrls.length}`);
  console.log(`Live URL count: ${liveUrls.length}`);
  console.log(`Required public URL count: ${requiredPublicUrls.length}`);
  console.log(`Unique URL count: ${urls.length}`);
  console.log(`Target origin: ${targetOrigin}`);
  console.log(`Request concurrency: ${concurrency}`);
  console.log(`Max target requests per 10s: ${maxRequestsPer10Seconds}`);
  console.log(`Target request interval: ${requestIntervalMs}ms`);
  console.log('Results:');

  const results = await mapWithConcurrency(urls, concurrency, checkUrl);
  for (const result of results) {
    console.log(formatResultLine(result));
  }

  const errors = results.filter((result) => !result.ok);
  const direct200 = results.filter((result) => result.statuses.length === 1 && result.finalStatus === 200).length;
  const redirect200 = results.filter((result) => result.redirectUrls.length > 0 && result.finalStatus === 200).length;

  console.log(`Summary: total=${results.length} direct200=${direct200} redirectTo200=${redirect200} errors=${errors.length}`);
  console.log('Errors:');
  if (errors.length === 0) {
    console.log('- none');
  } else {
    for (const error of errors) {
      console.log(`- ${formatResultLine(error)}`);
    }
  }

  if (errors.length > 0) {
    failWithControlledMessage(formatFailureMessage(errors, results.length));
  }
});
