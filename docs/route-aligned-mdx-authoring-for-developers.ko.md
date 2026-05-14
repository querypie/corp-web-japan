# Route-Aligned MDX Authoring 개발자 소개서

## 1. 왜 이 문서가 필요한가

PR 470은 정적 마케팅 페이지를 위한 기본 route-local refactoring 방향을 문서화했습니다.
핵심은 다음이었습니다.

- `page.tsx`를 주요 authoring surface로 유지한다
- section composition이 route에서 바로 읽혀야 한다
- 추출된 section 파일은 UI 구현 디테일에 집중한다

이 문서는 그와 연결된 다른 패턴을 다룹니다.
즉, `page.tsx`에 실제 카피를 inline JSX로 두는 대신, 긴 본문 컨텐츠를 `.mdx` 파일로 분리하는 route-local refactoring의 변형/확장판입니다.

이 저장소에서 대표적인 예시는 다음과 같습니다.

- blog 포스트
- whitepaper
- news 포스트
- events
- use-cases 및 demo detail 페이지
- EULA, Terms of Service, versioned privacy policy 같은 legal document

이 family들에서는 “모든 카피를 `page.tsx`로 되돌린다”가 최선이 아닙니다.
오히려 다음 상태가 더 좋습니다.

- route file은 thin wrapper로 유지한다
- 실제 본문 컨텐츠는 route-aligned MDX 파일로 분리한다
- route 또는 slug와 자연스럽게 대응되는 디렉토리/파일명 규칙을 유지한다
- shared code가 MDX content 바깥의 일관된 UI shell을 렌더링한다

즉, 이 패턴은 PR 470의 반대가 아닙니다.
같은 authoring ownership 원칙을 publication/document family에 맞게 확장한 것입니다.

## 2. 핵심 아이디어

이 family들에서는 책임을 다음처럼 나누는 것이 좋습니다.

- `src/app/**/page.tsx`
  - route entry
  - param 처리
  - canonical redirect 로직
  - metadata 연결
  - thin page composition
- `src/content/**` 또는 route-adjacent `content.mdx`
  - 실제 long-form content body
  - 문서/포스트를 설명하는 frontmatter
- `src/lib/**`
  - loader, route resolution, frontmatter parsing, MDX rendering, family별 규칙
- `src/components/sections/**`
  - shared post/document page shell과 재사용 UI primitive

요약하면:

- 정적 마케팅 페이지 패턴 -> `page.tsx`가 대부분의 카피를 소유
- publication / document 패턴 -> `.mdx`가 긴 본문 카피를 소유하고, `page.tsx`는 thin wrapper로 유지

## 3. 언제 이 패턴이 맞는가

다음 조건이 대부분 맞으면 route-aligned MDX authoring이 적합합니다.

- route가 publication, article, document, long-form resource family다
- 본문이 bespoke 마케팅 composition보다 prose 중심이다
- 같은 family 안의 많은 페이지가 하나의 rendering contract를 공유해야 한다
- route가 자연스럽게 `id`, `slug`, version identifier와 대응된다
- 향후 content 수정이 page implementation code 변경 없이 가능해야 한다
- multilingual 확장 가능성이 높거나 이미 예상된다

이 저장소에서 좋은 사례:

- `/blog/:id/:slug`
- `/whitepapers/:id/:slug`
- `/news/:id/:slug`
- `/events/:id/:slug`
- `/demo/aip/:id/:slug`
- `/demo/acp/:id/:slug`
- `/t/eula`
- `/t/terms-of-service`
- `/t/privacy-policy/[slug]`

기본 선택지가 아닌 경우:

- top page
- solution landing page
- reviewer가 JSX에서 카피와 section composition을 직접 읽어야 하는 정적 마케팅 페이지

## 4. 주요 장점

### 4.1 Route와 content file의 매핑이 명확해진다

예측 가능한 MDX 파일 레이아웃을 사용하면 다음 질문에 바로 답할 수 있습니다.

- 이 route의 source content file은 무엇인가?
- 이 slug를 소유한 파일은 무엇인가?
- 새 locale 버전은 어디에 추가해야 하는가?

현재 저장소 기준 예시:

- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (MDX files named `<id>-<slug>.mdx`)
- [src/app/whitepapers/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/whitepapers/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (MDX files named `<id>-<slug>.mdx`)
- [src/app/news/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (MDX files named `<id>-<slug>.mdx`)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) -> [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)
- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) -> [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx) -> [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (versioned MDX files such as [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))

이 매핑은 reviewer, content editor, AI Agent 모두에게 중요합니다.

### 4.2 `page.tsx`를 thin 하고 안정적으로 유지할 수 있다

publication / legal family에서 route file은 문서 텍스트를 직접 반복하는 대신, routing 책임에 집중하는 편이 좋습니다.

좋은 thin route file이 보통 담당하는 일은 다음 정도입니다.

- route params 처리
- canonical slug redirect 처리
- 없는 record에 대한 `notFound()` 처리
- frontmatter 기반 metadata 생성
- shared page shell 호출

이렇게 하면 content는 자주 바뀌어도 implementation code는 안정적으로 유지됩니다.

### 4.3 하나의 family에서 일관된 UI를 공유할 수 있다

publication family는 여러 entry에 대해 같은 시각적 구조를 유지하고 싶은 경우가 많습니다.

- shared hero treatment
- shared byline / meta area
- shared body typography
- shared related-items area
- shared gated-content behavior
- shared legal-document wrapper

MDX에 컨텐츠를 두고 presentation을 shared component로 분리하면, page implementation logic 복제 없이 여러 content item을 일관되게 렌더링할 수 있습니다.

### 4.4 코드 레벨이 언어 비의존적으로 유지된다

구현 코드가 대부분 shell, loader, rendering logic에 머물면, 언어별로 코드를 다시 짤 필요가 줄어듭니다.

즉:

- 일본어, 영어, 한국어 컨텐츠가 같은 rendering contract를 재사용할 수 있고
- UI 코드는 layout과 behavior에 집중하며
- content language는 component logic이 아니라 content file에 머무릅니다

이는 향후 localization이나 cross-language parity 작업을 더 깔끔하게 만듭니다.

### 4.5 i18n 대응이 구조적으로 쉬워진다

route-aligned MDX 규칙은 multilingual 확장을 더 쉽게 만듭니다.
content identity와 route identity를 분리하지 않고 명시적으로 유지할 수 있기 때문입니다.

예를 들어 family 차원에서 다음을 유지할 수 있습니다.

- stable `id`
- canonical route `slug`
- 언어별 content file
- shared renderer와 shared route behavior

구체적인 multilingual file contract는 family별로 달라질 수 있지만, 핵심은 긴 본문을 route code 안에 묻어두는 것보다 MDX 분리가 언어 확장에 훨씬 유리하다는 점입니다.

## 5. 유용한 하위 패턴 2+1가지

이 저장소에는 같은 아이디어의 중요한 변형이 이미 존재합니다.

### 5.1 Publication family용 shared content-root MDX

여러 item이 같은 route 구조를 공유한다면 family별 content root를 두는 것이 좋습니다.

예시:

- [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (`*.mdx`)
- [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (`*.mdx`)
- [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (`*.mdx`)
- [src/content/events](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/events) (`*.mdx`)
- [src/content/demo/aip](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/aip) (`*.mdx`)
- [src/content/demo/acp](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/acp) (`*.mdx`)

권장 contract:

- 파일명에 stable `id`와 읽기 좋은 slug를 함께 넣는다
- frontmatter가 canonical route slug를 유지한다
- loader는 `id` 기준으로 resolve한다
- route는 `/section/:id` 또는 mismatched slug를 `/section/:id/:slug`로 redirect한다

이는 entry가 많은 route family와 공유 로딩 파이프라인에 적합합니다.

### 5.2 Singleton / route-owned document용 route-adjacent MDX

하나의 route가 하나의 문서를 가장 명확하게 소유할 때는 route 옆의 `content.mdx`가 좋습니다.

현재 예시:

- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) + [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) + [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)

이 패턴이 좋은 경우:

- 하나의 route가 하나의 문서를 소유한다
- multi-record loader가 크게 필요하지 않다
- shared content root보다 route adjacency가 더 읽기 쉽다

### 5.3 Versioned document family용 dedicated content root

versioned document family는 slug/date 기반 dedicated content root가 더 잘 맞는 경우가 많습니다.

현재 예시:

- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
- [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (for example [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))

이 패턴이 좋은 경우:

- route는 family-specific 하게 유지하되
- record는 versioned 되고
- route가 valid slug 목록과 frontmatter 기반 metadata를 필요로 하며
- 모든 version file을 한 곳에서 보는 것이 더 명확하다

## 6. 권장 매핑 규칙

### 6.1 Publication / detail family

권장 패턴:

- route: `src/app/<section>/[id]/[slug]/page.tsx`
- content: `src/content/<section>/<id>-<slug>.mdx`
- canonical identity: frontmatter `id` + frontmatter `slug`
- shared asset root: `public/<section>/<id>/...`

예시:

- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx)
- [src/content/blog/9-data-discovery-privacy-management.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog/9-data-discovery-privacy-management.mdx)
- [public/blog/9/thumbnail.png](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/public/blog/9/thumbnail.png)

### 6.2 Singleton document

권장 패턴:

- route: `src/app/<route>/page.tsx`
- content: `src/app/<route>/content.mdx`

예시:

- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
- [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)

### 6.3 Versioned document family

권장 패턴:

- route: `src/app/<route>/[slug]/page.tsx`
- content: `src/content/<family>/<slug>.mdx`

예시:

- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
- [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx)

## 7. Thin wrapper route가 해야 하는 일

좋은 thin wrapper route는 보통 아래 정도만 수행합니다.

1. params를 읽는다
2. target record/document를 resolve한다
3. slug가 없거나 mismatched이면 redirect한다
4. frontmatter로 metadata를 만든다
5. shared family page shell을 렌더링한다

현재 저장소의 대표 예시:

- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx)
- [src/app/news/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/%5Bid%5D/%5Bslug%5D/page.tsx)
- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx)
- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)

