#!/usr/bin/env python3
import argparse
import json
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

MAX_REASON_CHARS = 2400
MAX_INLINE_CHARS = 160
MAX_LOG_REASON_CHARS = 800
ELLIPSIS = "…"
ZERO_WIDTH = "\u200b"
SECRET_QUERY = re.compile(
    r"^(?:x-amz-|x-goog-|token$|access_token$|signature$|sig$|expires$|credential$|key$|api_key$|apikey$|authorization$|auth$|password$|secret$|client_secret$)",
    re.IGNORECASE,
)
TOKEN_PATTERNS = [
    (re.compile(r"\bBearer\s+[A-Za-z0-9._~+/=-]+", re.IGNORECASE), "Bearer REDACTED"),
    (re.compile(r"\b(?:gh[opsu]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,})\b"), "REDACTED"),
    (re.compile(r"\bxox(?:a|b|p|s|r)-[A-Za-z0-9-]{10,}\b"), "REDACTED"),
]


def redact_string(value: str) -> str:
    redacted = value
    for pattern, replacement in TOKEN_PATTERNS:
        redacted = pattern.sub(replacement, redacted)

    def redact_url(match: re.Match[str]) -> str:
        candidate = match.group(0)
        try:
            parts = urlsplit(candidate)
            query = urlencode([
                (key, "REDACTED" if SECRET_QUERY.search(key) else item)
                for key, item in parse_qsl(parts.query, keep_blank_values=True)
            ], doseq=True)
            return urlunsplit((parts.scheme, parts.netloc, parts.path, query, parts.fragment))
        except Exception:
            return candidate

    return re.sub(r"https?://[^\s)\]>\"']+", redact_url, redacted)


def trim(value: str, limit: int) -> str:
    if len(value) <= limit:
        return value
    return value[: max(0, limit - len(ELLIPSIS))].rstrip() + ELLIPSIS


def sanitize_common(value: str) -> str:
    text = redact_string(value or "")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = "".join(char for char in text if char == "\n" or char == "\t" or ord(char) >= 32)
    text = text.replace("\t", "  ")
    text = text.replace("```", f"``{ZERO_WIDTH}`")
    return text.strip()


def sanitize_inline(value: str, limit: int = MAX_INLINE_CHARS, *, default: str = "unavailable") -> str:
    text = sanitize_common(value)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        text = default
    return trim(text, limit)


def sanitize_reason(value: str) -> str:
    text = sanitize_common(value)
    if not text:
        return "see journal"
    return trim(text, MAX_REASON_CHARS)


def build_payload(*, mention: str, unit: str, run_id: str, stage: str, host: str, report_path: str, reason: str) -> dict:
    mention_text = sanitize_inline(mention, 120, default="")
    unit_text = sanitize_inline(unit)
    run_text = sanitize_inline(run_id)
    stage_text = sanitize_inline(stage)
    host_text = sanitize_inline(host)
    report_text = sanitize_inline(report_path, 320)
    sanitized_reason = sanitize_reason(reason)

    fallback_parts = []
    if mention_text:
        fallback_parts.append(mention_text)
    fallback_parts.append("Global publication sync failed")
    fallback_parts.append(f"Unit: {unit_text}")
    fallback_parts.append(f"Run: {run_text}")
    fallback_parts.append(f"Stage: {stage_text}")
    fallback_parts.append(f"Host: {host_text}")
    fallback = " — ".join([fallback_parts[0], " | ".join(fallback_parts[1:])]) if mention_text else " | ".join(fallback_parts)

    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": "Global publication sync failed", "emoji": True}},
    ]
    if mention_text:
        blocks.append({"type": "section", "text": {"type": "mrkdwn", "text": f"{mention_text} Please investigate this failure."}})
    blocks.append(
        {
            "type": "section",
            "fields": [
                {"type": "mrkdwn", "text": f"*Unit*\n{unit_text}"},
                {"type": "mrkdwn", "text": f"*Run*\n{run_text}"},
                {"type": "mrkdwn", "text": f"*Stage*\n{stage_text}"},
                {"type": "mrkdwn", "text": f"*Host*\n{host_text}"},
            ],
        }
    )
    blocks.append({"type": "context", "elements": [{"type": "mrkdwn", "text": f"*Report* {report_text}"}]})
    blocks.append(
        {
            "type": "container",
            "title": {"type": "plain_text", "text": "Failure reason", "emoji": True},
            "is_collapsible": True,
            "default_collapsed": True,
            "child_blocks": [
                {"type": "section", "text": {"type": "mrkdwn", "text": sanitized_reason}},
            ],
        }
    )

    return {
        "payload": {"text": fallback, "blocks": blocks},
        "logMessage": trim(
            f"Global publication sync failed | unit={unit_text} | run={run_text} | stage={stage_text} | host={host_text} | report={report_text} | reason={trim(sanitized_reason.replace(chr(10), ' | '), MAX_LOG_REASON_CHARS)}",
            1400,
        ),
        "sanitizedReason": sanitized_reason,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mention", default="")
    parser.add_argument("--unit", default="unavailable")
    parser.add_argument("--run-id", default="unavailable")
    parser.add_argument("--stage", default="unavailable")
    parser.add_argument("--host", default="unavailable")
    parser.add_argument("--report-path", default="unavailable")
    parser.add_argument("--reason", default="see journal")
    args = parser.parse_args()
    print(json.dumps(build_payload(
        mention=args.mention,
        unit=args.unit,
        run_id=args.run_id,
        stage=args.stage,
        host=args.host,
        report_path=args.report_path,
        reason=args.reason,
    ), ensure_ascii=False))
