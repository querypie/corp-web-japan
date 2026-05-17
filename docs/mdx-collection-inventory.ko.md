# MDX collection 현황

이 문서는 `origin/main`의 `f3382958b0ce8c89c93d04ccf689606bc13f1948` 커밋 기준으로, 현재 저장소에서 MDX 문서를 기반으로 동작하는 콘텐츠 collection 현황을 정리한다.

범위:

- `src/content/**` 아래의 공개 MDX collection과 `src/lib/publications/**` 또는 `src/lib/resources/**`를 통해 렌더링되는 collection을 포함한다.
- legal page는 별도의 legal-document MDX renderer와 route-owned page composition을 사용하므로, 본문 collection inventory에서는 제외하고 마지막 섹션에서 별도로 정리한다.
- `src/content/internal/*.mdx` 같은 internal-only 지원 MDX는 제외한다.

## Public MDX collection inventory

| Collection | Count | Endpoint | MDX source path | Public asset path | Loader / records source | Notes |
|---|---:|---|---|---|---|---|
| Blog | 29 | List: `/blog`<br>Detail: `/blog/:id/:slug`<br>ID redirect: `/blog/:id` | `src/content/blog/*.mdx` | `public/blog/<id>/...` | `src/lib/publications/blog/records.ts`<br>`src/lib/publications/blog/get-post.ts` | Standard publication family. list hide와 detail redirect를 지원한다. |
| Whitepapers | 30 | List: `/whitepapers`<br>Detail: `/whitepapers/:id/:slug`<br>ID redirect: `/whitepapers/:id`<br>PDF page: `/whitepapers/:id/:slug/pdf`<br>Legacy download route: `/whitepapers/:id/:slug/download` | `src/content/whitepapers/*.mdx` | `public/whitepapers/<id>/...` | `src/lib/publications/whitepapers/records.ts`<br>`src/lib/publications/whitepapers/get-post.ts` | Gated publication family. whitepaper 전용 download CTA, PDF cover image, list fallback description을 지원한다. |
| News | 14 | List: `/news`<br>Detail: `/news/:id/:slug`<br>ID redirect: `/news/:id` | `src/content/news/*.mdx` | `public/news/<id>/...` | `src/lib/publications/news/records.ts`<br>`src/lib/publications/news/get-post.ts` | Standard publication family. source label과 redirect-backed shadow record를 코드상 지원한다. |
| Events | 27 | List: `/events`<br>Detail: `/events/:id/:slug`<br>ID redirect: `/events/:id` | `src/content/events/*.mdx` | `public/events/<id>/...` | `src/lib/publications/events/records.ts`<br>`src/lib/publications/events/get-post.ts` | Event timeline 동작이 추가된 standard publication family. 공개 list route는 현재 활성화되어 있고 indexable 상태다. |
| Use cases | 29 | List: `/use-cases`<br>Detail: `/use-cases/:id/:slug`<br>ID redirect: `/use-cases/:id` | `src/content/use-cases/*.mdx` | `public/use-cases/<id>/...` | `src/lib/publications/use-cases/records.ts`<br>`src/lib/publications/use-cases/get-post.ts` | Standard publication family. list와 detail route는 같은 top-level use-case prefix를 공유한다. |
| AIP demo | 1 | List: `/demo/aip`<br>Detail: `/demo/aip/:id/:slug`<br>ID redirect: `/demo/aip/:id` | `src/content/demo/aip/*.mdx` | `public/demo/aip/<id>/...` | `src/lib/publications/demo/aip/records.ts`<br>`src/lib/publications/demo/aip/get-post.ts` | AIP demo content용 standard publication family. |
| ACP demo | 26 | List: `/demo/acp`<br>Detail: `/demo/acp/:id/:slug`<br>ID redirect: `/demo/acp/:id` | `src/content/demo/acp/*.mdx` | `public/demo/acp/<id>/...` | `src/lib/publications/demo/acp/records.ts`<br>`src/lib/publications/demo/acp/get-post.ts` | ACP demo content용 standard publication family. |
| Introduction deck | 2 | List: `/introduction-deck`<br>Detail: `/introduction-deck/:id/:slug`<br>ID redirect: `/introduction-deck/:id` | `src/content/introduction-deck/*.mdx` | `public/introduction-deck/<id>/...` | `src/lib/resources/introduction-deck-publications.ts`<br>`src/lib/resources/introduction-deck-post-loader.ts` | Resource publication family. gated resource와 frontmatter download CTA를 지원한다. |
| Glossary | 1 | List: `/glossary`<br>Detail: `/glossary/:id/:slug`<br>ID redirect: `/glossary/:id` | `src/content/glossary/*.mdx` | `public/glossary/<id>/...` | `src/lib/resources/glossary-publications.ts`<br>`src/lib/resources/glossary-post-loader.ts` | Resource publication family. 현재 콘텐츠는 related item card를 사용한다. |
| Manuals | 7 | List: `/manuals`<br>Detail: `/manuals/:id/:slug`<br>ID redirect: `/manuals/:id` | `src/content/manuals/*.mdx` | `public/manuals/<id>/...` | `src/lib/resources/manual-publications.ts`<br>`src/lib/resources/manual-post-loader.ts` | Resource publication family. source file order는 `manual-publications.ts`에서 명시적으로 제어한다. |