이런 route는 다시 giant content registry나 page-specific prose container가 되면 안 됩니다.

## 8. Frontmatter는 route contract의 일부다

content를 MDX로 옮기면 frontmatter는 단순 메타데이터가 아니라 route contract의 일부가 됩니다.

frontmatter가 담당하는 대표 역할:

- canonical slug
- title
- description
- date 또는 version
- hero image path
- related item IDs
- gated-content flag
- 지원되는 family에서는 redirect target

즉, frontmatter 품질은 선택사항이 아닙니다.
route, loader, metadata, rendering shell을 연결하는 애플리케이션 계약입니다.

## 9. 피해야 할 패턴

### 안 좋은 패턴 A: thin route처럼 보이지만 content lookup이 불투명한 구조

```tsx
export default function Page() {
  return <PublicationPage sourceKey="item-17" />;
}
```

문제점:

- route만 봐서는 어떤 파일이 content owner인지 드러나지 않는다
- 매핑이 다른 registry에 숨겨진다
- reviewer와 AI Agent가 간접 key를 계속 추적해야 한다

### 안 좋은 패턴 B: MDX로 분리했지만 파일명이 route identity를 무시하는 구조

나쁜 예:

- `src/content/blog/final.mdx`
- `src/content/blog/post-latest.mdx`
- `src/content/privacy-policy/current.mdx`

문제점:

- route ownership이 불명확해진다
- slug lookup이 취약해진다
- 향후 i18n/versioning 확장이 어려워진다

### 안 좋은 패턴 C: publication route를 정적 마케팅 페이지처럼 다시 giant JSX로 되돌리는 구조

blog나 legal document route를 다시 큰 inline JSX로 강제로 옮기면 대개 더 나빠집니다.

- long-form copy 수정이 어려워지고
- shared renderer 유지보수가 어려워지며
- 향후 language 확장이 어려워지고
- 단순 content 수정에도 page implementation churn이 커집니다

## 10. 리뷰할 때 확인할 질문

이 패턴을 리뷰할 때는 다음을 물어보면 좋습니다.

