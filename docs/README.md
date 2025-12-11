# Static HTML Web App

정적 HTML 다국어 사이트입니다. 로컬에서는 웹 서버 환경에서 실행하고 Vercel로 배포합니다.

## 프로젝트 구조

```
corp-web-japan/
├─ docs/
│  └─ README.md                # 프로젝트 문서
└─ public/                      # 정적 사이트 루트(배포 대상)
   ├─ index.html               # 기본 언어(루트) 페이지
   ├─ en/
   │  └─ index.html            # 영어 페이지
   ├─ ko/
   │  └─ index.html            # 한국어 페이지
   ├─ ja/
   │  └─ index.html            # 일본어 페이지
   └─ assets/                  # 공용 리소스
      ├─ css/
      │  └─ styles.css
      └─ images/
         └─ sample.png
```

- 언어별 페이지는 /en, /ko, /ja 디렉터리의 index.html로 구성됩니다.
- 공용 CSS·이미지는 /assets 하위에서 절대 경로로 참조합니다(예: /assets/css/styles.css).

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

## AI 작업 지시 가이드

AI에게 작업을 시킬 때는 아래 방법을 권장합니다.

### 규칙
- 수정하고 싶은 파일명을 명확하게 말하기
- HTML 실제 문구를 그대로 입력하기
- 페이지(ko, en, ja) 명시하기
- 이미지 추가 시 파일 경로 제공하기

### 예시 명령어
- "ko/index.html 의 `<h1>` 내용을 '안녕하세요!' 로 변경해줘"
- "모든 언어 페이지에 footer 를 `<footer>© 2025 QueryPie</footer>` 로 업데이트해줘"
- "assets/images 폴더에 hero.png 추가했으니 `/assets/images/hero.png` 로 이미지를 넣어줘"
- "en/index.html 의 nav 에 'Contact' 메뉴 추가해줘"
