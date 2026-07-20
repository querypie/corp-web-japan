#!/usr/bin/env bash
set -euo pipefail
exec 9>/run/lock/global-documentation-sync.lock
if ! flock -n 9; then
  echo '{"status":"skipped_locked"}'
  exit 0
fi
exec /srv/repos/corp-web-japan/ops/global-documentation-sync/run-global-documentation-sync.sh
