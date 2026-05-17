# Database Access Controller 렌더링 비교 메모

이 문서는 현재 stage preview route와 QueryPie Japan live reference page 사이의 브라우저 렌더링 차이를 기록합니다. 구현 변경 없이 조사 결과만 정리한 문서입니다.

## 범위

- Stage URL: `https://stage.querypie.ai/t/platforms/acp/database-access-controller`
- Live URL: `https://www.querypie.com/ja/solutions/acp/database-access-controller`
- 로컬 route source: `src/app/t/platforms/acp/database-access-controller/page.tsx`
- 공통 local section source: `src/components/sections/acp/static-page.tsx`
- 수집 시각: `2026-05-17 15:07:03 KST`
- 측정 viewport: desktop `1440 x 900`, mobile `390 x 844`
- stage/live 모두 요청 URL과 최종 렌더링 URL이 일치했습니다.
- 조사 중 local screenshot과 DOM geometry는 `/tmp/render-parity/acp-child-render-diffs/` 아래에 수집했습니다.

## 측정 요약

| Viewport | root font size, stage / live | scroll height, stage / live | section count, stage / live | 첫 h2 크기, stage / live | 첫 h4 크기, stage / live |
| --- | --- | ---: | ---: | --- | --- |
| desktop | `16px / 16px` | `10466 / 11594` | `12 / 27` | `52px / 52px` | `32px / 32px` |
| mobile | `16px / 14px` | `11839 / 10577` | `12 / 27` | `36px / 32px` | `26px / 20px` |

## 발견 사항

### 1. 본문 길이와 section model이 다릅니다

분류: defect candidate / 구현 방향 결정 필요.

근거:
- Desktop scroll height는 stage `10466`, live `11594`입니다.
- Mobile scroll height는 stage `11839`, live `10577`입니다.
- Desktop 기준 stage는 major `main section/article` node를 `12`개 렌더링하지만, live는 `27`개를 노출합니다. live count에는 production page의 중첩 section wrapper도 포함되지만, 시각적으로도 stage에 없는 production FAQ block이 포함되어 있습니다.

해석:
- 현재 preview는 live page를 단순히 pixel만 다르게 복제한 상태가 아니라, local `AcpStaticPageShell`, `AcpFeatureSection`, `AcpWorksSection`, `AcpSplitFeatureSection` primitive로 재구성한 measured rebuild입니다.
- live page에는 final CTA 앞에 FAQ accordion이 추가로 있습니다. stage page는 마지막 feature band에서 바로 CTA/footer로 넘어갑니다.

다음에 확인할 source area:
- route-local section composition: `src/app/t/platforms/acp/database-access-controller/page.tsx`
- reusable ACP static-page primitives: `src/components/sections/acp/static-page.tsx`

### 2. stage에는 마지막 FAQ block이 없습니다

분류: defect candidate.

근거:
- Live desktop에는 document top 약 `9437` 위치에 FAQ block이 있습니다. 질문은 SaaS service 여부, authentication 처리 방식, security standards, 기존 security solutions와의 compatibility에 관한 내용입니다.
- Stage desktop/mobile 렌더링에서는 해당 FAQ section이 `main` body에 나타나지 않았습니다.

해석:
- 이 ACP child page들이 live reference page와 동일한 구조를 목표로 한다면, final CTA 앞에 route-local FAQ section 또는 공통 ACP FAQ primitive를 추가해야 합니다.
- 이는 단순 spacing 문제가 아니라 content/structure parity 문제입니다.

다음에 확인할 source area:
- 모든 ACP child page가 동일한 production FAQ contract를 의도적으로 공유한다면 `src/components/sections/acp/static-page.tsx`에 좁은 shared FAQ primitive를 둘 수 있습니다.
- page별 문구 소유권을 route-local로 유지해야 한다면 `src/app/t/platforms/acp/database-access-controller/page.tsx`에 FAQ content를 직접 두는 방향을 검토합니다.

### 3. mobile typography scale이 다릅니다

