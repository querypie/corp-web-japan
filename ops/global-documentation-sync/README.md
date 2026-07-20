# Global Documentation Sync operations

## Tencent Cloud VM

Create one CVM with the following settings for the initial dry-run and staging
period:

| Setting | Value |
| --- | --- |
| Region | Tokyo (`ap-tokyo`) |
| Billing | Spot Instance |
| Image | Ubuntu Server 24.04 LTS, x86_64, standard public image |
| Compute | 4 vCPU, 8 GB RAM; general-purpose instance family |
| System disk | 40 GB; select 50 GB when that is the console minimum |
| Swap | 4 GB swap file created during bootstrap |
| Network | Public IPv4, 5-10 Mbps cap or traffic-based billing |
| GPU | None |

The measured local footprint is approximately 4 GB for both repositories, 0.7
GB for dependencies, less than 1 GB for one sequential worktree, and 0.2-0.5 GB
for a production build. Ubuntu, Chrome, caches, reports, and swap bring practical
peak usage to roughly 15-20 GB. A 40-50 GB system disk leaves sufficient update
and failure-debugging headroom; 80 GB is unnecessary.

Use an SSH key, not password authentication. Restrict inbound TCP 22 to the
operator's fixed/VPN address. No public web port is required. Permit outbound
HTTPS for GitHub, QueryPie, the model provider, and package repositories.

Spot instances can be reclaimed with short notice. Check the Tencent metadata
endpoint when diagnosing shutdowns:

```bash
curl -fsS http://metadata.tencentyun.com/latest/meta-data/spot/termination-time
```

A single Spot CVM is acceptable for staging because source repositories and PR
state are recoverable. Before enabling unattended production, either use a
non-Spot CVM or add automatic Spot replacement and durable report storage. A
reclaim after push but before PR creation leaves a detectable branch-only state,
but losing `/var/lib/global-documentation-sync/reports` makes recovery manual.
Do not treat the Spot system disk as durable storage.

After creation, configure a local SSH alias such as:

```sshconfig
Host corp-web-sync
  HostName <public-ip>
  User ubuntu
  IdentityFile ~/.ssh/<tencent-key>
```

Only the instance ID, public IP, and SSH alias may be shared during setup. Never
copy a private key, Tencent credential, GitHub token, or model API key into chat
or this repository.

