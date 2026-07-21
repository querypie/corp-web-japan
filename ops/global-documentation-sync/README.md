# Global Documentation Sync 운영 가이드

## Tencent Cloud VM

첫 dry-run과 staging에는 아래 사양의 CVM 한 대를 사용합니다.

| 항목 | 설정값 |
| --- | --- |
| Region | Seoul (`ap-seoul`) |
| 과금 방식 | Spot Instance |
| Image | Ubuntu Server 24.04 LTS, x86_64, standard public image |
| CPU / Memory | 범용 instance 4 vCPU, 8GB RAM |
| System disk | 40GB. Console에서 최소 용량이 50GB라면 50GB 선택 |
| Swap | Bootstrap 과정에서 4GB swap file 생성 |
| Network | Public IPv4, 5~10Mbps 제한 또는 traffic-based billing |
| GPU | 사용하지 않음 |

로컬에서 측정한 두 repository의 용량은 약 4GB입니다. Dependency는 약
0.7GB, 순차 실행하는 worktree 한 개는 1GB 미만, production build 결과는
0.2~0.5GB를 사용합니다. Ubuntu, Chrome, cache, report, swap까지 포함하면
실사용량은 약 15~20GB입니다. System disk는 40~50GB면 update와 장애 조사에
필요한 여유 공간까지 확보할 수 있습니다. 80GB는 필요하지 않습니다.

Password 대신 SSH key를 사용합니다. Inbound TCP 22는 운영자의 고정 IP나
VPN 대역에서만 허용합니다. 외부에 공개할 web port는 없습니다. GitHub,
QueryPie, model provider, package repository에 접근할 수 있도록 outbound
HTTPS를 허용합니다.

Spot Instance는 짧은 예고 후 회수될 수 있습니다. 회수 여부를 확인할 때는
Tencent metadata endpoint를 조회합니다.

```bash
curl -fsS http://metadata.tencentyun.com/latest/meta-data/spot/termination-time
```

초기 staging에는 Spot CVM 한 대만 사용해도 됩니다. Source repository와 PR
상태는 복구할 수 있기 때문입니다. 무인 production 운영을 시작하기 전에는
non-Spot CVM으로 전환하거나 Spot 자동 교체와 report 영속 저장소를
구성해야 합니다. Push 이후 PR 생성 전에 instance가 회수되면 branch-only
상태를 감지할 수 있지만, `/var/lib/global-documentation-sync/reports`까지
사라지면 수동 복구가 필요합니다. Spot system disk를 영속 저장소로
취급하지 마세요.

Instance를 만든 뒤 로컬 SSH alias를 등록합니다.

```sshconfig
Host corp-web-sync
  HostName <public-ip>
  User ubuntu
  IdentityFile ~/.ssh/<tencent-key>
```

설정 과정에서 공유해도 되는 정보는 instance ID, public IP, SSH alias뿐입니다.
Private key, Tencent credential, GitHub token, model API key는 chat이나 이
repository에 넣지 마세요.

