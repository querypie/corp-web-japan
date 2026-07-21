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
host=$(hostname)
alert_bundle=$(python3 "$(dirname "$0")/build-failure-alert.py" \
  --mention "${ALERT_SLACK_MENTION:-}" \
  --unit "$unit" \
  --run-id "$run_id" \
  --stage "$stage" \
  --host "$host" \
  --report-path "${run_dir:-unavailable}" \
  --reason "$reason")
log_message=$(python3 -c 'import json,sys; print(json.load(sys.stdin)["logMessage"])' <<<"$alert_bundle")
logger -t global-documentation-sync "$log_message"
if [[ -n "${ALERT_WEBHOOK_URL:-}" ]]; then
  payload=$(python3 -c 'import json,sys; print(json.dumps(json.load(sys.stdin)["payload"], ensure_ascii=False))' <<<"$alert_bundle")
  curl --fail --silent --show-error --max-time 15 \
    -H 'Content-Type: application/json' -d "$payload" "$ALERT_WEBHOOK_URL" >/dev/null
fi
