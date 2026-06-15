import type { Metadata } from "next";
import { As400CobolCtaAction } from "@/components/sections/as400-cobol/cta-action";
import { As400CobolHeroVisual } from "@/components/sections/as400-cobol/hero-visual";
import {
  As400CobolMigrationFlow,
  As400CobolMigrationStep,
  As400CobolPanel,
  As400CobolPanelGrid,
} from "@/components/sections/as400-cobol/migration-flow";
import {
  As400CobolBodyCopy,
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
import { As400CobolSection } from "@/components/sections/as400-cobol/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const contactHref = "/contact-us";
const heroImageSrc = "/services/as400-cobol/hero-modernization-flow.png";
const heroImageAlt =
  "AS/400과 COBOL 자산을 분석하고 Java, API, 클라우드 환경으로 단계적으로 이전하는 현대화의 흐름";

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
    "IBM i（AS/400）현대화 | AS400 / COBOL 마이그레이션 | QueryPie AI",
  description:
    "QueryPie AI는 IBM i（AS/400）상의 COBOL/RPG 자산을 분석하고, 설계서・테스트 케이스 생성부터 Java/API/Cloud 이전, DB2 / Oracle 분석, PostgreSQL 이전까지 단계적으로 지원합니다.",
  alternates: {
    canonical: "/services/as400-cobol?lang=ko",
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
            <As400CobolHeroEyebrow>IBM i Modernization</As400CobolHeroEyebrow>
            <As400CobolHeroTitle>
              IBM i（AS/400）
              <br />
              현대화
            </As400CobolHeroTitle>
            <As400CobolHeroSubtitle>
              AS400 / COBOL 마이그레이션을 현황 분석부터
              Java/API/Cloud 이전, 운영 안정화까지 지원
            </As400CobolHeroSubtitle>
            <As400CobolHeroDescription>
              QueryPie AI는 COBOL/RPG 자산의 분석・가시화,
              설계서・테스트 케이스 생성, DB2 / Oracle 분석,
              PostgreSQL 이전, Linux / OCI / AWS 환경으로의 이전까지
              단계적으로 지원합니다.
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
        eyebrow="Market Background"
        title="1만 개사 규모의 IBM i 시장과 확대되는 현대화 수요"
        lead="일본의 IBM i（AS/400） 고객은 보수적으로 약 1만 개사, 넓게는 1만5,000~2만 개사 규모로 추정됩니다. IDC는 일본 IT 모더나이제이션 서비스 시장을 2025년 1조 3,044억 엔, 2030년 2조 1,234억 엔으로 전망합니다."
      >
        <As400CobolBodyCopy componentName="As400CobolMarketBackgroundCopy">
          <p>
            IBM i（AS/400）는 제조, 유통, 물류, 상사, 도매 업무에서
            오랫동안 사용되어 온 기간계 업무 플랫폼입니다. 시장 추정상
            IBM i 사용자의 85~92%가 RPG 자산을 보유한 것으로 보이며,
            RPG 이용 고객은 1만~1만4,000개사 정도가 현실적인 대상입니다.
          </p>
          <p>
            COBOL의 경우 IBM i 위에서의 사용률은 15~16% 정도로 보이며,
            IBM i상의 COBOL 이용 고객은 1,500~3,200개사 규모로 추정됩니다.
            한편 메인프레임과 오픈계까지 포함한 일본 COBOL 이용 고객은
            4,000~8,000개사 규모로 볼 수 있으며, 금융・보험・공공・대형 제조를
            중심으로 지금도 기간계 업무를 지탱하고 있습니다.
          </p>
          <p>
            이 시장 규모가 보여주는 것은 단순한 서버 교체 수요가 아니라
            업무 로직, 데이터 구조, 잡, 장표, 주변 시스템 연계를 다시 이해해야
            하는 수요입니다. 유지보수 인력 부족, 개인에게 의존된 사양,
            클라우드・API 활용 지연을 해결하려면 현행 자산을 AI로 가시화하고
            단계적으로 이전 범위를 판단하는 접근이 필요합니다.
          </p>
        </As400CobolBodyCopy>
      </As400CobolSection>

      <As400CobolSection
        id="service-scope"
        componentName="As400CobolServiceScopeSection"
        eyebrow="Service Scope"
        title="진단, PoC, 변환, 구현, 운영 안정화까지 일관되게 지원"
        lead="AS/400과 COBOL/RPG뿐 아니라 DB, 인프라, 주변 시스템 연계까지 포함한 현실적인 이전 계획을 설계합니다."
      >
        <As400CobolPanelGrid componentName="As400CobolServiceScopeGrid">
          <As400CobolPanel
            componentName="As400CobolAssessmentPanel"
            eyebrow="Assessment"
            title="현황 진단"
            body="IBM i（AS/400）상의 애플리케이션, COBOL/RPG 자산, DB2 / Oracle, 주변 시스템 연계를 정리하고 이전 우선순위와 리스크를 명확히 합니다."
          />
          <As400CobolPanel
            componentName="As400CobolPocPanel"
            eyebrow="PoC"
            title="PoC와 이전 설계"
            body="변환 대상, 테스트 범위, 데이터 이전, 클라우드・온프레미스 구성을 작게 검증하고 단계적 로드맵으로 구체화합니다."
          />
          <As400CobolPanel
            componentName="As400CobolMigrationPanel"
            eyebrow="Migration"
            title="변환・구현"
            body="COBOL/RPG 자산 분석, 설계서・테스트 케이스 생성, Java/API/Cloud 이전, PostgreSQL 이전을 구현 단계까지 지원합니다."
          />
          <As400CobolPanel
            componentName="As400CobolInfrastructurePanel"
            eyebrow="Infrastructure"
            title="Linux / OCI / AWS 이전"
            body="기존 인프라의 제약을 고려해 Linux, OCI, AWS 환경으로의 이전, 운영 설계, 모니터링・권한・접속 방식 정리까지 대응합니다."
          />
          <As400CobolPanel
            componentName="As400CobolStabilizationPanel"
            eyebrow="Stabilization"
            title="테스트와 운영 안정화"
            body="업무 영향을 줄이기 위한 테스트, 병행 가동, 성능・장애 대응, 이전 후 개선 운영까지 지속적으로 함께합니다."
          />
          <As400CobolPanel
            componentName="As400CobolConsultingPanel"
            eyebrow="Consulting"
            title="AI 활용 자산 가시화"
            body="개인에게 의존된 사양과 방대한 기존 코드를 AI 분석・정리의 대상으로 삼아 이전 판단에 필요한 정보로 전환합니다."
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolSection
        muted
        componentName="As400CobolMigrationFlowSection"
        eyebrow="Migration Flow"
        title="단계적 Migration으로 업무 영향을 줄이며 쇄신합니다"
        lead="현황 진단부터 자산 분석, PoC, 변환・구현, 테스트, 운영 안정화까지 이전 판단과 구현을 같은 흐름으로 진행합니다."
      >
        <As400CobolMigrationFlow>
          <As400CobolMigrationStep
            componentName="As400CobolAssessmentStep"
            stepNumber="01"
            icon="assessment"
            title="현황 진단"
            body="AS/400, COBOL/RPG, DB, 주변 연계를 목록화합니다."
          />
          <As400CobolMigrationStep
            componentName="As400CobolAnalysisStep"
            stepNumber="02"
            icon="analysis"
            title="자산 분석"
            body="사양, 의존 관계, 데이터 구조, 이전 난이도를 가시화합니다."
          />
          <As400CobolMigrationStep
            componentName="As400CobolPocStep"
            stepNumber="03"
            icon="poc"
            title="PoC"
            body="대상 범위를 좁혀 변환・테스트・운영 방식을 검증합니다."
          />
          <As400CobolMigrationStep
            componentName="As400CobolImplementationStep"
            stepNumber="04"
            icon="migration"
            title="변환・구현"
            body="Java/API/Cloud 이전과 PostgreSQL 이전을 단계적으로 진행합니다."
          />
          <As400CobolMigrationStep
            componentName="As400CobolTestingStep"
            stepNumber="05"
            icon="test"
            title="테스트"
            body="업무 로직, 데이터 정합성, 성능, 연계를 확인합니다."
          />
          <As400CobolMigrationStep
            componentName="As400CobolStabilizationStep"
            stepNumber="06"
            icon="stabilization"
            title="운영 안정화"
            body="병행 가동, 모니터링, 개선 운영까지 지속적으로 지원합니다."
            hasConnector={false}
          />
        </As400CobolMigrationFlow>
      </As400CobolSection>

      <As400CobolSection
        componentName="As400CobolScenarioSection"
        eyebrow="Scenario"
        title="업무 시나리오에서 실행 가능한 이전 계획으로"
        lead="수발주, 재고, 청구, 배치, 장표, 외부 연계 같은 실제 운영 단위에 맞춰 AS/400, COBOL/RPG, DB2 / Oracle, PostgreSQL, Java, API, Cloud로의 이전 범위와 순서를 정리합니다."
      >
        <As400CobolPanelGrid componentName="As400CobolScenarioGrid">
          <As400CobolPanel
            componentName="As400CobolAssetVisibilityScenario"
            title="현행 업무와 기술 자산 목록화"
            body="수발주, 재고, 청구, 급여 같은 업무 단위로 COBOL/RPG 프로그램, 잡, 장표, DB2 / Oracle 테이블, 파일 연계를 정리합니다."
          />
          <As400CobolPanel
            componentName="As400CobolPhasedMigrationScenario"
            title="이전 대상과 유지 영역 분리"
            body="Java화, API화, PostgreSQL 이전, Cloud 이전으로 진행할 영역과 당분간 IBM i에 남길 영역을 나누고, 영향도와 업무 우선순위에 따라 이전 순서를 정합니다."
          />
          <As400CobolPanel
            componentName="As400CobolStabilizationScenario"
            title="PoC부터 운영 전환까지 실행 계획화"
            body="일부 업무에서 변환 정확도, 데이터 정합성, 성능, 주변 연계를 검증하고, 테스트 케이스, 병행 가동, 전환 복구, 운영 인수인계까지 계획에 반영합니다."
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolContactSection>
        <As400CobolContactEyebrow>Contact</As400CobolContactEyebrow>
        <As400CobolContactTitle>
          AS/400・COBOL 현대화를 상담하기
        </As400CobolContactTitle>
        <As400CobolContactDescription>
          기존 자산 목록화부터 PoC, 변환, 구현, 운영 안정화까지
          현재 상황에 맞는 단계적 진행 방식을 정리합니다.
        </As400CobolContactDescription>
        <As400CobolContactActions>
          <As400CobolCtaAction href={contactHref}>상담하기</As400CobolCtaAction>
        </As400CobolContactActions>
      </As400CobolContactSection>
    </As400CobolPageShell>
  );
}