분류: defect candidate 또는 root-rem policy 결정 필요.

근거:
- Mobile root font size는 stage `16px`, live `14px`입니다.
- Mobile 첫 h2는 stage `36px`, live `32px`입니다.
- Mobile 첫 h4는 stage `26px`, live `20px`입니다.
- Desktop에서는 h1/h2/h4 크기가 stage/live 사이에서 대체로 일치합니다. 더 큰 시각적 차이는 mobile에서 발생합니다.

해석:
- live site는 mobile에서 `14px` root로 렌더링되고, corp-web-japan은 표준 `16px` root를 유지합니다.
- live computed pixel 값을 그대로 복사하면 안 됩니다. source token intent를 local root 기준으로 보존할지, 최종 visible mobile pixel에 맞출지 먼저 결정해야 합니다.
- 현재 stage mobile의 하위 section heading은 live reference보다 크게 보입니다.

다음에 확인할 source area:
- `src/components/sections/acp/static-page.tsx`의 responsive typography rule.
- pixel 값을 바꾸기 전에 repo-local root-rem parity rule을 적용합니다.

### 4. intro feature area 구조가 live production 처리와 다릅니다

분류: defect candidate / measured-rebuild gap.

근거:
- Stage는 첫 feature section에서 feature card title을 semantic h3로 노출합니다.
- Live는 비슷한 production feature block을 production card wrapper와 다른 nested section structure로 렌더링합니다.
- 이 차이는 how-it-works section 이전의 section count와 vertical rhythm 차이에 영향을 줍니다.

해석:
- stage 구현은 live card section의 direct port가 아니라 local approximation입니다.
- 개별 margin을 조정하기 전에 card wrapper, icon size, card padding, heading/body typography를 live card contract와 비교해야 합니다.

다음에 확인할 source area:
- `src/components/sections/acp/static-page.tsx`의 `AcpFeatureGrid`, `AcpFeatureCard`.

### 5. feature-band rhythm이 production과 다릅니다

분류: defect candidate.

근거:
- Stage와 live 모두 intro section 이후 screenshot/text feature band를 교차 배치합니다.
- 하지만 초반 intro block 이후 measured section top/height sequence가 달라집니다. 예를 들어 desktop에서 stage final CTA는 document top 약 `9477`에 도달하고, live final CTA는 FAQ block까지 포함한 뒤 document top 약 `10314`에 도달합니다.
- Stage feature sections는 `AcpSplitFeatureSection`을 통해 local gray/white band를 교차 적용합니다. Live는 production page 고유의 nested wrapper와 spacing rhythm을 사용합니다.

해석:
- local measured-rebuild 전략 때문에 일부 차이는 예상 가능하지만, 전체 rhythm은 아직 production-equivalent라고 보기 어렵습니다.
- 한 route file에만 margin을 직접 추가하기보다 `src/components/sections/acp/static-page.tsx`의 ACP static-page primitive 수준에서 조정하는 편이 안전합니다. 단, 특정 page에만 고유 content constraint가 있다면 route-local 예외를 별도로 판단해야 합니다.

다음에 확인할 source area:
- `src/components/sections/acp/static-page.tsx`의 `AcpSplitFeatureSection`, `AcpWorksSection`, final CTA spacing.

## 현재 결론

Stage page는 핵심 DAC story를 보여줄 만큼 content는 갖추고 있지만, live production page와 render-identical한 상태는 아닙니다. 가장 actionable한 차이는 다음입니다.

1. live FAQ block을 추가할지, 또는 의도적으로 생략할지 결정해야 합니다.
2. mobile root-rem / typography contract를 결정해야 합니다.
3. 작은 spacing tweak 전에 intro feature-card와 split-feature wrapper contract를 먼저 비교해야 합니다.
4. live에는 cookie/language UI가 나타날 수 있고 stage는 corp-web-japan header/footer를 쓰므로, chrome 차이와 page-body parity를 분리해서 봐야 합니다.