- 어떤 MDX 파일이 이 route를 소유하는지 바로 알 수 있는가?
- 파일명 규칙이 URI와 slug에 자연스럽게 대응하는가?
- `page.tsx`가 올바른 이유로 thin 한가, 아니면 나쁜 registry 뒤에 숨은 것뿐인가?
- shared UI는 component에, shared logic은 loader에 있는가?
- frontmatter가 route contract를 명확히 정의하는가?
- 두 번째 언어, 두 번째 버전을 추가해도 구조가 무너지지 않는가?

## 11. AI Agent에게 지시할 때 유용한 표현

다음과 같은 지시가 유용합니다.

- “이 publication route를 route-aligned MDX content를 읽는 thin wrapper로 구현해줘.”
- “`id`/`slug` 기반 MDX 파일명으로 route-to-content mapping이 명시적으로 보이게 해줘.”
- “long-form body는 MDX에 두고, rendering은 shared page shell을 써줘.”
- “이 publication/legal route를 큰 JSX-authored marketing page로 바꾸지는 마.”

좋은 task packet에는 다음도 함께 있어야 합니다.

- 어떤 route family가 범위인지
- route-adjacent `content.mdx`인지, shared `src/content/**`인지
- 따라야 할 경로/파일명 규칙이 무엇인지
- canonical slug redirect와 metadata generation을 유지해야 하는지

## 12. 결론

PR 470이 정적 마케팅 페이지의 기본 route-local refactoring 방향을 정리했다면,
이 MDX 패턴은 publication/document family에 대응하는 변형입니다.

- route는 local하고 thin 하게 유지하고
- content ownership은 MDX로 옮기며
- file path는 route identity와 정렬되고
- UI는 shared renderer로 일관되게 유지되며
- implementation code는 언어 비의존적으로 유지되고
- 향후 i18n과 content scale-up이 쉬워집니다

즉, 진짜 원칙은 “항상 copy를 `page.tsx`에 넣어라”가 아닙니다.
진짜 원칙은 다음입니다.

- authoring ownership을 route 근처에 둔다
- route와 content의 ownership 관계를 명확하게 만든다
- page family에 가장 잘 맞는 authoring surface를 선택한다

정적 마케팅 페이지라면 대개 `page.tsx`의 JSX가 맞고,
publication과 legal document라면 대개 route-aligned MDX + thin route wrapper가 더 적합합니다.

## 13. 이 저장소의 현재 MDX 기반 content-management 기능

`corp-web-japan`의 route-aligned MDX 패턴은 단순한 파일 배치 규칙이 아닙니다.
loader, frontmatter, shared shell, route behavior를 통해 구현된 content-management contract이기도 합니다.

### 13.1 현재 지원하는 content family

현재 public MDX-backed family는 다음을 포함합니다.

- `src/lib/publications/**` 기반 publication family
  - blog
  - whitepapers
  - news
  - events
  - use cases
  - AIP demos
  - ACP demos
- `src/lib/resources/**` 기반 resource-style family
  - introduction deck
  - glossary
  - manuals
- route-adjacent 또는 versioned document family
  - `src/app/t/eula/content.mdx`
  - `src/app/t/terms-of-service/content.mdx`
  - `src/content/privacy-policy/*.mdx`

즉, 이 패턴은 “blog를 MDX로 관리한다” 수준보다 훨씬 넓습니다.
이 저장소는 이미 여러 public content family에서 MDX를 authoring layer로 사용하고 있고,
그 위에 shared route/rendering rule을 얹고 있습니다.

### 13.2 Content list는 frontmatter 기반으로 미리 인덱싱된다

publication 계열 family에서는 list page를 만들 때 먼저 full MDX body를 모두 렌더링하지 않습니다.
우선 frontmatter record를 인덱싱해서 list를 구성합니다.

핵심 구현은 다음에서 확인할 수 있습니다.

- `src/lib/publications/create-standard-records-repository.ts`
- `src/lib/publications/blog/records.ts`
- `src/lib/publications/whitepapers/records.ts`
- `src/lib/publications/events/records.ts`

현재 동작은 대략 다음과 같습니다.

- family content root 아래의 모든 `*.mdx` 파일을 읽는다
- 각 source file의 frontmatter block을 한 번 파싱한다
- frontmatter를 typed record로 normalize한다
- numeric `id` 기준 내림차순 정렬한다
- `hidden: true` record는 visible list item에서 제외한다
- shadow record가 다른 목적지로 가야 할 때는 `redirectUrl`로 list-card href를 바꾼다
- static route generation을 위해 `listParams()`와 `listIds()`를 제공한다

