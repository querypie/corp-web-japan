#!/usr/bin/env bash
set -euo pipefail
unit="${1:-global-documentation-sync.service}"
run_dir=""
if [[ -n "${REPORTS_ROOT:-}" ]]; then
  run_dir=$(find "$REPORTS_ROOT" -mindepth 1 -maxdepth 1 -type d -print 2>/dev/null | sort | tail -1 || true)
fi
run_id="unavailable"
stage="unavailable"
reason="see journal"
if [[ -n "$run_dir" && -f "$run_dir/run-status.json" ]]; then
  readarray -t status < <(python3 -c 'import json,sys; v=json.load(open(sys.argv[1])); print(v.get("runId", "unavailable")); print(v.get("stage", "unavailable")); print(v.get("reason", ""))' "$run_dir/run-status.json")
  run_id="${status[0]:-$run_id}"
  stage="${status[1]:-$stage}"
  reason="${status[2]:-$reason}"
fi
if [[ "$reason" == "see journal" && -n "$run_dir" && -f "$run_dir/failure-summary.json" ]]; then
  reason=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("reason", "see journal"))' "$run_dir/failure-summary.json")
fi
message="${ALERT_SLACK_MENTION:-} Global Documentation Sync failed
- Unit: $unit
- Run: $run_id
- Stage: $stage
- Host: $(hostname)
- Report: ${run_dir:-unavailable}
- Reason: ${reason:0:3000}"
logger -t global-documentation-sync "$message"
if [[ -n "${ALERT_WEBHOOK_URL:-}" ]]; then
  payload=$(python3 -c 'import json,sys; print(json.dumps({"text": sys.stdin.read()}))' <<<"$message")
  curl --fail --silent --show-error --max-time 15 \
    -H 'Content-Type: application/json' -d "$payload" "$ALERT_WEBHOOK_URL" >/dev/null
fi
