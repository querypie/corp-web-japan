import type { Metadata } from "next";
import {
  As400CobolArchitectureBand,
  As400CobolBodyText,
  As400CobolDiagramArrow,
  As400CobolDiagramRail,
  As400CobolDiagramStage,
  As400CobolInsightItem,
  As400CobolInsightList,
  As400CobolMiniList,
  As400CobolMiniListItem,
  As400CobolPathCard,
  As400CobolPathGrid,
  As400CobolStatCard,
  As400CobolStatGrid,
  As400CobolTextColumns,
} from "@/components/sections/as400-cobol/diagrams";
import { As400CobolCtaAction } from "@/components/sections/as400-cobol/cta-action";
import { As400CobolHeroVisual } from "@/components/sections/as400-cobol/hero-visual";
import {
  As400CobolPanel,
  As400CobolPanelGrid,
} from "@/components/sections/as400-cobol/migration-flow";
import {
  As400CobolContactActions,
  As400CobolContactDescription,
  As400CobolContactEyebrow,
  As400CobolContactSection,
  As400CobolContactTitle,
  As400CobolHeroActions,
  As400CobolHeroCopy,
  As400CobolHeroDescription,
  As400CobolHeroEyebrow,
  As400CobolHeroSection,
  As400CobolHeroSubtitle,
  As400CobolHeroTitle,
  As400CobolPageShell,
} from "@/components/sections/as400-cobol/page-sections";
import {
  As400CobolReferenceLink,
  As400CobolSection,
} from "@/components/sections/as400-cobol/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const contactHref = "/contact-us";
const heroImageSrc = "/solutions/as400-cobol/hero-modernization-flow.png";
const heroImageAlt =
  "AS/400과 COBOL 자산을 분석하고 Java, API, 클라우드 환경으로 단계적으로 이전하는 모더나이제이션 흐름";

const heroLabels = [
  {
    label: "AS/400・COBOL 자산",
    description: "오랫동안 운영되어 온 기간계 시스템을 가시화",
  },
  {
    label: "분석・설계・테스트",
    description: "AI를 활용해 설계서와 테스트 케이스를 생성",
  },
  {
    label: "Java / API / Cloud 이전",
    description: "단계적 변환과 운영 안정화까지 지원",
  },
];