즉, list page는 full body 렌더링 없이도 “어떤 컨텐츠가 존재하는가?”와
“어떤 card를 노출해야 하는가?”를 record index만으로 빠르게 답할 수 있습니다.

### 13.3 Detail loader는 file read를 캐시해서 반복 접근을 빠르게 한다

detail loader에는 또 다른 런타임 최적화가 있습니다.
현재 핵심 구현은 다음입니다.

- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/create-gated-publication-post-loader.ts`
- `src/lib/resources/base-resource-publication-post-loader.ts`

핵심 포인트는 각 loader가 `sourcePath` 기준 in-memory body-source cache를 유지한다는 점입니다.
이로 인해 현재 구현은 다음 장점을 가집니다.

- 같은 post에 대한 반복 요청 때마다 MDX 파일을 다시 디스크에서 읽지 않아도 된다
- metadata, TOC 추출, related item 구성, rendering이 모두 같은 cached source text를 재사용할 수 있다
- list page loading과 detail page loading이 분리되어 있어 list 응답은 가볍게 유지하고, detail route에서만 full rendered MDX를 사용한다

실제로 이 저장소는 두 층의 최적화를 함께 사용합니다.

- frontmatter-indexed list repository로 list/route-param resolution을 빠르게 처리
- per-source body cache로 반복 detail read를 빠르게 처리

### 13.4 Frontmatter는 제목/날짜 이상의 동작을 제어한다

이 저장소에서 frontmatter는 단순 설명 헤더가 아니라 behavior surface입니다.
현재는 list visibility, redirect, shared imagery, metadata, event timeline behavior, gating flow까지 frontmatter가 제어합니다.

#### 공통 identity / presentation 필드

주요 family 전반의 공통 baseline 필드는 다음과 같습니다.

- `id`
- `slug`
- `title`
- `description`
- `date`
- `heroImageSrc`
- `relatedIds` 또는 family별 동등한 related-item metadata
- 지원되는 family의 `author`

이 필드들은 canonical route, page header, list card, metadata generation, related-item rendering에 연결됩니다.

#### List / detail behavior 필드

현재 구현은 route/list behavior도 frontmatter로 제어합니다.

- `hidden: true`
  - visible list page에서는 제외
- `redirectUrl`
  - local record identity는 유지하면서 human visitor와 list card 목적지를 다른 곳으로 전환
- `hideHeroImageOnDetail: true`
  - list image metadata는 유지하면서 detail page의 hero image만 숨김
- `hideTocOnDetail: true`
  - 자동 heading 기반 TOC UI를 숨겨야 하는 경우 해당 출력 억제

즉, frontmatter 품질은 copy 품질만이 아니라 application behavior 품질로도 리뷰되어야 합니다.

#### 이미 지원되는 family-specific 필드

현재 저장소는 다음과 같은 family-specific frontmatter 기능도 지원합니다.

- `listDescription`
  - whitepaper list에서 detail description 대신 list 전용 summary를 사용
- `eventDate`
  - publish date만이 아니라 실제 event date를 timeline 배치 기준으로 사용
- `eventLabel`
  - event badge label을 기본값 대신 개별 override
- `gated: true`
  - 지원되는 family에서 gated-content 경로 활성화
- `downloadCta`
  - CTA label과 download destination contract 정의
- `downloadCoverImageSrc`
  - whitepaper PDF gating page에서 article thumbnail 대신 전용 portrait cover 사용

### 13.5 SEO와 canonical route behavior도 frontmatter 기반이다

MDX layer는 SEO와 canonical routing behavior에도 직접 연결됩니다.
대표 route file 예시는 다음과 같습니다.

- `src/app/blog/[id]/[slug]/page.tsx`
- `src/app/whitepapers/[id]/[slug]/page.tsx`
- `src/app/events/[id]/[slug]/page.tsx`

현재 route contract는 다음과 같습니다.

- content는 `id` 기준으로 resolve한다
- `slug`는 canonical display segment로 취급한다
- `/section/:id` 또는 mismatched slug는 `/section/:id/:slug`로 redirect한다
- page metadata는 record/frontmatter 값으로 생성한다
- record가 의도적으로 다른 route나 목적지를 가리키는 경우 redirect-aware behavior를 유지한다

즉, frontmatter는 visible page body만이 아니라 SEO/canonicalization layer의 일부이기도 합니다.

### 13.6 Event page는 archive와 upcoming-event UX를 함께 지원한다

event family는 frontmatter-backed MDX가 더 풍부한 list behavior를 만들 수 있음을 잘 보여줍니다.
주요 구현은 다음에 있습니다.

- `src/lib/publications/events/records.ts`
- `src/app/events/page.tsx`

현재 event-page 기능은 다음을 포함합니다.

- past event archive를 계속 노출한다
- 가장 가까운 visible upcoming event를 `heroEvent`로 계산한다
- `eventDate`가 있으면 그것을 우선 사용하고, 없으면 `date`로 fallback한다
- 선택된 upcoming item을 hero에 `Upcoming Event` eyebrow와 CTA button으로 강조한다
- 나머지 timeline은 `Past Events` 섹션으로 렌더링한다
- hero item이 시간에 따라 바뀌어도 past-event list archive는 유지한다

즉, event page는 하드코딩된 landing page가 아니라,
MDX event corpus를 frontmatter 기반 timeline view로 표현한 것입니다.

### 13.7 CTA button과 gating form도 authoring contract의 일부다

현재 MDX 시스템은 각 route file에 conversion logic을 직접 넣지 않고도 CTA/gating behavior를 지원합니다.
대표 구현 파일은 다음과 같습니다.

- `src/components/sections/publication-post-page.tsx`
- `src/components/sections/publication/gated-content.tsx`
- `src/lib/publications/gating.ts`
- `src/lib/gating-form.ts`
- `src/app/whitepapers/[id]/[slug]/pdf/page.tsx`

현재 지원 기능은 다음과 같습니다.

- `downloadCta` 기반 article-body CTA button
- `<GatingCut />`를 통한 gated preview/body 분리
- `/api/gating-form/unlock`를 통한 gated-content unlock
- content key 기반 per-content gating cookie
- internal review용 preview-mode bypass
- whitepaper에서 일반 article thumbnail 대신 `downloadCoverImageSrc`를 사용할 수 있는 PDF gate page

실무 authoring rule로 정리하면:

- resource가 gated라면 MDX file에 `gated: true`를 선언해야 하고
- body 안에 `<GatingCut />`가 있어야 하며
- 그러면 route와 shared shell이 route-specific 재구현 없이 preview content, gating form, unlocked content를 렌더링할 수 있습니다

## 14. 새 MDX-backed entry를 위한 실무 authoring 체크리스트

이 저장소에서 새 MDX-backed content item을 추가하거나 리뷰할 때의 최소 체크리스트는 다음과 같습니다.

1. family에 맞는 올바른 content root를 선택한다.
2. 그 family가 기대하는 경우 `id`와 route-readable slug가 유지되는 파일명을 사용한다.
3. 필수 identity/metadata 필드를 설정한다: `id`, `slug`, `title`, `description`, `date`, `heroImageSrc`.
4. 관계/동작 필드는 정말 필요할 때만 넣는다:
   - `relatedIds`
   - `hidden`
   - `redirectUrl`
   - `listDescription`
   - `eventDate`
   - `eventLabel`
   - `hideHeroImageOnDetail`
   - `hideTocOnDetail`
   - `gated`
   - `downloadCta`
   - `downloadCoverImageSrc`
5. route-aligned asset은 해당 public family/id path 아래에 둔다.
6. gated content라면 `<GatingCut />`를 넣고 unlock flow를 검증한다.
7. canonical route, list visibility, redirect behavior, metadata가 의도한 contract와 일치하는지 확인한다.

이것이 PR 471 문서에 대한 핵심 보완점입니다.
이 저장소의 route-aligned MDX authoring은 단순한 file-layout convention이 아니라,
이미 상당한 수준의 content-management feature set을 포함하고 있습니다.