Official references: [Playwright supported systems](https://playwright.dev/docs/intro),
[Tencent Spot instances](https://cloud.tencent.com/document/product/213/17816),
and [Spot reclaim metadata](https://cloud.tencent.com/document/product/213/37970).

## Runtime

Use a dedicated Linux host and user. Recommended runtime capacity is 4 vCPU, 8
GB RAM, 4 GB swap, and a 40-50 GB system disk. The model runs through an external
provider; do not run a local model on this host.

Install and pin:

- Node.js matching the repository CI version, npm, Git, GitHub CLI, Python 3
- Pi CLI and the configured model provider
- `ffmpeg`/`ffprobe`
- Google Chrome or Playwright Chromium
- `curl`, `flock`, and systemd

Clone `corp-web-v2` and `corp-web-japan` into `/srv/repos`. Install npm
dependencies only in the base Japan checkout. Run worktrees reuse that dependency
tree through a symlink. Keep `WORKTREES_ROOT` under the same parent as the base
checkout and set `TURBOPACK_ROOT` to that common parent so Turbopack accepts the
symlinked dependency tree. Both clones must be dedicated automation-only
checkouts, never human working copies: every run requires clean `main`, then
fetches and resets exactly to `origin/main` before discovery.

## Credentials

Run as `corp-web-sync`. Inject credentials through the systemd environment or a
host secret manager, never this repository.

- Global repository: contents read only
- Japan repository: contents write and pull-request write
- No merge, Actions administration, deployment, or production credentials
- Model provider key
- Optional `ALERT_WEBHOOK_URL`

## Baseline gate

Before enabling the timer, regenerate and review the baseline:

```bash
node scripts/global-documentation-sync/generate-baseline.mjs \
  --global-repo /srv/repos/corp-web-v2 \
  --target-repo /srv/repos/corp-web-japan \
  --output /tmp/baseline.json
diff -u .github/content-sync/baseline.json /tmp/baseline.json
```

Use a dedicated `WORKTREES_ROOT` such as
`/srv/repos/corp-web-japan-worktrees/global-documentation-sync`; never point it
at a shared human worktree directory. Cleanup only considers automation-owned
`sync-*` and `retry-*` directories inside that root.

`baseline.json` and `ignore.json` must remain source-ID sorted and duplicate
free. Ignore identity is always the immutable Global `sourceId`; the canonical
URL is a required audit snapshot, never the lookup key. URL drift blocks the run
for review. Optional `expiresAt` makes a temporary decision eligible again after
expiry.

```json
[
  {
    "sourceId": "cnt_000211",
    "sourceCanonicalUrl": "https://www.querypie.com/en/blog/example",
    "reasonCode": "not-for-japan",
    "reason": "Japan publication intentionally excluded",
    "addedBy": "owner",
    "addedAt": "2026-07-20T00:00:00Z",
    "expiresAt": "2026-10-01T00:00:00Z"
  }
]
```

Allowed `reasonCode` values: `not-for-japan`, `duplicate`, `superseded`,
`legal-hold`, `launch-gated`, `manual-publication`, `source-quality`, and
`other`. Omit `expiresAt` for permanent decisions. Closed PR markers and remote
`content-sync/*` branches are also permanent suppression records.

## Installation

```bash
sudo install -m 600 ops/global-documentation-sync/global-documentation-sync.env.example \
  /etc/global-documentation-sync.env
sudo install -m 644 ops/global-documentation-sync/global-documentation-sync.service \
  ops/global-documentation-sync/global-documentation-sync.timer \
  ops/global-documentation-sync/global-documentation-sync-failure@.service \
  /etc/systemd/system/
sudo systemctl daemon-reload
```

First set `GLOBAL_DOC_SYNC_DRY_RUN=1` and run:

```bash
sudo systemctl start global-documentation-sync.service
journalctl -u global-documentation-sync.service -n 200 --no-pager
```

Confirm `run-summary.json` says `dry_run_passed`, no remote branch changed, all
three reviews passed the blocking threshold, validation/build passed, and both
browser viewports passed. Then set `GLOBAL_DOC_SYNC_DRY_RUN=0` and enable:

```bash
sudo systemctl enable --now global-documentation-sync.timer
systemctl list-timers global-documentation-sync.timer
```

## Recovery

- `no_candidate`: normal success; no action.
- `skipped_locked`: another run owns the lock; no action.
- Failed generation: reports and detached worktree remain for seven days; inspect
  before cleanup with `git worktree list`.
- Pushed branch without PR: status is `blocked_branch_only`. Revalidate its
  retained reports, remote commit, generated contract, full CI/build, and browser
  evidence before retrying PR creation:

  ```bash
  node scripts/global-documentation-sync/cli.mjs resume-branch-only \
    --target-repo /srv/repos/corp-web-japan \
    --source-id cnt_000211 \
    --reports-dir /var/lib/global-documentation-sync/reports/<run-id> \
    --worktrees-root /srv/repos/corp-web-japan-worktrees/global-documentation-sync
  ```

- Closed/rejected PR: never regenerated automatically.
- Manual retry: add `content-sync:retry` to the latest closed unmerged PR, then
  run the complete retry pipeline. It regenerates on the same deterministic
  branch, reruns reviews/tests/build/browser checks, pushes the corrected commit,
  updates the same PR body, removes the retry label, reopens that PR, and
  ensures it remains Draft:

  ```bash
  node scripts/global-documentation-sync/retry-run.mjs \
    --source-id cnt_000211 \
    --global-repo /srv/repos/corp-web-v2 \
    --target-repo /srv/repos/corp-web-japan \
    --reports-root /var/lib/global-documentation-sync/reports \
    --worktrees-root /srv/repos/corp-web-japan-worktrees/global-documentation-sync \
    --pi-bin /usr/local/bin/pi --provider "$PI_PROVIDER" --model "$PI_MODEL"
  ```

Never delete baseline/ignore records to force a retry. Never grant merge or
deployment permission to this service.
