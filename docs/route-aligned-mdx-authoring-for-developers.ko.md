     1|# Route-Aligned MDX Authoring 개발자 소개서
     2|
     3|## 1. 왜 이 문서가 필요한가
     4|
     5|PR 470은 정적 마케팅 페이지를 위한 기본 route-local refactoring 방향을 문서화했습니다.
     6|핵심은 다음이었습니다.
     7|
     8|- `page.tsx`를 주요 authoring surface로 유지한다
     9|- section composition이 route에서 바로 읽혀야 한다
    10|- 추출된 section 파일은 UI 구현 디테일에 집중한다
    11|
    12|이 문서는 그와 연결된 다른 패턴을 다룹니다.
    13|즉, `page.tsx`에 실제 카피를 inline JSX로 두는 대신, 긴 본문 컨텐츠를 `.mdx` 파일로 분리하는 route-local refactoring의 변형/확장판입니다.
    14|
    15|이 저장소에서 대표적인 예시는 다음과 같습니다.
    16|
    17|- blog 포스트
    18|- whitepaper
    19|- news 포스트
    20|- events
    21|- use-cases 및 demo detail 페이지
    22|- EULA, Terms of Service, versioned privacy policy 같은 legal document
    23|
    24|이 family들에서는 “모든 카피를 `page.tsx`로 되돌린다”가 최선이 아닙니다.
    25|오히려 다음 상태가 더 좋습니다.
    26|
    27|- route file은 thin wrapper로 유지한다
    28|- 실제 본문 컨텐츠는 route-aligned MDX 파일로 분리한다
    29|- route 또는 slug와 자연스럽게 대응되는 디렉토리/파일명 규칙을 유지한다
    30|- shared code가 MDX content 바깥의 일관된 UI shell을 렌더링한다
    31|
    32|즉, 이 패턴은 PR 470의 반대가 아닙니다.
    33|같은 authoring ownership 원칙을 publication/document family에 맞게 확장한 것입니다.
    34|
    35|## 2. 핵심 아이디어
    36|
    37|이 family들에서는 책임을 다음처럼 나누는 것이 좋습니다.
    38|
    39|- `src/app/**/page.tsx`
    40|  - route entry
    41|  - param 처리
    42|  - canonical redirect 로직
    43|  - metadata 연결
    44|  - thin page composition
    45|- `src/content/**` 또는 route-adjacent `content.mdx`
    46|  - 실제 long-form content body
    47|  - 문서/포스트를 설명하는 frontmatter
    48|- `src/lib/**`
    49|  - loader, route resolution, frontmatter parsing, MDX rendering, family별 규칙
    50|- `src/components/sections/**`
    51|  - shared post/document page shell과 재사용 UI primitive
    52|
    53|요약하면:
    54|
    55|- 정적 마케팅 페이지 패턴 -> `page.tsx`가 대부분의 카피를 소유
    56|- publication / document 패턴 -> `.mdx`가 긴 본문 카피를 소유하고, `page.tsx`는 thin wrapper로 유지
    57|
    58|## 3. 언제 이 패턴이 맞는가
    59|
    60|다음 조건이 대부분 맞으면 route-aligned MDX authoring이 적합합니다.
    61|
    62|- route가 publication, article, document, long-form resource family다
    63|- 본문이 bespoke 마케팅 composition보다 prose 중심이다
    64|- 같은 family 안의 많은 페이지가 하나의 rendering contract를 공유해야 한다
    65|- route가 자연스럽게 `id`, `slug`, version identifier와 대응된다
    66|- 향후 content 수정이 page implementation code 변경 없이 가능해야 한다
    67|- multilingual 확장 가능성이 높거나 이미 예상된다
    68|
    69|이 저장소에서 좋은 사례:
    70|
    71|- `/blog/:id/:slug`
    72|- `/whitepapers/:id/:slug`
    73|- `/news/:id/:slug`
    74|- `/events/:id/:slug`
    75|- `/demo/aip/:id/:slug`
    76|- `/demo/acp/:id/:slug`
    77|- `/t/eula`
    78|- `/t/terms-of-service`
    79|- `/t/privacy-policy/[slug]`
    80|
    81|기본 선택지가 아닌 경우:
    82|
    83|- top page
    84|- solution landing page
    85|- reviewer가 JSX에서 카피와 section composition을 직접 읽어야 하는 정적 마케팅 페이지
    86|
    87|## 4. 주요 장점
    88|
    89|### 4.1 Route와 content file의 매핑이 명확해진다
    90|
    91|예측 가능한 MDX 파일 레이아웃을 사용하면 다음 질문에 바로 답할 수 있습니다.
    92|
    93|- 이 route의 source content file은 무엇인가?
    94|- 이 slug를 소유한 파일은 무엇인가?
    95|- 새 locale 버전은 어디에 추가해야 하는가?
    96|
    97|현재 저장소 기준 예시:
    98|
    99|- [src/app/blog/[id]/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/[id]/[slug]/page.tsx) -> [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (MDX files named `<id>-<slug>.mdx`)
   100|- [src/app/whitepapers/[id]/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/whitepapers/[id]/[slug]/page.tsx) -> [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (MDX files named `<id>-<slug>.mdx`)
   101|- [src/app/news/[id]/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/[id]/[slug]/page.tsx) -> [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (MDX files named `<id>-<slug>.mdx`)
   102|- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) -> [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)
   103|- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) -> [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
   104|- [src/app/t/privacy-policy/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/[slug]/page.tsx) -> [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (versioned MDX files such as [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))
   105|
   106|이 매핑은 reviewer, content editor, AI Agent 모두에게 중요합니다.
   107|
   108|### 4.2 `page.tsx`를 thin 하고 안정적으로 유지할 수 있다
   109|
   110|publication / legal family에서 route file은 문서 텍스트를 직접 반복하는 대신, routing 책임에 집중하는 편이 좋습니다.
   111|
   112|좋은 thin route file이 보통 담당하는 일은 다음 정도입니다.
   113|
   114|- route params 처리
   115|- canonical slug redirect 처리
   116|- 없는 record에 대한 `notFound()` 처리
   117|- frontmatter 기반 metadata 생성
   118|- shared page shell 호출
   119|
   120|이렇게 하면 content는 자주 바뀌어도 implementation code는 안정적으로 유지됩니다.
   121|
   122|### 4.3 하나의 family에서 일관된 UI를 공유할 수 있다
   123|
   124|publication family는 여러 entry에 대해 같은 시각적 구조를 유지하고 싶은 경우가 많습니다.
   125|
   126|- shared hero treatment
   127|- shared byline / meta area
   128|- shared body typography
   129|- shared related-items area
   130|- shared gated-content behavior
   131|- shared legal-document wrapper
   132|
   133|MDX에 컨텐츠를 두고 presentation을 shared component로 분리하면, page implementation logic 복제 없이 여러 content item을 일관되게 렌더링할 수 있습니다.
   134|
   135|### 4.4 코드 레벨이 언어 비의존적으로 유지된다
   136|
   137|구현 코드가 대부분 shell, loader, rendering logic에 머물면, 언어별로 코드를 다시 짤 필요가 줄어듭니다.
   138|
   139|즉:
   140|
   141|- 일본어, 영어, 한국어 컨텐츠가 같은 rendering contract를 재사용할 수 있고
   142|- UI 코드는 layout과 behavior에 집중하며
   143|- content language는 component logic이 아니라 content file에 머무릅니다
   144|
   145|이는 향후 localization이나 cross-language parity 작업을 더 깔끔하게 만듭니다.
   146|
   147|### 4.5 i18n 대응이 구조적으로 쉬워진다
   148|
   149|route-aligned MDX 규칙은 multilingual 확장을 더 쉽게 만듭니다.
   150|content identity와 route identity를 분리하지 않고 명시적으로 유지할 수 있기 때문입니다.
   151|
   152|예를 들어 family 차원에서 다음을 유지할 수 있습니다.
   153|
   154|- stable `id`
   155|- canonical route `slug`
   156|- 언어별 content file
   157|- shared renderer와 shared route behavior
   158|
   159|구체적인 multilingual file contract는 family별로 달라질 수 있지만, 핵심은 긴 본문을 route code 안에 묻어두는 것보다 MDX 분리가 언어 확장에 훨씬 유리하다는 점입니다.
   160|
   161|## 5. 유용한 하위 패턴 2+1가지
   162|
   163|이 저장소에는 같은 아이디어의 중요한 변형이 이미 존재합니다.
   164|
   165|### 5.1 Publication family용 shared content-root MDX
   166|
   167|여러 item이 같은 route 구조를 공유한다면 family별 content root를 두는 것이 좋습니다.
   168|
   169|예시:
   170|
   171|- [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (`*.mdx`)
   172|- [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (`*.mdx`)
   173|- [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (`*.mdx`)
   174|- [src/content/events](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/events) (`*.mdx`)
   175|- [src/content/demo/aip](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/aip) (`*.mdx`)
   176|- [src/content/demo/acp](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/acp) (`*.mdx`)
   177|
   178|권장 contract:
   179|
   180|- 파일명에 stable `id`와 읽기 좋은 slug를 함께 넣는다
   181|- frontmatter가 canonical route slug를 유지한다
   182|- loader는 `id` 기준으로 resolve한다
   183|- route는 `/section/:id` 또는 mismatched slug를 `/section/:id/:slug`로 redirect한다
   184|
   185|이는 entry가 많은 route family와 공유 로딩 파이프라인에 적합합니다.
   186|
   187|### 5.2 Singleton / route-owned document용 route-adjacent MDX
   188|
   189|하나의 route가 하나의 문서를 가장 명확하게 소유할 때는 route 옆의 `content.mdx`가 좋습니다.
   190|
   191|현재 예시:
   192|
   193|- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) + [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
   194|- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) + [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)
   195|
   196|이 패턴이 좋은 경우:
   197|
   198|- 하나의 route가 하나의 문서를 소유한다
   199|- multi-record loader가 크게 필요하지 않다
   200|- shared content root보다 route adjacency가 더 읽기 쉽다
   201|
   202|### 5.3 Versioned document family용 dedicated content root
   203|
   204|versioned document family는 slug/date 기반 dedicated content root가 더 잘 맞는 경우가 많습니다.
   205|
   206|현재 예시:
   207|
   208|- [src/app/t/privacy-policy/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/[slug]/page.tsx)
   209|- [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (for example [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))
   210|
   211|이 패턴이 좋은 경우:
   212|
   213|- route는 family-specific 하게 유지하되
   214|- record는 versioned 되고
   215|- route가 valid slug 목록과 frontmatter 기반 metadata를 필요로 하며
   216|- 모든 version file을 한 곳에서 보는 것이 더 명확하다
   217|
   218|## 6. 권장 매핑 규칙
   219|
   220|### 6.1 Publication / detail family
   221|
   222|권장 패턴:
   223|
   224|- route: `src/app/<section>/[id]/[slug]/page.tsx`
   225|- content: `src/content/<section>/<id>-<slug>.mdx`
   226|- canonical identity: frontmatter `id` + frontmatter `slug`
   227|- shared asset root: `public/<section>/<id>/...`
   228|
   229|예시:
   230|
   231|- [src/app/blog/[id]/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/[id]/[slug]/page.tsx)
   232|- [src/content/blog/9-data-discovery-privacy-management.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog/9-data-discovery-privacy-management.mdx)
   233|- [public/blog/9/thumbnail.png](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/public/blog/9/thumbnail.png)
   234|
   235|### 6.2 Singleton document
   236|
   237|권장 패턴:
   238|
   239|- route: `src/app/<route>/page.tsx`
   240|- content: `src/app/<route>/content.mdx`
   241|
   242|예시:
   243|
- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
- [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)

   247|### 6.3 Versioned document family
   248|
   249|권장 패턴:
   250|
   251|- route: `src/app/<route>/[slug]/page.tsx`
   252|- content: `src/content/<family>/<slug>.mdx`
   253|
   254|예시:
   255|
   256|- [src/app/t/privacy-policy/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/[slug]/page.tsx)
   257|- [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx)
   258|
   259|## 7. Thin wrapper route가 해야 하는 일
   260|
   261|좋은 thin wrapper route는 보통 아래 정도만 수행합니다.
   262|
   263|1. params를 읽는다
   264|2. target record/document를 resolve한다
   265|3. slug가 없거나 mismatched이면 redirect한다
   266|4. frontmatter로 metadata를 만든다
   267|5. shared family page shell을 렌더링한다
   268|
   269|현재 저장소의 대표 예시:
   270|
- [src/app/blog/[id]/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/[id]/[slug]/page.tsx)
- [src/app/news/[id]/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/[id]/[slug]/page.tsx)
- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx)
- [src/app/t/privacy-policy/[slug]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/[slug]/page.tsx)
   276|
   277|이런 route는 다시 giant content registry나 page-specific prose container가 되면 안 됩니다.
   278|
   279|## 8. Frontmatter는 route contract의 일부다
   280|
   281|content를 MDX로 옮기면 frontmatter는 단순 메타데이터가 아니라 route contract의 일부가 됩니다.
   282|
   283|frontmatter가 담당하는 대표 역할:
   284|
   285|- canonical slug
   286|- title
   287|- description
   288|- date 또는 version
   289|- hero image path
   290|- related item IDs
   291|- gated-content flag
   292|- 지원되는 family에서는 redirect target
   293|
   294|즉, frontmatter 품질은 선택사항이 아닙니다.
   295|route, loader, metadata, rendering shell을 연결하는 애플리케이션 계약입니다.
   296|
   297|## 9. 피해야 할 패턴
   298|
   299|### 안 좋은 패턴 A: thin route처럼 보이지만 content lookup이 불투명한 구조
   300|
   301|```tsx
   302|export default function Page() {
   303|  return <PublicationPage sourceKey="item-17" />;
   304|}
   305|```
   306|
   307|문제점:
   308|
   309|- route만 봐서는 어떤 파일이 content owner인지 드러나지 않는다
   310|- 매핑이 다른 registry에 숨겨진다
   311|- reviewer와 AI Agent가 간접 key를 계속 추적해야 한다
   312|
   313|### 안 좋은 패턴 B: MDX로 분리했지만 파일명이 route identity를 무시하는 구조
   314|
   315|나쁜 예:
   316|
   317|- `src/content/blog/final.mdx`
   318|- `src/content/blog/post-latest.mdx`
   319|- `src/content/privacy-policy/current.mdx`
   320|
   321|문제점:
   322|
   323|- route ownership이 불명확해진다
   324|- slug lookup이 취약해진다
   325|- 향후 i18n/versioning 확장이 어려워진다
   326|
   327|### 안 좋은 패턴 C: publication route를 정적 마케팅 페이지처럼 다시 giant JSX로 되돌리는 구조
   328|
   329|blog나 legal document route를 다시 큰 inline JSX로 강제로 옮기면 대개 더 나빠집니다.
   330|
   331|- long-form copy 수정이 어려워지고
   332|- shared renderer 유지보수가 어려워지며
   333|- 향후 language 확장이 어려워지고
   334|- 단순 content 수정에도 page implementation churn이 커집니다
   335|
   336|## 10. 리뷰할 때 확인할 질문
   337|
   338|이 패턴을 리뷰할 때는 다음을 물어보면 좋습니다.
   339|
   340|- 어떤 MDX 파일이 이 route를 소유하는지 바로 알 수 있는가?
   341|- 파일명 규칙이 URI와 slug에 자연스럽게 대응하는가?
   342|- `page.tsx`가 올바른 이유로 thin 한가, 아니면 나쁜 registry 뒤에 숨은 것뿐인가?
   343|- shared UI는 component에, shared logic은 loader에 있는가?
   344|- frontmatter가 route contract를 명확히 정의하는가?
   345|- 두 번째 언어, 두 번째 버전을 추가해도 구조가 무너지지 않는가?
   346|
   347|## 11. AI Agent에게 지시할 때 유용한 표현
   348|
   349|다음과 같은 지시가 유용합니다.
   350|
   351|- “이 publication route를 route-aligned MDX content를 읽는 thin wrapper로 구현해줘.”
   352|- “`id`/`slug` 기반 MDX 파일명으로 route-to-content mapping이 명시적으로 보이게 해줘.”
   353|- “long-form body는 MDX에 두고, rendering은 shared page shell을 써줘.”
   354|- “이 publication/legal route를 큰 JSX-authored marketing page로 바꾸지는 마.”
   355|
   356|좋은 task packet에는 다음도 함께 있어야 합니다.
   357|
   358|- 어떤 route family가 범위인지
   359|- route-adjacent `content.mdx`인지, shared `src/content/**`인지
   360|- 따라야 할 경로/파일명 규칙이 무엇인지
   361|- canonical slug redirect와 metadata generation을 유지해야 하는지
   362|
   363|## 12. 결론
   364|
   365|PR 470이 정적 마케팅 페이지의 기본 route-local refactoring 방향을 정리했다면,
   366|이 MDX 패턴은 publication/document family에 대응하는 변형입니다.
   367|
   368|- route는 local하고 thin 하게 유지하고
   369|- content ownership은 MDX로 옮기며
   370|- file path는 route identity와 정렬되고
   371|- UI는 shared renderer로 일관되게 유지되며
   372|- implementation code는 언어 비의존적으로 유지되고
   373|- 향후 i18n과 content scale-up이 쉬워집니다
   374|
   375|즉, 진짜 원칙은 “항상 copy를 `page.tsx`에 넣어라”가 아닙니다.
   376|진짜 원칙은 다음입니다.
   377|
   378|- authoring ownership을 route 근처에 둔다
   379|- route와 content의 ownership 관계를 명확하게 만든다
   380|- page family에 가장 잘 맞는 authoring surface를 선택한다
   381|
   382|정적 마케팅 페이지라면 대개 `page.tsx`의 JSX가 맞고,
   383|publication과 legal document라면 대개 route-aligned MDX + thin route wrapper가 더 적합합니다.
   384|