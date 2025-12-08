# Static HTML Web App

정적 HTML 다국어 사이트입니다. 로컬에서는 웹 서버 환경에서 실행하고 Vercel로 배포합니다.

## 프로젝트 구조

```
web-app/
├─ index.html
├─ en/
├─ ko/
├─ ja/
└─ assets/
   ├─ css/
   └─ images/
```

## 로컬 개발

### VS Code Live Server 사용(추천)
1. Live Server 확장 설치
2. index.html 우클릭 → Open with Live Server
3. http://127.0.0.1:5500/ 로 접속

## Vercel 배포

1. GitHub 푸시
2. Vercel에서 Import Project
3. Framework Preset: Other
4. Build/Output 설정 비움 → Deploy

## 경로 규칙

공용 리소스는 절대경로 사용:
```
/assets/css/styles.css
/assets/images/sample.png
```

## 체크리스트

- 로컬 서버에서 테스트중인지 확인
- /assets/images 파일 접근되는지 확인
- /en, /ko, /ja 페이지 정상 노출 확인
