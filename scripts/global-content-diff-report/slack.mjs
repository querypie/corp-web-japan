import { SOURCE_FAMILIES } from "./source-family-map.mjs";

const ITEMS_PER_CONTAINER = 10;
const CONTAINERS_PER_PAYLOAD = 8;
const MAX_TITLE_LENGTH = 96;

const FAMILY_LABELS = Object.freeze({
  news: "News",
  blog: "Blog",
  whitepapers: "Whitepapers",
  "use-cases": "Use cases",
  manuals: "Manuals",
  events: "Events",
  glossary: "Glossary",
  "introduction-deck": "Introduction deck",
});

function escapeMrkdwn(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function truncate(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function familyLabel(family) {
  return FAMILY_LABELS[family] || family;
}

function candidateEvidenceText(item) {
  const candidates = item.possibleJapanMatches || [];
  if (!candidates.length) return "";
  const rendered = candidates.slice(0, 3).map((candidate) => {
    const targetPath = escapeMrkdwn(candidate.targetPath);
    const signals = escapeMrkdwn((candidate.signals || []).join(", "));
    return `\`${targetPath}\` (${signals})`;
  });
  const omitted = candidates.length > 3 ? ` · +${candidates.length - 3} omitted` : "";
  return `\nPossible Japan match · ${rendered.join(" · ")}${omitted}`;
}

function itemText(item, metadata) {
  let originalUrl;
  try {
    originalUrl = new URL(item.sourceUrl);
  } catch {
    throw new Error(`invalid original URL: ${item.identity}`);
  }
  if (originalUrl.protocol !== "https:") throw new Error(`non-HTTPS original URL: ${item.identity}`);
  if (!/^src\/content\/(?:news|documentation\/[a-z0-9-]+)\/cnt_\d+$/.test(item.sourcePath || "")) {
    throw new Error(`invalid Global source path: ${item.identity}`);
  }

  const title = escapeMrkdwn(truncate(item.title, MAX_TITLE_LENGTH));
  const family = escapeMrkdwn(familyLabel(item.targetFamily));
  const date = escapeMrkdwn(item.dateIso);
  const identity = escapeMrkdwn(item.identity);
  const domain = escapeMrkdwn(originalUrl.hostname.replace(/^www\./, ""));
  const originalHref = escapeMrkdwn(originalUrl.href);
  const sourcePath = item.sourcePath.split("/").map(encodeURIComponent).join("/");
  const githubHref = `https://github.com/querypie/corp-web-v2/tree/${metadata.globalSha}/${sourcePath}`;
  return `*${title}*\n_${family} · ${date}_ · Composite identity · \`${identity}\`\n<${originalHref}|Original · ${domain}> · <${githubHref}|GitHub source>${candidateEvidenceText(item)}`;
}

function statusContainer(status, allItems, items, part, metadata) {
  return {
    type: "container",
    title: {
      type: "plain_text",
      text: `${status} · ${allItems.length} item${allItems.length === 1 ? "" : "s"}${part ? ` · ${part}` : ""}`,
    },
    is_collapsible: true,
    default_collapsed: status !== "Untracked",
    child_blocks: items.map((item) => ({
      type: "section",
      text: { type: "mrkdwn", text: itemText(item, metadata) },
    })),
  };
}

function chunk(list, size) {
  const chunks = [];
  for (let index = 0; index < list.length; index += size) {
    chunks.push(list.slice(index, index + size));
  }
  return chunks;
}

const FAMILY_ORDER = Object.freeze(SOURCE_FAMILIES.map(({ targetFamily }) => targetFamily));
const STATUS_ORDER = Object.freeze(["Untracked", "Ignored"]);

function compareSlackItems(left, right) {
  return FAMILY_ORDER.indexOf(left.targetFamily) - FAMILY_ORDER.indexOf(right.targetFamily)
    || String(right.dateIso || "").localeCompare(String(left.dateIso || ""))
    || String(left.identity).localeCompare(String(right.identity));
}

function formatJstTimestamp(timestamp) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} JST`;
}

function commitLine(label, repository, sha) {
  const escapedSha = escapeMrkdwn(sha);
  return `${label} <https://github.com/${repository}/commit/${escapedSha}|${escapedSha.slice(0, 7)}>`;
}