## Frontmatter support model

### Common frontmatter field set

Public MDX collection 전체에 가장 가깝게 공유되는 frontmatter contract는 다음과 같다.

| Field | Type / shape | Common support | Functional use |
|---|---|---|---|
| `id` | string | 모든 public collection에서 required | detail page의 primary lookup key이며, ID-only URL을 canonical slug URL로 redirect할 때 사용한다. |
| `slug` | string | 모든 public collection에서 required | canonical URL display segment. slug가 없거나 다르면 지원 route에서 canonical route로 redirect한다. |
| `title` | string | 모든 public collection에서 required | detail heading, list card title, metadata source로 사용한다. |
| `description` | string | 모든 public collection에서 required | metadata와 list/detail summary text로 사용한다. |
| `heroImageSrc` | string path | non-legal public collection에서 required | list image와 detail hero image source로 사용한다. |
| `date` | string | standard publication family에서는 required, resource publication family에서는 optional | list/detail date display에 사용한다. Events는 effective event date를 별도로 format할 수 있다. |
| `author` | string 또는 string[] | standard publication family와 whitepapers에서 지원 | article author registry를 통해 detail page author display를 구성한다. |
| `relatedIds` | string[] | standard publication family와 whitepapers에서 지원 | 같은 collection 안의 ID를 resolve하여 related card를 만든다. |
| `hidden` | boolean | standard publication family와 whitepapers에서 지원 | record를 list page에서 숨기지만 detail route lookup은 유지한다. |
| `redirectUrl` | string | standard publication family와 whitepapers에서 지원 | list href를 redirect target으로 resolve하고, detail route가 redirectable-publication helper를 쓰는 경우 human detail visit을 redirect한다. |
| `hideHeroImageOnDetail` | boolean | 일부 standard publication family에서 지원 | body-first rendering이 필요한 record에서 detail hero image를 숨긴다. |
| `hideTocOnDetail` | boolean | standard publication post rendering에서 지원하고 현재 events type에 명시됨 | detail page의 generated table of contents를 숨긴다. |
| `gated` | boolean | whitepapers와 resource publication family에서 지원 | `<GatingCut />` 기준으로 preview body와 locked body를 분리한다. |
| `downloadCta` | object `{ href, label, external? }` | whitepapers와 resource publication family에서 지원 | inline MDX body link 대신 structured download/open CTA를 렌더링한다. |
| `relatedItems` | explicit link object array | resource publication family에서 지원 | same-family ID가 아니라 explicit href/image/title/date data로 related card를 만든다. |

### Collection-by-collection frontmatter support

Legend:

- Yes: 현재 해당 collection의 loader/record code에서 지원한다.
- No: 현재 해당 collection의 loader/record code에서 지원하지 않는다.
- Partial: rendering 또는 type shape 일부에서는 지원하지만, 해당 family의 primary list/records contract는 아니다.

| Collection | Common required fields (`id`, `slug`, `title`, `description`, `heroImageSrc`) | `date` | `author` | `relatedIds` | `hidden` | `redirectUrl` | `hideHeroImageOnDetail` | `hideTocOnDetail` | `gated` | `downloadCta` | `relatedItems` | Collection-specific fields |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Blog | Yes | Yes | Yes | Yes | Yes | Yes | No | Partial | No | No | No | shared publication field 외 별도 field 없음. |
| Whitepapers | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | Yes | Yes | No | `listDescription`, `downloadCoverImageSrc`. |
| News | Yes | Yes | Yes | Yes | Yes | Yes | No | Partial | No | No | No | `sourceLabel`. 생략 시 redirect state에 따라 list label default가 결정된다. |
| Events | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No | No | No | `eventDate`, `eventLabel`. `eventDate`는 존재할 경우 ISO `YYYY-MM-DD`여야 한다. |
| Use cases | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | No | No | shared publication field와 optional hero suppression 외 별도 field 없음. |
| AIP demo | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | No | No | shared publication field와 optional hero suppression 외 별도 field 없음. |
| ACP demo | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | No | No | shared publication field와 optional hero suppression 외 별도 field 없음. |
| Introduction deck | Yes | Optional | No | No | No | No | No | No | Yes | Yes | Yes | resource-family explicit related item objects. |
| Glossary | Yes | Optional | No | No | No | No | No | No | Yes | Yes | Yes | resource-family explicit related item objects. |
| Manuals | Yes | Optional | No | No | No | No | No | No | Yes | Yes | Yes | resource-family explicit related item objects. |