export const as400CobolKoreanMetadata: Metadata = {
  title:
    "IBM i（AS/400）모더나이제이션 | AS400 / COBOL 마이그레이션 | QueryPie AI",
  description:
    "QueryPie AI는 IBM i（AS/400）상의 COBOL/RPG 자산을 분석하고, 설계서・테스트 케이스 생성부터 Java/API/Cloud 이전, DB2 / Oracle 분석, PostgreSQL 이전까지 단계적으로 지원합니다.",
  alternates: {
    canonical: "/solutions/as400-cobol?lang=ko",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function As400CobolKoreanPage() {
  return (
    <As400CobolPageShell debugProps={componentNameDebugProps("As400CobolKoreanPage")}>
      <As400CobolHeroSection
        visual={
          <RevealOnScroll delayMs={120} className="w-full" variant="scale">
            <As400CobolHeroVisual
              imageSrc={heroImageSrc}
              imageAlt={heroImageAlt}
              labels={heroLabels}
            />
          </RevealOnScroll>
        }
      >
        <RevealOnScroll>
          <As400CobolHeroCopy>
            <As400CobolHeroEyebrow>IBM i 모더나이제이션</As400CobolHeroEyebrow>
            <As400CobolHeroTitle>
              IBM i（AS/400）
              <br />
              모더나이제이션
            </As400CobolHeroTitle>
            <As400CobolHeroSubtitle>
              AS400 / COBOL 마이그레이션을 현황 분석부터
              Java/API/클라우드 이전, 운영 안정화까지 지원
            </As400CobolHeroSubtitle>
            <As400CobolHeroDescription>
              QueryPie AI는 COBOL/RPG 자산의 분석・가시화,
              설계서・테스트 케이스 생성, DB2 / Oracle 분석,
              PostgreSQL 이전, Linux / OCI / AWS 환경으로의 이전까지,
              기존 업무를 멈추지 않는 단계적 쇄신을 지원합니다.
            </As400CobolHeroDescription>
            <As400CobolHeroActions>
              <As400CobolCtaAction href={contactHref}>상담하기</As400CobolCtaAction>
            </As400CobolHeroActions>
          </As400CobolHeroCopy>
        </RevealOnScroll>
      </As400CobolHeroSection>

      <As400CobolSection
        muted
        componentName="As400CobolMarketBackgroundSection"
        eyebrow="시장 배경"
        title={
          <>
            AS/400과 COBOL 자산은,
            <br />
            지금도 기간계 시스템의 중요한 주제입니다
          </>
        }
        lead={
          <>
            AS/400（현재의 IBM i）는 IBM Power에서 동작하는 통합형 기간계 업무 플랫폼입니다.
            <br />
            RPG, COBOL, CL, Db2 for i, 잡, 장표, 5250 화면 등이 업무와 깊게 결합되어 있기 때문에,
            <br />
            단순한 서버 교체가 아니라, 업무 로직을 이해한 뒤의 단계적 모더나이제이션이 필요합니다.
          </>
        }
      >
        <div className="space-y-8">
          <As400CobolStatGrid>
            <As400CobolStatCard
              value="국내 약 2만 개사"
              label="일본 내 IBM i 이용 기업"
              description={
                <>
                  일본 IBM 관계자 공개 자료에서는 세계 약 15만 개사, 일본 국내 약 2만 개사에서 사용된다고 설명합니다.
                  <As400CobolReferenceLink
                    href="https://community.ibm.com/community/user/blogs/hirotsugu-hara/2024/09/03/ibm-i-developer-task-blog"
                    ariaLabel="IBM Community Japan 2024 참고"
                  >
                    (참고)
                  </As400CobolReferenceLink>
                </>
              }
            />
            <As400CobolStatCard
              value="약 70%"
              label="핵심 업무 과반을 IBM i에서 운영"
              description={
                <>
                  Fortra의 2026년 조사에서는 IBM i 이용 기업의 약 70%가 핵심 업무 애플리케이션 절반 이상을 IBM i에서 운영한다고 설명합니다.
                  <As400CobolReferenceLink
                    href="https://power.fortra.com/resources/guides/outlook-ibm-i-2026-ibm-i-marketplace-survey-results"
                    ariaLabel="Fortra 2026 IBM i Marketplace Survey 참고"
                  >
                    (참고)
                  </As400CobolReferenceLink>
                </>
              }
            />
            <As400CobolStatCard
              value="최대 12조 엔/년"
              label="2025년 이후 경제 손실 리스크"
              description={
                <>
                  경제산업성 DX Report가 제시한 레거시 시스템 복잡화와 블랙박스화에 대한 경고입니다.
                  <As400CobolReferenceLink
                    href="https://www.meti.go.jp/policy/it_policy/dx/20180907_02.pdf"
                    ariaLabel="경제산업성 DX Report 본문 참고"
                  >
                    (참고)
                  </As400CobolReferenceLink>
                </>
              }
            />
            <As400CobolStatCard
              value="1조 3,044억 엔"
              label="2025년 IT 모더나이제이션 시장"
              description={
                <>
                  IDC의 일본 IT 모더나이제이션 서비스 시장 전망을 전체 시장 배경으로 다룹니다.
                  <As400CobolReferenceLink
                    href="https://www.idc.com/resource-center/press-releases/%E5%9B%BD%E5%86%85it%E3%83%A2%E3%83%80%E3%83%8A%E3%82%A4%E3%82%BC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E5%B8%82%E5%A0%B4%E4%BA%88%E6%B8%AC%E3%82%92%E7%99%BA%E8%A1%A8/"
                    ariaLabel="IDC Japan 2026 참고"
                  >
                    (참고)
                  </As400CobolReferenceLink>
                </>
              }
            />
          </As400CobolStatGrid>

          <As400CobolTextColumns>
            <As400CobolBodyText>
              <p>
                일본 기업에 남아 있는 IBM i（AS/400）와 COBOL/RPG 기간계 시스템은
                오래되었기 때문에 남아 있는 것이 아닙니다. 수발주, 재고, 회계, 결제,
                급여, 고객 관리처럼 멈출 수 없는 업무를 오랫동안 안정적으로
                지탱해 왔기 때문에 쉽게 교체할 수 없는 자산이 되었습니다.
              </p>
              <p>
                한편 오랜 기간의 수정으로 사양이 개인에게 의존하고, 프로그램, 테이블,
                잡, 장표, 외부 연계의 관계가 보이지 않게 되면 수정이나 이전의
                영향 범위를 판단하기 어려워집니다. 경제산업성의 DX 리포트가
                지적한 “2025년의 절벽” 역시 레거시 시스템의 복잡화와
                블랙박스화를 방치할 때의 리스크를 생각하는 중요한 맥락입니다.
              </p>
            </As400CobolBodyText>
            <As400CobolInsightList>
              <As400CobolInsightItem icon="host" title="IBM i는 통합형 플랫폼">
                OS, Db2 for i, 잡 관리, 보안, 5250 화면, RPG/COBOL/CL이
                하나로 운영되기 때문에 Linux 이전이나 DB 이전만으로는
                전체상을 설명할 수 없습니다.
              </As400CobolInsightItem>
              <As400CobolInsightItem icon="database" title="데이터와 업무 로직이 가깝다">
                Db2 for i, DB2 / Oracle, 장표, 배치, 주변 시스템 연계까지 포함해
                어떤 업무가 어떤 자산에 의존하는지 정리해야 합니다.
              </As400CobolInsightItem>
              <As400CobolInsightItem icon="brain" title="AI 분석의 진입점이 명확하다">
                코드 설명, 사양서 생성, 의존 관계 정리, 영향도 분석, 테스트 범위 추출은
                단계적인 이전 판단의 전제가 됩니다.
              </As400CobolInsightItem>
            </As400CobolInsightList>
          </As400CobolTextColumns>
        </div>
      </As400CobolSection>

      <As400CobolSection
        componentName="As400CobolWhyModernizeSection"
        eyebrow="쇄신이 필요한 이유"
        title={
          <>왜 지금 AS400 / COBOL 모더나이제이션이 필요한가</>
        }
        lead={
          <>
            과제는 시스템이 동작하지 않는다는 것이 아닙니다. 안정적으로 동작하기 때문에 바꾸는 판단이 늦어지고,
            <br />
            유지보수 인력, 비용, 사양의 블랙박스화, DX 시책과의 연결이 동시에 어려워진다는 점입니다.
            <As400CobolReferenceLink
              href="https://www.ipa.go.jp/digital/chousa/dx-trend/dx-trend-2025.html"
              ariaLabel="IPA DX動向2025 참고"
            >
              (참고)
            </As400CobolReferenceLink>
          </>
        }
      >
        <div className="space-y-8">
          <As400CobolInsightList>
            <As400CobolInsightItem icon="legacy" title="“동작하니까 건드리지 않는다”의 한계">
              오랫동안 가동된 기간계 시스템은 업무에 깊이 내장되어 있습니다.
              그러나 담당자의 퇴직, 벤더 의존, 수정 이력의 축적이 진행될수록
              건드리지 않는 판단 자체가 미래의 리스크가 됩니다.
              <As400CobolReferenceLink
                href="https://techtarget.itmedia.co.jp/tt/news/2407/16/news04.html"
                ariaLabel="TechTarget Japan 2024 참고"
              >
                (참고)
              </As400CobolReferenceLink>
            </As400CobolInsightItem>
            <As400CobolInsightItem icon="route" title="영향 범위를 몰라 수정 판단이 늦어진다">
              하나의 화면이나 장표 변경이라도 프로그램, 파일, 잡, 외부 연계,
              테스트 범위가 연쇄됩니다. 보이지 않는 의존 관계를 가시화하지 않으면
              작은 수정도 큰 리스크가 됩니다.
            </As400CobolInsightItem>
            <As400CobolInsightItem icon="api" title="클라우드, API, 데이터 활용으로 이어지기 어렵다">
              기존 IBM i를 남겨 둔 채 API로 외부화할지, Java화할지,
              PostgreSQL이나 Linux / OCI / AWS로 옮길지. 선택지를 비교하려면
              현행 자산의 구조 이해가 필요합니다.
              <As400CobolReferenceLink
                href="https://prtimes.jp/main/html/rd/p/000001509.000011650.html"
                ariaLabel="TIS 발표 2024 참고"
              >
                (참고)
              </As400CobolReferenceLink>
            </As400CobolInsightItem>
          </As400CobolInsightList>
        </div>
      </As400CobolSection>

      <As400CobolSection
        muted
        componentName="As400CobolAiApproachSection"
        eyebrow="AI 활용"
        title={
          <>
            전면 재개발이 아니라,
            <br />
            먼저 AI로 현행 시스템을 이해합니다
          </>
        }
        lead={
          <>
            QueryPie AI는 기존 자산을 단순히 대체하는 것이 아니라,
            <br />
            코드, DB, 잡, 장표, 외부 연계를 읽어내고 이전 판단에 필요한 정보로 변환합니다.
          </>
        }
      >
        <As400CobolDiagramRail>
          <As400CobolDiagramStage icon="source" eyebrow="입력 정보" title="기존 자산을 모읍니다">
            <As400CobolMiniList>
              <As400CobolMiniListItem>COBOL / RPG / CL 프로그램</As400CobolMiniListItem>
              <As400CobolMiniListItem>Db2 for i, DB2 / Oracle, 파일 정의</As400CobolMiniListItem>
              <As400CobolMiniListItem>잡, 장표, 화면, 외부 연계</As400CobolMiniListItem>
            </As400CobolMiniList>
          </As400CobolDiagramStage>
          <As400CobolDiagramArrow />
          <As400CobolDiagramStage icon="analysis" eyebrow="분석" title="AI로 구조화합니다">
            <As400CobolMiniList>
              <As400CobolMiniListItem>업무 로직과 처리 흐름 설명</As400CobolMiniListItem>
              <As400CobolMiniListItem>테이블, 프로그램, 배치의 의존 관계 정리</As400CobolMiniListItem>
              <As400CobolMiniListItem>수정・이전 시의 영향도 분석</As400CobolMiniListItem>
            </As400CobolMiniList>
          </As400CobolDiagramStage>
          <As400CobolDiagramArrow />
          <As400CobolDiagramStage icon="book" eyebrow="출력" title="판단 자료로 전환합니다">
            <As400CobolMiniList>
              <As400CobolMiniListItem>현행 사양서, 데이터 모델, 이전 대상 분류</As400CobolMiniListItem>
              <As400CobolMiniListItem>테스트 케이스, 테스트 범위, 우선순위</As400CobolMiniListItem>
              <As400CobolMiniListItem>PoC 계획, 이전 로드맵, 구현 방침</As400CobolMiniListItem>
            </As400CobolMiniList>
          </As400CobolDiagramStage>
        </As400CobolDiagramRail>
      </As400CobolSection>

      <As400CobolSection
        componentName="As400CobolDeliverablesSection"
        eyebrow="산출물"
        title={
          <>
            설계서, 영향도, 테스트 케이스까지
            <br />
            이전 판단에 필요한 산출물을 갖춥니다
          </>
        }
        lead={
          <>
            AI 분석의 목적은 단순히 코드를 설명하는 것이 아닙니다.
            <br />
            현행 업무를 멈추지 않고 어디서부터 착수할지, 무엇을 남기고 무엇을 옮길지 판단할 수 있는 상태를 만드는 것입니다.
          </>
        }
      >
        <As400CobolPanelGrid componentName="As400CobolDeliverablesGrid">
          <As400CobolPanel
            componentName="As400CobolSpecificationPanel"
            eyebrow="사양서"
            title="현행 사양서 생성"
            body="COBOL/RPG 프로그램의 처리 내용, 입력, 출력, 예외 처리, 업무 규칙을 읽어내어 담당자가 확인할 수 있는 현행 사양으로 정리합니다."
          />
          <As400CobolPanel
            componentName="As400CobolDependencyPanel"
            eyebrow="의존 관계"
            title="의존 관계와 영향도 정리"
            body="프로그램, 테이블, 잡, 장표, 외부 연계의 관계를 가시화하고, 수정이나 이전 시 영향을 받는 범위를 확인합니다."
          />
          <As400CobolPanel
            componentName="As400CobolDataModelPanel"
            eyebrow="데이터 모델"
            title="DB・데이터 모델 분석"
            body="Db2 for i, DB2 / Oracle, 파일 정의, 데이터 항목의 관계를 정리해 PostgreSQL 이전이나 API화의 전제를 만듭니다."
          />
          <As400CobolPanel
            componentName="As400CobolTestCasePanel"
            eyebrow="테스트"
            title="테스트 케이스 생성"
            body="업무 로직과 데이터 정합성을 확인하기 위한 테스트 관점, 정상계・예외계, 이전 후 비교 검증 범위를 정리합니다."
          />
          <As400CobolPanel
            componentName="As400CobolRoadmapPanel"
            eyebrow="로드맵"
            title="이전 대상 분류"
            body="남길 기능, 외부화할 기능, Java화할 기능, DB 이전이 필요한 영역을 나누고 PoC와 단계적 이전의 우선순위를 만듭니다."
          />
          <As400CobolPanel
            componentName="As400CobolKnowledgePanel"
            eyebrow="지식 계승"
            title="업무 지식 검색・계승"
            body="개인에게 의존된 사양이나 숙련 담당자의 지식을 검색・확인하기 쉬운 형태로 변환해 새로운 담당자의 온보딩을 지원합니다."
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolSection
        muted
        componentName="As400CobolMigrationArchitectureSection"
        eyebrow="이전 설계"
        title={
          <>
            Java / PostgreSQL / Linux / Cloud로,
            <br />
            상황에 맞는 이전 루트를 설계합니다
          </>
        }
        lead={
          <>
            처음부터 전체를 바꾸는 것이 아니라, 기존 IBM i를 남기는 선택지도 포함해,
            <br />
            API화, Java화, 데이터 이전, 클라우드 이전을 단계적으로 조합합니다.
          </>
        }
      >
        <div className="space-y-8">
          <As400CobolArchitectureBand>
            <As400CobolDiagramStage icon="host" eyebrow="현행" title="IBM i（AS/400）">
              <As400CobolMiniList>
                <As400CobolMiniListItem>RPG / COBOL / CL</As400CobolMiniListItem>
                <As400CobolMiniListItem>Db2 for i, DB2 / Oracle</As400CobolMiniListItem>
                <As400CobolMiniListItem>5250 화면, 잡, 장표</As400CobolMiniListItem>
              </As400CobolMiniList>
            </As400CobolDiagramStage>
            <As400CobolDiagramArrow />
            <As400CobolDiagramStage icon="brain" eyebrow="가교" title="AI 분석과 PoC">
              <As400CobolMiniList>
                <As400CobolMiniListItem>업무 영향과 이전 난이도 평가</As400CobolMiniListItem>
                <As400CobolMiniListItem>변환 정밀도와 테스트 가능성 검증</As400CobolMiniListItem>
                <As400CobolMiniListItem>우선순위와 구현 단위 결정</As400CobolMiniListItem>
              </As400CobolMiniList>
            </As400CobolDiagramStage>
            <As400CobolDiagramArrow />
            <As400CobolDiagramStage icon="cloud" eyebrow="이전 대상" title="차세대 아키텍처">
              <As400CobolMiniList>
                <As400CobolMiniListItem>Java / API / 클라우드</As400CobolMiniListItem>
                <As400CobolMiniListItem>PostgreSQL / Linux</As400CobolMiniListItem>
                <As400CobolMiniListItem>OCI / AWS / 온프레미스 병용</As400CobolMiniListItem>
              </As400CobolMiniList>
            </As400CobolDiagramStage>
          </As400CobolArchitectureBand>

          <As400CobolPathGrid>
            <As400CobolPathCard icon="api" title="API로 외부화">
              기존 IBM i를 바로 교체하지 않고 필요한 기능부터 API로 외부 시스템과 연결합니다.
            </As400CobolPathCard>
            <As400CobolPathCard icon="code" title="COBOL/RPG에서 Java로">
              변환 대상을 좁히고 PoC로 정밀도, 예외 처리, 테스트 가능성을 확인하며 진행합니다.
              <As400CobolReferenceLink
                href="https://it.impress.co.jp/articles/-/26675"
                ariaLabel="LAC MAJALIS Modernization Service IT Leaders 2024 참고"
              >
                (참고)
              </As400CobolReferenceLink>
            </As400CobolPathCard>
            <As400CobolPathCard icon="database" title="PostgreSQL로 데이터 이전">
              테이블, 파일, 데이터 항목, 정합성 체크를 정리하고 단계적으로 이전합니다.
            </As400CobolPathCard>
            <As400CobolPathCard icon="cloud" title="Linux / OCI / AWS로 전개">
              운영, 모니터링, 권한, 접속 방식을 포함해 이전 후에도 계속 쓸 수 있는 기반을 설계합니다.
            </As400CobolPathCard>
          </As400CobolPathGrid>
        </div>
      </As400CobolSection>

      <As400CobolSection
        id="service-scope"
        componentName="As400CobolServiceScopeSection"
        eyebrow="서비스 범위"
        title={
          <>
            현행 이해부터 단계적 이전까지
            <br />
            하나의 서비스 흐름으로 지원
          </>
        }
        lead={
          <>
            수발주, 재고, 청구, 배치, 장표, 외부 연계 같은 업무 단위에 맞춰 현행 자산을 이해하고,
            <br />
            AI 분석, PoC, 이전 설계, 구현, 병행 가동, 운영 안정화까지 연결합니다.
          </>
        }
      >
        <As400CobolPanelGrid componentName="As400CobolServiceScopeGrid">
          <As400CobolPanel
            componentName="As400CobolAssessmentPanel"
            eyebrow="01 현황 파악"
            title="현행 업무와 기술 자산 목록화"
            body="수발주, 재고, 청구, 급여 같은 업무 단위로 COBOL/RPG 프로그램, DB2 / Oracle, 잡, 장표, 파일 연계를 정리하고 이전의 전체상을 파악합니다."
          />
          <As400CobolPanel
            componentName="As400CobolPocPanel"
            eyebrow="02 분석"
            title="AI 분석과 영향도 정리"
            body="코드 구조, 업무 로직, 데이터 모델, 의존 관계, 개보수 시 영향 범위를 AI로 정리하고, 사양서, 데이터 모델, 테스트 관점으로 확인 가능한 상태를 만듭니다."
          />
          <As400CobolPanel
            componentName="As400CobolMigrationPanel"
            eyebrow="03 계획"
            title="이전 대상과 유지 영역 분리"
            body="Java화, API화, PostgreSQL 이전, 클라우드 이전으로 진행할 영역과 당분간 IBM i에 남길 영역을 나누고, 업무 영향과 우선순위에 따라 단계적 로드맵을 만듭니다."
          />
          <As400CobolPanel
            componentName="As400CobolInfrastructurePanel"
            eyebrow="04 검증"
            title="작게 검증하는 PoC"
            body="재고 조회, 거래처 마스터, 청구 상태처럼 업무 영향을 줄이기 쉬운 범위부터 변환 정확도, 데이터 정합성, API 연계, 이전 후 운영 이미지를 검증합니다."
          />
          <As400CobolPanel
            componentName="As400CobolStabilizationPanel"
            eyebrow="05 구현"
            title="변환・구현과 기반 이전"
            body="PoC에서 확인한 범위부터 COBOL/RPG의 Java화, API화, PostgreSQL 이전, Linux / OCI / AWS 환경 전개, 주변 시스템 연계를 진행합니다."
          />
          <As400CobolPanel
            componentName="As400CobolConsultingPanel"
            eyebrow="06 안정화"
            title="테스트, 병행 가동, 운영 안정화"
            body="신구 시스템 대조 테스트, 성능 확인, 병행 가동, 전환 복구, 모니터링, 장애 대응, 운영 문서 정비까지 현장이 계속 사용할 수 있는 상태를 목표로 합니다."
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolContactSection>
        <As400CobolContactEyebrow>문의</As400CobolContactEyebrow>
        <As400CobolContactTitle>
          AS/400・COBOL 모더나이제이션을 상담하기
        </As400CobolContactTitle>
        <As400CobolContactDescription>
          기존 자산의 목록화부터 PoC, 변환, 구현, 운영 안정화까지,
          현재 상황에 맞춰 단계적인 진행 방식을 정리합니다.
        </As400CobolContactDescription>
        <As400CobolContactActions>
          <As400CobolCtaAction href={contactHref}>상담하기</As400CobolCtaAction>
        </As400CobolContactActions>
      </As400CobolContactSection>
    </As400CobolPageShell>
  );
}
