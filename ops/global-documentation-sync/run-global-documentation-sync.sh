#!/usr/bin/env bash
set -euo pipefail

: "${GLOBAL_REPO:?GLOBAL_REPO is required}"
: "${TARGET_REPO:?TARGET_REPO is required}"
: "${REPORTS_ROOT:?REPORTS_ROOT is required}"
: "${WORKTREES_ROOT:?WORKTREES_ROOT is required}"
: "${PI_PROVIDER:?PI_PROVIDER is required}"
: "${PI_MODEL:?PI_MODEL is required}"

for repo in "$GLOBAL_REPO" "$TARGET_REPO"; do
  if [[ -n "$(git -C "$repo" status --porcelain --untracked-files=no)" ]]; then
    echo "{\"event\":\"failed\",\"message\":\"base checkout is dirty: $repo\"}" >&2
    exit 2
  fi
  git -C "$repo" fetch origin main --prune
  git -C "$repo" checkout main
  git -C "$repo" reset --hard origin/main
done

common=(
  --global-repo "$GLOBAL_REPO"
  --target-repo "$TARGET_REPO"
  --reports-root "$REPORTS_ROOT"
  --worktrees-root "$WORKTREES_ROOT"
  --pi-bin "${PI_BIN:-pi}"
  --provider "$PI_PROVIDER"
  --model "$PI_MODEL"
  --github-repo "${GITHUB_REPO:-querypie/corp-web-japan}"
)

if [[ "${GLOBAL_DOC_SYNC_DRY_RUN:-0}" == "1" ]]; then
  exec node "$TARGET_REPO/scripts/global-documentation-sync/production-run.mjs" --dry-run "${common[@]}"
fi

exec node "$TARGET_REPO/scripts/global-documentation-sync/production-run.mjs" "${common[@]}"