## Loader families and support boundaries

### Standard publication families

Standard publication family는 `createStandardPublicationRecordsRepository`와 보통 `createStandardPublicationPostLoader`를 사용한다.

Families:

- Blog
- News
- Events
- Use cases
- AIP demo
- ACP demo

Functional characteristics:

- MDX file은 `src/content/**` 아래 하나의 collection root에서 scan한다.
- collection이 별도 list behavior를 추가하지 않는 한, record는 numeric `id` descending 순서로 정렬한다.
- `hidden: true`는 item을 list page에서 제거하지만 `getRecord(id)` detail lookup은 유지한다.
- `redirectUrl`은 `resolveRedirectablePublicationHref`를 통해 list href로 resolve된다.
- detail route는 ID lookup과 canonical slug redirect를 사용한다.
- related card는 same-family `relatedIds`를 사용한다.

### Whitepapers

Whitepapers는 standard records repository를 사용하지만 detail rendering은 `createGatedPublicationPostLoader`를 사용한다.

Functional characteristics:

- standard `hidden` / `redirectUrl` record behavior를 지원한다.
- `gated: true`와 `<GatingCut />`를 통한 gated body split을 지원한다.
- structured `downloadCta` frontmatter를 지원한다.
- dedicated PDF/download flow를 위한 `downloadCoverImageSrc`를 지원한다.
- list에서 `description`보다 우선 사용하는 `listDescription`을 지원한다.

### Resource publication families

Resource publication family는 `BaseResourcePublicationRepository`와 `src/lib/resources/**` 아래 route-specific post loader를 사용한다.

Families:

- Introduction deck
- Glossary
- Manuals

Functional characteristics:

- `id`, `slug`, `title`, `description`, `heroImageSrc`, optional `date`, optional `gated`, optional `downloadCta`, optional `relatedItems`를 지원한다.
- shared resource repository는 현재 `hidden`이나 `redirectUrl`을 지원하지 않는다.
- same-family `relatedIds` 대신 explicit `relatedItems` object를 사용한다.
- Manuals는 `src/lib/resources/manual-publications.ts`에서 source-file order를 의도적으로 override한다.

## Legal MDX pages

Legal page는 위 public collection inventory와 의도적으로 분리한다.
`src/lib/legal-mdx-source.ts`를 통해 렌더링하며, 이 renderer는 `next-mdx-remote-client/rsc`와 `parseFrontmatter: true`, legal-document MDX component를 사용한다.
Legal page는 publication/resource collection repository, list item derivation, same-family related items, `hidden`, `redirectUrl`을 사용하지 않는다.

| Legal page | Endpoints | MDX source path | Public image path | Frontmatter support | Loader / route source | Notes |
|---|---|---|---|---|---|---|
| Privacy policy | Latest: `/privacy-policy`<br>Versioned: `/privacy-policy/:slug` | `src/content/privacy-policy/YYYY-MM-DD.mdx` | 현재 사용 없음 | `title`, `description`, `date`, `version` | `src/lib/privacy-policy/records.ts`<br>`src/app/privacy-policy/page.tsx`<br>`src/app/privacy-policy/[slug]/page.tsx` | `slug`는 frontmatter가 아니라 filename에서 파생한다. latest version은 filename sort로 선택한다. Metadata는 MDX frontmatter의 title/description을 사용한다. |
| Terms of service | `/terms-of-service` | `src/app/terms-of-service/content.mdx` | 현재 사용 없음 | `title`, `description`, `date` | `src/app/terms-of-service/page.tsx`<br>`src/lib/legal-mdx-source.ts` | Route-adjacent MDX file. collection/list behavior와 version selector가 없다. |

### Legal frontmatter support compared with collection frontmatter

| Field / feature | Privacy policy | Terms of service | Notes |
|---|---|---|---|
| `title` | Yes | Yes | metadata title과 page heading에 사용한다. |
| `description` | Yes | Yes | metadata description에 사용한다. |
| `date` | Yes | Yes | frontmatter에서 parse하지만, 현재 route는 collection-style card metadata처럼 렌더링하지 않는다. |
| `version` | Yes | No | Privacy policy에서 version selector의 current value로 사용한다. |
| Filename-derived slug | Yes | No | Privacy policy version slug는 `src/content/privacy-policy/YYYY-MM-DD.mdx` filename에서 나온다. |
| `id`, `slug`, `heroImageSrc`, `author`, `relatedIds`, `hidden`, `redirectUrl`, `gated`, `downloadCta`, `relatedItems` | No | No | Legal page는 public collection publication/resource contract를 사용하지 않는다. |
