# Route-Local Refactoring 개발자 소개서

## 1. Route-Local Refactoring 소개

Route-local refactoring은 App Router 기준으로 각 route의 `page.tsx`를 그 페이지의 주요 authoring surface로 되돌리는 리팩터링 방식입니다.

이 문서에서 말하는 핵심은 단순히 "파일을 route 근처로 옮긴다"가 아닙니다.
더 중요한 점은 다음과 같습니다.

- 페이지의 실제 카피가 `src/app/**/page.tsx`에서 읽혀야 한다.
- 페이지의 주요 section 순서가 `page.tsx`에서 바로 보여야 한다.
- `src/components/sections/**`는 UI 구현 디테일을 담당해야 한다.
- 페이지별 거대한 content registry나 orchestrator wrapper가 route의 의미를 가리면 안 된다.

즉, route-local refactoring은 "페이지의 의미와 구성은 route에, 표현 구현은 section component에"라는 원칙으로 정리하는 작업입니다.

이 방식은 특히 다음과 같은 문제를 해결하기 위해 유용합니다.

- `page.tsx`가 사실상 빈 shell처럼 보이는 경우
- 실제 마케팅 카피가 `src/content/**`의 큰 object/array 안에 숨어 있는 경우
- 페이지 구조를 이해하려면 여러 파일을 계속 왕복해야 하는 경우
- AI Agent가 어느 파일을 진짜 source of truth로 봐야 할지 헷갈리는 경우

## 2. 구체적인 디자인 원칙과 구현 방법

### 2.1 핵심 원칙

1. `page.tsx`는 copy와 composition을 소유한다.
2. `src/components/sections/**`는 layout, styling, interaction을 소유한다.
3. 페이지를 읽을 때 먼저 route file 하나만 열어도 narrative가 보여야 한다.
4. 반복 UI는 추출하되, 실제 문장과 섹션 의미까지 추출하지는 않는다.
5. 모든 정적/정보성 페이지를 하나의 공용 primitive 체계로 억지로 합치지 않는다.

### 2.2 `page.tsx`에 있어야 하는 것

- metadata
- 실제 heading, paragraph, CTA label
- section의 실제 순서
- section component를 조합하는 JSX
- route-local CTA URL, 작은 상수
- reviewer가 읽어야 하는 페이지의 핵심 의미

### 2.3 `src/components/sections/**`에 있어야 하는 것

- section wrapper, card, grid, media, primitive component
- className과 spacing 같은 styling detail
- interaction, animation, client behavior
- 재사용 가능한 presentation primitive
- route가 읽기 쉽도록 분리한 UI 구현

### 2.4 피해야 할 패턴

#### 안 좋은 패턴 A: content registry 우선 구조

```tsx
import { pageContent } from "@/content/page";
import { PageSections } from "@/components/sections/page-sections";

export default function ExamplePage() {
  return <PageSections content={pageContent} />;
}
```

문제점:

- route가 페이지처럼 읽히지 않는다.
- 실제 카피와 section 순서가 숨겨진다.
- reviewer와 AI Agent가 여러 파일을 동시에 추적해야 한다.

#### 안 좋은 패턴 B: route-local인 척하지만 큰 data blob이 남아 있는 구조

```tsx
const timeline = [
  { year: "2017", items: ["설립"] },
  { year: "2018", items: ["투자 유치"] },
];

const leaders = [
  { name: "...", role: "..." },
];
```

문제점:

- 카피가 route 안에 있더라도 JSX authoring surface 바깥에 숨어 있다.
- 페이지가 여전히 "data blob first, page second"로 읽힌다.

### 2.5 권장 구현 순서

1. 대상 route를 정한다.
2. 현재 카피 source가 `src/content/**`, top-level array/object, giant wrapper 중 어디인지 확인한다.
3. section 단위로 scope를 자른다.
4. 실제 문장과 CTA를 `page.tsx`의 JSX 쪽으로 옮긴다.
5. `src/components/sections/**`에는 layout/primitive만 남긴다.
6. render order가 바뀌지 않았는지 확인한다.
7. old registry/orchestrator 의존성을 제거한다.
8. 구조 테스트나 문서 가이드를 같이 업데이트한다.

### 2.6 중요한 구현 규칙

#### 섹션 단위로 리팩터링한다

한 번에 전체 페이지를 뒤엎기보다, 한 section을 완성 상태로 끝내는 것이 좋습니다.
이 저장소에서는 "부분적으로 많이 건드린 PR"보다 "한 section이 완전히 정리된 PR"이 더 좋습니다.

#### 순서를 보존한다

route-local refactoring의 목적은 authoring ownership 이동이지, 페이지 흐름 변경이 아닙니다.
shared shell에서 중간 section만 빼다가 순서를 바꾸면 잘못된 리팩터링입니다.

#### family boundary를 유지한다

정적 페이지라고 해서 모두 같은 방식으로 취급하지는 않습니다.
예를 들어:

