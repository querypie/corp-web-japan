import { SOURCE_FAMILIES } from "../global-documentation-sync/source-family-map.mjs";

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

function itemText(item) {
  let globalUrl;
  try {
    globalUrl = new URL(item.globalUrl);
  } catch {
    throw new Error(`missing QueryPie Global detail URL: ${item.identity}`);
  }
  if (globalUrl.protocol !== "https:" || globalUrl.hostname !== "www.querypie.com") {
    throw new Error(`invalid QueryPie Global detail URL: ${item.identity}`);
  }

  const title = escapeMrkdwn(truncate(item.title, MAX_TITLE_LENGTH));
  const family = escapeMrkdwn(familyLabel(item.targetFamily));
  const date = escapeMrkdwn(item.dateIso);
  const identity = escapeMrkdwn(item.identity);
  return `*<${globalUrl.href}|${title}>*\n_${family} · ${date}_ · \`${identity}\``;
}

function statusContainer(status, allItems, items, part) {
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
      text: { type: "mrkdwn", text: itemText(item) },
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

function ignoreInstructionsBlock() {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Ignore an item*\nCopy an identity above → <https://github.com/querypie/corp-web-japan/actions/workflows/ignore-global-content-diff.yml|Open workflow> → paste it → review and merge the PR.\nAfter merge, the next report moves it to `Ignored`.",
    },
  };
}

function formatKstTimestamp(timestamp) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} KST`;
}

function commitLine(label, repository, sha) {
  const escapedSha = escapeMrkdwn(sha);
  return `${label} · <https://github.com/${repository}/commit/${escapedSha}|${escapedSha.slice(0, 7)}>`;
}

function runContext(report, metadata, partNumber = 1, totalParts = 1) {
  return [
    totalParts > 1 ? `Part ${partNumber} of ${totalParts}` : null,
    `Run · ${formatKstTimestamp(report.generatedAt)}`,
    commitLine("Global", "querypie/corp-web-v2", metadata.globalSha),
    commitLine("Japan", "querypie/corp-web-japan", metadata.japanSha),
  ].filter(Boolean).join("\n");
}

function summarizeCounts(report) {
  const families = FAMILY_ORDER
    .map((family) => [family, report.familyCounts?.[family] || 0])
    .filter(([, count]) => count > 0)
    .map(([family, count]) => `${familyLabel(family)} ${count}`)
    .join(" · ");
  return `Global published ${report.counts.globalPublished} · Japan present ${report.counts.japanPresent} · Global-only ${report.counts.globalOnly}${families ? ` · ${families}` : ""}`;
}

function renderPayload({ report, metadata, partNumber, totalParts, containers, isFirst }) {
  const partLabel = `Part ${partNumber} of ${totalParts}`;
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "🌐 Global-only content report" },
    },
  ];

  if (isFirst) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: summarizeCounts(report) },
    });
  }

  blocks.push({
    type: "context",
    elements: [{
      type: "mrkdwn",
      text: runContext(report, metadata, partNumber, totalParts),
    }],
  });

  blocks.push(...containers);

  if (isFirst) blocks.push(ignoreInstructionsBlock());

  return {
    text: `Global-only content report${totalParts > 1 ? ` — ${partLabel}` : ""}${isFirst ? ` — ${summarizeCounts(report)}` : ""}`,
    blocks,
  };
}

export function buildSlackPayloads(report, metadata) {
  if (!report?.items?.length) {
    return [{
      text: "No Global-only content",
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🌐 Global-only content report" },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: "No Global-only content." },
        },
        {
          type: "context",
          elements: [{
            type: "mrkdwn",
            text: runContext(report, metadata),
          }],
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
      containers.push(statusContainer(status, statusItems, items, split ? `Part ${index + 1} of ${parts.length}` : null));
    });
  }

  const payloadContainerGroups = chunk(containers, CONTAINERS_PER_PAYLOAD);
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