참고 문서: [Playwright 지원 환경](https://playwright.dev/docs/intro),
[Tencent Spot Instance](https://cloud.tencent.com/document/product/213/17816),
[Spot 회수 metadata](https://cloud.tencent.com/document/product/213/37970)

## Runtime

전용 Linux host와 전용 user를 사용합니다. 권장 사양은 4 vCPU, 8GB RAM,
4GB swap, 40~50GB system disk입니다. Model은 외부 provider를 사용하므로
host에서 local model을 실행하지 않습니다.

지원 source family는 `scripts/global-documentation-sync/source-family-map.mjs`
의 exact map을 따릅니다. News support가 추가되어도 production timer,
failure alert, seven-day report retention 계약은 바뀌지 않습니다.

설치하고 version을 고정할 항목:

- Repository CI와 같은 Node.js, npm, Git, Python 3
- `gh api --slurp`를 지원하는 최신 GitHub CLI. Ubuntu 기본 apt package가 이
  flag를 제공하지 않으면 [GitHub 공식 apt repository](https://cli.github.com/packages)를 사용
- Pi CLI와 사용할 model provider
- `ffmpeg`, `ffprobe`
- Google Chrome 또는 Playwright Chromium
- `curl`, `flock`, systemd

`corp-web-v2`와 `corp-web-japan`은 `/srv/repos` 아래에 clone합니다. npm
dependency는 Japan base checkout에만 설치합니다. 실행용 worktree는 이
dependency directory를 symlink로 공유합니다. `WORKTREES_ROOT`는 base
checkout과 같은 상위 directory 아래에 두고, `TURBOPACK_ROOT`도 그 공통
상위 directory로 설정합니다. 그래야 Turbopack이 symlink dependency를
정상적으로 인식합니다.

두 clone은 자동화 전용이어야 합니다. 사람이 작업하는 checkout과 함께 쓰지
마세요. 매 실행은 깨끗한 `main`에서 시작하며, discovery 전에
`origin/main`과 정확히 같은 상태로 reset합니다.

## Credential

Service는 `corp-web-sync` user로 실행합니다. Credential은 systemd
environment 또는 host secret manager로 주입합니다. Repository에 저장하지
마세요.

- Global repository: contents read 권한
- Japan repository: contents write, pull request write 권한
- Merge, Actions 관리, deploy, production 권한은 부여하지 않음
- Model provider key
- `ALERT_WEBHOOK_URL`: failure and timeout Slack Incoming Webhook
- `ALERT_SLACK_MENTION`: failure owner mention, for example `<@U...>`

Draft PR notifications use the repository Actions secret
`CONTENT_SYNC_SLACK_WEBHOOK_URL` and Actions variables
`CONTENT_SYNC_SLACK_MENTION` and `CONTENT_SYNC_SLACK_CHANNEL_ID`. Keep webhook URLs
out of chat, source files, PR bodies, and logs. Rotate a webhook immediately if exposed.

## Baseline과 ignore

Timer를 활성화하기 전에 baseline을 다시 생성하고 기존 파일과 비교합니다.

```bash
node scripts/global-documentation-sync/generate-baseline.mjs \
  --global-repo /srv/repos/corp-web-v2 \
  --target-repo /srv/repos/corp-web-japan \
  --output /tmp/baseline.json
diff -u .github/content-sync/baseline.json /tmp/baseline.json
```

`WORKTREES_ROOT`는 자동화 전용 directory를 사용합니다.

```text
/srv/repos/corp-web-japan-worktrees/global-documentation-sync
```

사람이 사용하는 worktree directory를 지정하면 안 됩니다. Cleanup 대상도 이
경로 안의 `sync-*`, `retry-*` directory로 제한됩니다.

`baseline.json`과 `ignore.json`은 `sourceId` 순으로 정렬하고 중복 없이
관리합니다. Ignore 판정의 primary key는 Global의 불변 ID인 `sourceId`입니다.
Canonical URL은 lookup key가 아니라 검토용 snapshot입니다. URL이 달라지면
자동으로 무시하지 않고 작업을 차단해 사람이 확인하도록 합니다. 임시로
제외할 때는 `expiresAt`을 사용합니다. 만료 후에는 다시 candidate가 됩니다.

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

사용 가능한 `reasonCode`:

- `not-for-japan`
- `duplicate`
- `superseded`
- `legal-hold`
- `launch-gated`
- `manual-publication`
- `source-quality`
- `other`

영구 제외라면 `expiresAt`을 생략합니다. 종료된 PR marker와 remote
`content-sync/*` branch도 영구 suppression record로 사용합니다.

### GitHub Actions ignore flow

1. Actions에서 `Ignore Global Documentation sync PR`을 실행하고 원본 sync Draft
   PR 번호를 입력합니다.
2. Workflow가 open Draft 상태, `content-sync/{sourceId}` branch, source marker,
   canonical URL을 검증합니다.
3. `content-sync-ignore/{sourceId}` branch에서 정렬된 `ignore.json` 변경 PR을
   만들고 squash auto-merge를 설정합니다. Protected `main`에 직접 push하지 않습니다.
4. Ignore PR이 repository approval과 CI를 통과해 merge되면 reconciler가 machine
   marker를 검증하고 원본 sync PR을 닫은 뒤 source branch를 삭제합니다.
5. CI가 approval보다 먼저 끝난 경우 `pull_request_review: approved`가 merge 후
   reconciliation을 재개합니다. 즉시 merge된 경우 `workflow_run`이 처리하며,
   장애 복구에는 close workflow의 manual dispatch를 사용합니다.

Close/delete reconciliation은 같은 `sourceId`에 대해 idempotent합니다. Duplicate
ignore dispatch는 새 결정을 만들지 않고 fail-closed로 종료합니다.

## 설치

```bash
sudo install -m 600 ops/global-documentation-sync/global-documentation-sync.env.example \
  /etc/global-documentation-sync.env
sudo install -m 644 ops/global-documentation-sync/global-documentation-sync.service \
  ops/global-documentation-sync/global-documentation-sync.timer \
  ops/global-documentation-sync/global-documentation-sync-failure@.service \
  /etc/systemd/system/
sudo install -m 644 ops/global-documentation-sync/global-documentation-sync-reports.conf \
  /etc/tmpfiles.d/global-documentation-sync.conf
sudo systemd-tmpfiles --create /etc/tmpfiles.d/global-documentation-sync.conf
sudo systemctl daemon-reload
```

Production timer contract:

Adding News support does not change the production timer, failure alerts, or seven-day report retention.

- Host timezone: `Asia/Seoul`
- Daily base time: 10:00 KST
- Randomized delay: at most 10 minutes
- Persistent catch-up: enabled
- Service hard timeout: 1 hour
- Overlap prevention: nonblocking `flock`

Unit 파일을 변경한 뒤 repository를 pull하는 것만으로는 `/etc/systemd/system`의
설치본이 바뀌지 않습니다. 반드시 다시 설치하고 reload/restart합니다.

```bash
sudo install -m 644 ops/global-documentation-sync/global-documentation-sync.service \
  ops/global-documentation-sync/global-documentation-sync.timer \
  ops/global-documentation-sync/global-documentation-sync-failure@.service \
  /etc/systemd/system/
sudo install -m 644 ops/global-documentation-sync/global-documentation-sync-reports.conf \
  /etc/tmpfiles.d/global-documentation-sync.conf
sudo systemd-tmpfiles --create /etc/tmpfiles.d/global-documentation-sync.conf
sudo systemctl daemon-reload
sudo systemctl restart global-documentation-sync.timer
systemctl list-timers global-documentation-sync.timer
```

처음에는 `GLOBAL_DOC_SYNC_DRY_RUN=1`로 설정한 뒤 수동으로 실행합니다.

```bash
sudo systemctl start global-documentation-sync.service
journalctl -u global-documentation-sync.service -n 200 --no-pager
```

확인할 항목:

- `run-summary.json`의 status가 `dry_run_passed`
- Remote branch 변경 없음
- Fidelity, Japanese editorial, contract review 통과
- Full CI와 build 통과
- Desktop/mobile browser QA 통과

모두 통과하면 `GLOBAL_DOC_SYNC_DRY_RUN=0`으로 변경하고 timer를 활성화합니다.

```bash
sudo systemctl enable --now global-documentation-sync.timer
systemctl list-timers global-documentation-sync.timer
```

## 장애 복구

### `no_candidate`

정상 종료입니다. 처리할 작업이 없습니다.

### `skipped_locked`

다른 실행이 lock을 보유하고 있습니다. 별도 조치는 필요하지 않습니다.

### 생성 실패

`run-status.json`은 discovery, Pi role/attempt/PID, generated validation, full CI,
build, browser QA, publish, completion/failure stage를 atomic update하고 같은 lifecycle
event를 journal에 남깁니다.

```bash
latest=$(find /var/lib/global-documentation-sync/reports -mindepth 1 -maxdepth 1 -type d | sort | tail -1)
sudo jq . "$latest/run-status.json"
journalctl -u global-documentation-sync.service -n 200 --no-pager
```

Automation-owned detached worktree는 7일 후 cleanup 대상입니다. Report directory는
`/etc/tmpfiles.d/global-documentation-sync.conf`의 `mM:7d` policy로 마지막 수정 후
7일이 지나면 `systemd-tmpfiles-clean.timer`가 정리합니다. `mM`은 file/directory
mtime만 사용하므로 장애 조사 중 report를 읽는 행위가 retention을 연장하지 않습니다.
Spot VM 회수 후에도 report가 필요하면 별도 durable object storage가 필요합니다.

```bash
systemctl is-active systemd-tmpfiles-clean.timer
systemctl list-timers systemd-tmpfiles-clean.timer
sudo systemd-tmpfiles --clean /etc/tmpfiles.d/global-documentation-sync.conf
```

```bash
git worktree list
```

Service failure 또는 1시간 timeout은 `OnFailure` reporter를 실행합니다. Slack
메시지에는 `ALERT_SLACK_MENTION`, run ID, stage, host, report path, redacted reason이
포함되어야 합니다.

### Push 완료, PR 생성 실패

상태는 `blocked_branch_only`입니다. 보관된 report와 remote commit이
일치하는지 확인한 뒤 generated contract, full CI, build, browser QA를 다시
실행하고 PR 생성을 재개합니다.

```bash
node scripts/global-documentation-sync/cli.mjs resume-branch-only \
  --target-repo /srv/repos/corp-web-japan \
  --source-id cnt_000211 \
  --reports-dir /var/lib/global-documentation-sync/reports/<run-id> \
  --worktrees-root /srv/repos/corp-web-japan-worktrees/global-documentation-sync
```

### 종료되거나 거절된 PR

Schedule 실행에서는 자동으로 다시 생성하지 않습니다.

수동 retry가 필요하면 종료된 미병합 PR에 `content-sync:retry` label을
추가한 뒤 전체 retry pipeline을 실행합니다. 같은 deterministic branch에서
다시 생성하고 review, test, build, browser QA를 모두 통과한 뒤 기존 PR을
다시 엽니다. PR body를 갱신하고 retry label을 제거하며 Draft 상태를
유지합니다.

```bash
node scripts/global-documentation-sync/retry-run.mjs \
  --source-id cnt_000211 \
  --global-repo /srv/repos/corp-web-v2 \
  --target-repo /srv/repos/corp-web-japan \
  --reports-root /var/lib/global-documentation-sync/reports \
  --worktrees-root /srv/repos/corp-web-japan-worktrees/global-documentation-sync \
  --pi-bin /usr/local/bin/pi --provider "$PI_PROVIDER" --model "$PI_MODEL"
```

Retry를 강제로 실행하려고 baseline이나 ignore record를 삭제하면 안 됩니다.
Service에 merge 또는 deploy 권한을 부여하지 마세요.