- top page / solution page: 마케팅 카피 중심
- about-us / certifications: company-intro family
- privacy-policy / eula / terms: legal document family
- plans / feature browser: interaction contract가 있는 informational page

즉, route-local refactoring은 모든 페이지를 똑같이 만드는 작업이 아니라, 페이지 family에 맞는 가장 읽기 좋은 authoring 구조를 만드는 작업입니다.

## 3. Before - After 비교 사례 요약

이 문서에서는 개념만 요약하고, 실제 코드가 길게 포함된 사례는 별도 문서로 분리했습니다.

상세 사례 문서:

- [docs/route-local-refactoring-examples.ko.md](./route-local-refactoring-examples.ko.md)
- [docs/route-local-refactoring-examples.md](./route-local-refactoring-examples.md)

상세 사례 문서의 특징:

- 실제 before / after 코드를 30~50라인 이상 단위로 발췌
- `page.tsx`뿐 아니라 `page.tsx`가 참조하는 module 구조까지 함께 정리
- `src/components/**`에서 UI와 마케팅 copy가 뒤섞이는 사례 포함
- Big JSON Props / compound alias / top-level data blob 사례 포함
- 모든 코드 파일 링크를 commit SHA 기반 GitHub 링크로 고정

여기서는 세 가지 대표 사례만 짧게 요약합니다.

### 사례 1. Top page

- before: route shell인 [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/app/page.tsx), content registry인 [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts), giant wrapper인 [`src/components/sections/top-page-sections.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/components/sections/top-page-sections.tsx)로 의미가 분산됨
- after: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)에서 실제 hero/CTA/section order가 직접 보이고, [`src/components/sections/home/hero-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/hero-section.tsx) 등은 UI primitive 역할로 정리됨

### 사례 2. About Us

- before: [`src/app/t/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/c03333672e4e4ed5d21cb7d004ea9be2df1f3c9d/src/app/t/about-us/page.tsx) 상단에 `timeline`, `leaders`, `locations` 같은 큰 data blob이 먼저 나와 route readability를 해침
- after: [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)에서 실제 JSX authoring으로 timeline/leader/location copy를 직접 보여주고, [`src/components/sections/about-us/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/about-us/section.tsx)는 layout primitive에 집중함

### 사례 3. Plans

- before: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)에서 `Object.assign(...)` alias와 giant `rows` / `columns` prop blob이 함께 사용되어 작은 copy 변경도 여러 배열 계약을 동시에 맞춰야 했음
- after: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/plans/page.tsx)에서 `CompareTableSection`, `CompareTableRow`, `CompareTableTextCell` 같은 JSX primitive를 직접 조합하여 label과 cell value를 같은 authoring surface에서 읽을 수 있게 됨

## 4. 이 구현의 장단점

### 장점

- reviewer가 한 파일에서 페이지 의미를 빠르게 파악할 수 있다.
- 카피 수정과 UX 구조 수정의 경계가 선명해진다.
- AI Agent가 잘못된 source of truth를 고를 가능성이 줄어든다.
- giant wrapper와 giant content registry가 줄어들어 변경 영향 범위를 읽기 쉬워진다.
- section 단위 PR로 잘게 나누기 쉽다.
- 카피 ownership과 UI implementation ownership이 분리된다.

### 단점

- `page.tsx`가 길어질 수 있다.
- 처음에는 import 수가 많아져 보일 수 있다.
- 지나치게 엄격하게 적용하면 반복 마크업이 늘 수 있다.
- 데이터 기반 페이지까지 무리하게 적용하면 오히려 구조가 나빠질 수 있다.
- 팀이 원칙을 공유하지 않으면 "어디까지 route에 둘 것인가" 논의가 반복될 수 있다.

### 주의할 점

- route-local refactoring은 모든 텍스트를 무조건 inline으로 만들라는 뜻이 아니다.
- 반복 UI primitive, legal MDX body, backend-heavy logic은 적절한 위치에 남겨야 한다.
- 중요한 것은 "route가 primary authoring surface인가"이지, "모든 코드가 한 파일 안에 있는가"가 아니다.

## 5. 효과, 무엇이 좋아지는지

### 개발자 경험

- 페이지를 처음 읽는 비용이 줄어든다.
- 코드 리뷰 속도가 빨라진다.
- 변경 diff가 더 의미 단위로 읽힌다.
- 카피 변경과 UI 변경의 책임 경계가 분명해진다.

### 유지보수

- 페이지별 source of truth가 분명해진다.
- dead content registry나 obsolete wrapper를 제거하기 쉬워진다.
- section-scoped follow-up PR을 만들기 쉬워진다.

### AI Agent 협업

- 에이전트가 route file을 중심으로 작업 범위를 판단하기 쉬워진다.
- "copy는 route, implementation은 sections"라는 규칙 덕분에 파일 오인식이 줄어든다.
- 긴 chain of file lookup 없이도 적은 컨텍스트로 안전하게 편집할 수 있다.

### 제품/UX 관점

