#!/usr/bin/env bash
set -euo pipefail
unit="${1:-global-documentation-sync.service}"
latest=""
if [[ -n "${REPORTS_ROOT:-}" ]]; then
  latest=$(find "$REPORTS_ROOT" -name failure-summary.json -type f -print 2>/dev/null | sort | tail -1 || true)
fi
reason=""
if [[ -n "$latest" ]]; then
  reason=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("reason", ""))' "$latest")
fi
message="Global Documentation Sync failed: $unit on $(hostname) at $(date -u +%FT%TZ); report=${latest:-unavailable}; reason=${reason:-see journal}"
logger -t global-documentation-sync "$message"
if [[ -n "${ALERT_WEBHOOK_URL:-}" ]]; then
  payload=$(python3 -c 'import json,sys; print(json.dumps({"text": sys.argv[1]}))' "$message")
  curl --fail --silent --show-error --max-time 15 \
    -H 'Content-Type: application/json' -d "$payload" "$ALERT_WEBHOOK_URL" >/dev/null
fi