function runContext(report, metadata, partNumber = 1, totalParts = 1) {
  return [
    totalParts > 1 ? `Part ${partNumber}/${totalParts}` : null,
    formatJstTimestamp(report.generatedAt),
    commitLine("Global", "querypie/corp-web-v2", metadata.globalSha),
    commitLine("Japan", "querypie/corp-web-japan", metadata.japanSha),
  ].filter(Boolean).join(" · ");
}

function summarizeCounts(report) {
  const families = FAMILY_ORDER
    .map((family) => [family, report.familyCounts?.[family] || 0])
    .filter(([, count]) => count > 0)
    .map(([family, count]) => `${familyLabel(family)} ${count}`)
    .join(" · ");
  return `Global ${report.counts.globalPublished} · Japan ${report.counts.japanPresent} · Global-only ${report.counts.globalOnly}${families ? ` · ${families}` : ""}`;
}

function validateHttpsUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`operations summary item has invalid ${label}`);
  }
  if (url.protocol !== "https:") throw new Error(`operations summary item has non-HTTPS ${label}`);
  return url.href;
}

function validateOperationsSummary(summary) {
  if (!summary || typeof summary !== "object" || Array.isArray(summary)) {
    throw new Error("operations summary must be an object");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(summary.dateJst || "")) {
    throw new Error("operations summary requires a JST date");
  }
  const countKeys = ["globalAdded", "existingJapanMatches", "newMdx", "baselineAdded", "baselineRemoved", "ignoreAdded", "ignoreRemoved"];
  for (const key of countKeys) {
    if (!Number.isInteger(summary[key]) || summary[key] < 0) throw new Error(`operations summary has invalid ${key}`);
  }
  if (!Array.isArray(summary.items) || summary.items.length > 20) {
    throw new Error("operations summary items must be an array with at most 20 entries");
  }
  for (const item of summary.items) {
    if (!/^(documentation|news):cnt_\d+$/.test(item?.identity || "")) {
      throw new Error("operations summary item has invalid identity");
    }
    for (const key of ["title", "targetFamily", "dateIso", "target", "verdict", "action"]) {
      if (typeof item[key] !== "string" || !item[key].trim()) throw new Error(`operations summary item requires ${key}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.dateIso)) throw new Error("operations summary item has invalid dateIso");
    validateHttpsUrl(item.globalUrl, "globalUrl");
    if (item.verdict === "Equivalent") validateHttpsUrl(item.japanUrl, "japanUrl");
  }
}

function reviewItemText({ title, targetFamily, dateIso, identity, result, globalUrl, japanUrl }) {
  const globalHref = escapeMrkdwn(validateHttpsUrl(globalUrl, "globalUrl"));
  const japanLink = japanUrl
    ? `<${escapeMrkdwn(validateHttpsUrl(japanUrl, "japanUrl"))}|Japan>`
    : "Japan match unavailable";
  return [
    `*${escapeMrkdwn(truncate(title, MAX_TITLE_LENGTH))}*`,
    `_${escapeMrkdwn(familyLabel(targetFamily))} · ${escapeMrkdwn(dateIso)}_ · \`${escapeMrkdwn(identity)}\``,
    escapeMrkdwn(result),
    `View: <${globalHref}|Global> · ${japanLink}`,
  ].join("\n");
}

function reviewContainer(title, items) {
  return {
    type: "container",
    title: { type: "plain_text", text: `${title} · ${items.length} item${items.length === 1 ? "" : "s"}` },
    is_collapsible: true,
    default_collapsed: true,
    child_blocks: items.map((item) => ({
      type: "section",
      text: { type: "mrkdwn", text: reviewItemText(item) },
    })),
  };
}

function operationsSummaryBlock(report) {
  const summary = report.operationsSummary;
  validateOperationsSummary(summary);
  const synced = summary.items.filter(({ verdict }) => verdict === "Equivalent").length;
  const reviewNeeded = report.items.filter(({ status }) => status === "Untracked").length;
  const ignored = report.items.filter(({ status }) => status === "Ignored").length;
  return {
    type: "section",
    text: { type: "mrkdwn", text: `Today · Synced ${synced}\nCurrent · Review needed ${reviewNeeded} · Ignored ${ignored}` },
  };
}

function operationsContainers(report) {
  const syncedItems = report.operationsSummary.items
    .filter(({ verdict }) => verdict === "Equivalent")
    .map((item) => ({
      ...item,
      result: `Existing Japan content matched · ${item.action}`,
    }));
  const reviewItems = report.items
    .filter(({ status }) => status === "Untracked")
    .sort(compareSlackItems)
    .map((item) => ({
      ...item,
      globalUrl: item.sourceUrl,
      japanUrl: null,
      result: item.possibleJapanMatches?.length
        ? "Possible Japan match found · Review required"
        : "No matching Japan content confirmed",
    }));
  const ignoredItems = report.items
    .filter(({ status }) => status === "Ignored")
    .sort(compareSlackItems)
    .map((item) => ({
      ...item,
      globalUrl: item.sourceUrl,
      japanUrl: null,
      result: "Intentionally excluded from Japan sync",
    }));
  return [
    syncedItems.length ? reviewContainer("Synced today", syncedItems) : null,
    reviewItems.length ? reviewContainer("Review needed", reviewItems) : null,
    ignoredItems.length ? reviewContainer("Ignored", ignoredItems) : null,
  ].filter(Boolean);
}

function operationsContext(report, metadata, partNumber, totalParts) {
  return [
    `Global ${report.counts.globalPublished} · Japan ${report.counts.japanPresent}`,
    runContext(report, metadata, partNumber, totalParts),
  ].join("\n");
}

function renderPayload({ report, metadata, partNumber, totalParts, containers, isFirst }) {
  const partLabel = `Part ${partNumber} of ${totalParts}`;
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: report.operationsSummary ? "🌐 Global Content Review" : "🌐 Global-only report" },
    },
  ];

  if (isFirst) {
    if (report.operationsSummary) {
      blocks.push(operationsSummaryBlock(report));
    } else {
      blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: summarizeCounts(report) },
      });
    }
  }

  blocks.push({
    type: "context",
    elements: [{
      type: "mrkdwn",
      text: report.operationsSummary
        ? operationsContext(report, metadata, partNumber, totalParts)
        : runContext(report, metadata, partNumber, totalParts),
    }],
  });

  blocks.push(...containers);

  return {
    text: `${report.operationsSummary ? "Global Content Review" : "Global-only report"}${totalParts > 1 ? ` — ${partLabel}` : ""}${isFirst ? ` — ${summarizeCounts(report)}` : ""}`,
    blocks,
  };
}

