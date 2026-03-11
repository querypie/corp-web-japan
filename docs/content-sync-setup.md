# Content Sync Setup Guide

## 개요

corp-web-contents에 콘텐츠를 push하면 자동으로 corp-web-japan의 카드가 업데이트되는 파이프라인입니다.

```
corp-web-contents push
    ↓ (upload.yml 완료 후)
corp-web-japan sync-content.yml 트리거
    ↓
generate_content_data.py 실행
    ↓
whitepaper-data.js / blog-data.js 자동 생성
    ↓
Vercel 자동 재배포
    ↓
사이트에 새 카드 표시
```

---

## 설정 방법

### Step 1: GitHub Secret 추가 (corp-web-japan)

`querypie/corp-web-japan` → Settings → Secrets and variables → Actions → New repository secret

| Name | Value |
|------|-------|
| `CONTENTS_REPO_TOKEN` | corp-web-contents 읽기 권한이 있는 Personal Access Token (PAT) |

**PAT 생성 방법**: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
- Repository access: `querypie/corp-web-contents` (읽기 전용)
- Permissions: Contents → Read

---

### Step 2: corp-web-contents upload.yml에 트리거 추가

`querypie/corp-web-contents/.github/workflows/upload.yml` 마지막에 아래 step 추가:

```yaml
      - name: Trigger corp-web-japan sync
        if: github.ref_name == 'main' || github.ref_name == 'release'
        run: |
          curl -s -X POST \
            -H "Authorization: token ${{ secrets.CORP_WEB_JAPAN_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/querypie/corp-web-japan/dispatches \
            -d "{\"event_type\": \"content-updated\", \"client_payload\": {\"branch\": \"${{ github.ref_name }}\"}}"
          echo "✅ Triggered corp-web-japan sync"
```

`querypie/corp-web-contents` → Settings → Secrets → 추가:

| Name | Value |
|------|-------|
| `CORP_WEB_JAPAN_TOKEN` | corp-web-japan 쓰기 권한이 있는 PAT |

---

### Step 3: 수동 실행 테스트

GitHub → corp-web-japan → Actions → "Sync Content from corp-web-contents" → Run workflow

---

## 파일 구조

```
corp-web-japan/
├── scripts/
│   └── generate_content_data.py   ← MDX → JS 변환 스크립트
├── .github/workflows/
│   └── sync-content.yml           ← 자동 실행 워크플로우
└── public/
    ├── whitepaper-data.js          ← 자동 생성됨 (수동 편집 불필요)
    └── blog-data.js                ← 자동 생성됨 (수동 편집 불필요)
```

## 이미지 경로

- 썸네일: `public/white-paper/wp-thumb-N.png` → `/assets/images/07-blog/wp-thumb-N.png`
- 블로그 썸네일: `public/blog/b-thumb-N.png` → `/assets/images/07-blog/b-thumb-N.png`
- 저자 아바타: Vercel Blob CDN URL 직접 사용 (다운로드 불필요)

썸네일 이미지가 `/assets/images/07-blog/`에 없으면 onerror fallback 이미지가 표시됩니다.
새 썸네일이 추가된 경우 별도로 이미지 파일을 추가해야 합니다.
