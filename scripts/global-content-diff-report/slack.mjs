import { SOURCE_FAMILIES } from "../global-documentation-sync/source-family-map.mjs";

const ITEMS_PER_CONTAINER = 10;
const CONTAINERS_PER_PAYLOAD = 8;
const MAX_TITLE_LENGTH = 180;

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
  return String(value || "").slice(0, maxLength);
}

function familyLabel(family) {
  return FAMILY_LABELS[family] || family;
}

function itemText(item) {
  const title = escapeMrkdwn(truncate(item.title, MAX_TITLE_LENGTH));
  const details = [item.identity, item.dateIso, item.status].filter(Boolean).join(" · ");
  return `*<${item.sourceUrl}|${title}>*\n${escapeMrkdwn(details)}`;
}

function familyContainer(family, items, part) {
  return {
    type: "container",
    title: {
      type: "plain_text",
      text: `${familyLabel(family)} · ${items.length} item${items.length === 1 ? "" : "s"}${part ? ` · ${part}` : ""}`,
    },
    is_collapsible: true,
    default_collapsed: true,
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
      text: `${partLabel}${isFirst ? ` · Run ${report.generatedAt}` : ""} · Global ${metadata.globalSha} · Japan ${metadata.japanSha}`,
    }],
  });

  blocks.push(...containers);

  return {
    text: `Global-only content report — ${partLabel}${isFirst ? ` — ${summarizeCounts(report)}` : ""}`,
    blocks,
  };
}

export function buildSlackPayloads(report, metadata) {
  if (!report?.items?.length) {
    return [{
      text: `No Global-only content — Part 1 of 1`,
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
            text: `Part 1 of 1 · Run ${report.generatedAt} · Global ${metadata.globalSha} · Japan ${metadata.japanSha}`,
          }],
        },
      ],
    }];
  }

  const grouped = FAMILY_ORDER
    .map((family) => ({ family, items: report.items.filter((item) => item.targetFamily === family) }))
    .filter(({ items }) => items.length > 0);

  const containers = [];
  for (const group of grouped) {
    const parts = chunk(group.items, ITEMS_PER_CONTAINER);
    const split = parts.length > 1;
    parts.forEach((items, index) => {
      containers.push(familyContainer(group.family, items, split ? `Part ${index + 1} of ${parts.length}` : null));
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