- 페이지 narrative와 CTA intent를 더 일관되게 다루기 쉬워진다.
- section 순서와 강조 메시지의 ownership이 명확해져 parity 작업이 쉬워진다.

## 6. AI Agent에게 어떻게 route-local refactoring을 지시할 수 있는가

좋은 지시는 "범위", "완료 기준", "건드리면 안 되는 곳"을 함께 줍니다.

### 가장 간단한 지시 예시

```md
`src/app/about-us/page.tsx`를 route-local authoring 기준으로 리팩터링해줘.
실제 카피와 section composition은 page.tsx에 두고,
`src/components/sections/**`에는 UI implementation detail만 남겨줘.
큰 top-level data array가 있으면 없애고,
render order는 바꾸지 마.
```

### section-scoped 지시 예시

```md
AI Crew 페이지에서 use-cases section만 route-local refactoring 해줘.
다른 section은 건드리지 말고,
이번 PR의 완료 기준은 그 section의 카피가 `page.tsx`에 직접 보이는 것이다.
```

### interactive section 지시 예시

```md
ACP feature browser는 data blob prop 패턴 대신 children-based route-local JSX authoring으로 바꿔줘.
위젯의 인터랙션은 section component에 남기고,
실제 feature title/body copy는 route에서 authoring하게 해줘.
```

### 좋은 프롬프트에 포함하면 좋은 정보

- 대상 파일 경로
- section 단위인지 whole-page인지
- 유지해야 하는 render order
- 건드리면 안 되는 scope
- current reference page
- 완료 기준
- 테스트/문서 업데이트 여부

### 피해야 할 모호한 지시

- "좀 더 깔끔하게 정리해줘"
- "route-local하게 바꿔줘"만 단독으로 주기
- section scope 없이 "다 고쳐줘"라고 하기

이런 지시는 scope drift를 일으키기 쉽습니다.
가능하면 "어느 section을 어떤 기준으로 끝낼지"를 먼저 적는 것이 좋습니다.

## 7. 스킬과 markdown 문서 알려주기

이 저장소에서 route-local refactoring과 직접 관련된 핵심 자료는 아래와 같습니다.

### Repo-local skill

- [`.agents/skills/static-page-route-local-authoring/SKILL.md`](../.agents/skills/static-page-route-local-authoring/SKILL.md)
  - static marketing route에서 `page.tsx`를 primary authoring surface로 유지하는 방법
  - section-scoped refactor, render-order preservation, follow-up cleanup 규칙 포함

### Repository docs

- [`docs/static-page-route-local-authoring.md`](./static-page-route-local-authoring.md)
  - 현재 저장소의 route-local authoring 상세 가이드
- [`docs/code-location-conventions.md`](./code-location-conventions.md)
  - 짧은 버전의 code location convention
- [`docs/route-local-refactoring-for-developers.ko.md`](./route-local-refactoring-for-developers.ko.md)
  - 이 문서의 한국어판
- [`docs/route-local-refactoring-for-developers.md`](./route-local-refactoring-for-developers.md)
  - 이 문서의 영어판
- [`docs/route-local-refactoring-examples.ko.md`](./route-local-refactoring-examples.ko.md)
  - 실제 before / after 코드 사례를 길게 담은 한국어 상세 사례집
- [`docs/route-local-refactoring-examples.md`](./route-local-refactoring-examples.md)
  - 실제 before / after 코드 사례를 길게 담은 영어 상세 사례집

### 읽는 순서 추천

1. [`docs/code-location-conventions.md`](./code-location-conventions.md)
2. [`docs/static-page-route-local-authoring.md`](./static-page-route-local-authoring.md)
3. [`.agents/skills/static-page-route-local-authoring/SKILL.md`](../.agents/skills/static-page-route-local-authoring/SKILL.md)
4. 실제 reference route file인 [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx), [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx), [`src/app/t/platforms/acp/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/platforms/acp/page.tsx)

## 8. 잘 알려진 레퍼런스

아래 자료들은 route-local refactoring의 배경 개념을 이해하는 데 도움이 됩니다.

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
  - route 단위 파일 구조와 server/client boundary 이해에 유용
- [htmx: Locality of Behaviour](https://htmx.org/essays/locality-of-behaviour/)
  - behavior를 markup 가까이에 두는 사고방식 참고
- [Refactoring.Guru - Refactoring](https://refactoring.guru/refactoring)
  - 리팩터링 기본 원칙과 코드 구조 개선 관점 참고

추가로 이 저장소 내부에서는 다음이 사실상 더 직접적인 reference입니다.

- [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)
- [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)
- [`src/app/t/platforms/acp/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/platforms/acp/page.tsx)
- PR 155, 156, 157, 158에서 확립된 section-scoped route-local authoring 방향

---

정리하면, route-local refactoring의 목표는 "모든 것을 route에 몰아넣기"가 아니라, "페이지의 의미를 route에서 읽히게 만들기"입니다.
이 기준이 서면 개발자 리뷰도 쉬워지고, AI Agent도 훨씬 덜 헤매게 됩니다.