export function buildSlackPayloads(report, metadata) {
  if (!/^[0-9a-f]{40}$/.test(metadata?.globalSha || "") || !/^[0-9a-f]{40}$/.test(metadata?.japanSha || "")) {
    throw new Error("Slack metadata requires full commit SHAs");
  }

  if (report?.operationsSummary) {
    const containers = operationsContainers(report);
    const payloadContainerGroups = containers.length ? chunk(containers, CONTAINERS_PER_PAYLOAD) : [[]];
    return payloadContainerGroups.map((containerGroup, index) => renderPayload({
      report,
      metadata,
      partNumber: index + 1,
      totalParts: payloadContainerGroups.length,
      containers: containerGroup,
      isFirst: index === 0,
    }));
  }

  if (!report?.items?.length) {
    return [{
      text: "No Global-only content",
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🌐 Global-only report" },
        },
        { type: "section", text: { type: "mrkdwn", text: "No Global-only content." } },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: runContext(report, metadata) }],
        },
      ],
    }];
  }

  const containers = [];
  for (const status of STATUS_ORDER) {
    const statusItems = report.items
      .filter((item) => item.status === status)
      .sort(compareSlackItems);
    if (statusItems.length === 0) continue;

    const parts = chunk(statusItems, ITEMS_PER_CONTAINER);
    const split = parts.length > 1;
    parts.forEach((items, index) => {
      containers.push(statusContainer(status, statusItems, items, split ? `Part ${index + 1} of ${parts.length}` : null, metadata));
    });
  }

  const payloadContainerGroups = containers.length ? chunk(containers, CONTAINERS_PER_PAYLOAD) : [[]];
  return payloadContainerGroups.map((containerGroup, index) => renderPayload({
    report,
    metadata,
    partNumber: index + 1,
    totalParts: payloadContainerGroups.length,
    containers: containerGroup,
    isFirst: index === 0,
  }));
}

export async function sendSlackPayloads({ webhookUrl, payloads, fetchImpl = fetch }) {
  if (!webhookUrl?.startsWith("https://hooks.slack.com/services/")) {
    throw new Error("GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL must be a Slack Incoming Webhook URL");
  }

  for (const payload of payloads) {
    const response = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    if (!response.ok || body !== "ok") {
      throw new Error(`Slack rejected Global content diff payload: HTTP ${response.status}`);
    }
  }
}
