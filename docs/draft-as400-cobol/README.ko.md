# 일본 웹사이트 AS400 / COBOL Migration 콘텐츠 Draft

## 목적

일본 웹사이트의 솔루션 또는 서비스 영역에 `AS400 / COBOL Migration` 정적 웹페이지를 추가하기 위한 초안 작업 공간입니다.

이 디렉터리의 문서는 다음 용도로 사용합니다.

- 일본 웹사이트에 추가할 AS400/COBOL Modernization 메시지 정리
- AI 기반 COBOL/RPG 분석, 설계서 생성, Java/API/Cloud 전환 흐름 정리
- 일본어 정적 웹페이지 본문 초안 작성
- 리뷰 단계에서 정확히 의미를 확인할 수 있는 한국어 번역 문서 제공
- 게시 전 확인해야 할 SEO, 링크, CTA, 검수 항목 관리
- 추후 `corp-web-japan` 저장소에 정적 웹페이지로 반영할 때 참고 자료로 사용

## 파일 구성

| 파일 | 용도 |
|------|------|
| `README.ko.md` | 이 작업 공간의 한국어 안내 문서 |
| `README.ja.md` | 이 작업 공간의 일본어 안내 문서 |
| `content-brief.ko.md` | 콘텐츠 목표, 타깃 독자, 핵심 메시지, SEO 방향 한국어 기획안 |
| `content-brief.ja.md` | 콘텐츠 목표, 타깃 독자, 핵심 메시지, SEO 방향 일본어 기획안 |
| `article-draft.ko.md` | 리뷰를 위한 일본어 본문 초안의 한국어 번역 |
| `article-draft.ja.md` | 일본 웹사이트에 게시할 일본어 정적 웹페이지 본문 초안 |
| `publishing-checklist.ko.md` | 실제 반영 전 확인해야 할 작업 체크리스트 한국어판 |
| `publishing-checklist.ja.md` | 실제 반영 전 확인해야 할 작업 체크리스트 일본어판 |

## 참고자료 제외 범위

`skills-jk-private`의 원본 초안에는 `draft/jp-as400-cobol/references/` 아래 참고자료가 포함되어 있지만, 이 디렉터리에는 가져오지 않습니다.

## 현재 가정

- 1차 게시 형식은 일본 웹사이트의 정적 웹페이지입니다.
- White paper와 blog는 1차 정적 페이지 공개 이후 후순위 확장 콘텐츠로 검토합니다.
- 주제는 `AS400 / COBOL Migration`, `IBM i Modernization`, `AI 기반 레거시 핵심 시스템 현대화`입니다.
- AS/400은 일본 현장에서 여전히 통용되는 표현이므로 본문에서는 `AS/400（IBM i）`처럼 병기합니다.
- 공개 문구에서는 검증되지 않은 숫자와 특정 고객/벤더명은 사용하지 않습니다.

## 다음 작업

1. 일본 웹사이트에서 정적 웹페이지가 들어갈 솔루션/서비스 위치 결정
2. `AS400 / COBOL Migration`을 QueryPie 제공 서비스로 명시하는 전제에서 상세 서비스 범위 확인
3. AI 분석, 설계서 생성, 테스트 케이스 생성, Java/API/Cloud 전환 중 공개 가능한 메시지 확정
4. 기존 일본어 톤앤매너와 CTA 문구 확인
5. 본문 초안을 일본어 원어민 또는 현지 마케팅 관점에서 검수
6. `corp-web-japan` 저장소에 실제 콘텐츠 반영
