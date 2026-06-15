import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { As400CobolCtaAction } from "@/components/sections/as400-cobol/cta-action";
import { As400CobolHeroVisual } from "@/components/sections/as400-cobol/hero-visual";
import {
  As400CobolMigrationFlow,
  As400CobolPanel,
  As400CobolPanelGrid,
} from "@/components/sections/as400-cobol/migration-flow";
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

const serviceScopes = [
  {
    eyebrow: "Assessment",
    title: "현황 진단",
    body: "IBM i（AS/400）상의 애플리케이션, COBOL/RPG 자산, DB2 / Oracle, 주변 시스템 연계를 정리하고 이전 우선순위와 리스크를 명확히 합니다.",
  },
  {
    eyebrow: "PoC",
    title: "PoC와 이전 설계",
    body: "변환 대상, 테스트 범위, 데이터 이전, 클라우드・온프레미스 구성을 작게 검증하고 단계적 로드맵으로 구체화합니다.",
  },
  {
    eyebrow: "Migration",
    title: "변환・구현",
    body: "COBOL/RPG 자산 분석, 설계서・테스트 케이스 생성, Java/API/Cloud 이전, PostgreSQL 이전을 구현 단계까지 지원합니다.",
  },
  {
    eyebrow: "Infrastructure",
    title: "Linux / OCI / AWS 이전",
    body: "기존 인프라의 제약을 고려해 Linux, OCI, AWS 환경으로의 이전, 운영 설계, 모니터링・권한・접속 방식 정리까지 대응합니다.",
  },
  {
    eyebrow: "Stabilization",
    title: "테스트와 운영 안정화",
    body: "업무 영향을 줄이기 위한 테스트, 병행 가동, 성능・장애 대응, 이전 후 개선 운영까지 지속적으로 함께합니다.",
  },
  {
    eyebrow: "Consulting",
    title: "AI 활용 자산 가시화",
    body: "개인에게 의존된 사양과 방대한 기존 코드를 AI 분석・정리의 대상으로 삼아 이전 판단에 필요한 정보로 전환합니다.",
  },
];

const migrationSteps = [
  {
    title: "현황 진단",
    body: "AS/400, COBOL/RPG, DB, 주변 연계를 목록화합니다.",
  },
  {
    title: "자산 분석",
    body: "사양, 의존 관계, 데이터 구조, 이전 난이도를 가시화합니다.",
  },
  {
    title: "PoC",
    body: "대상 범위를 좁혀 변환・테스트・운영 방식을 검증합니다.",
  },
  {
    title: "변환・구현",
    body: "Java/API/Cloud 이전과 PostgreSQL 이전을 단계적으로 진행합니다.",
  },
  {
    title: "테스트",
    body: "업무 로직, 데이터 정합성, 성능, 연계를 확인합니다.",
  },
  {
    title: "운영 안정화",
    body: "병행 가동, 모니터링, 개선 운영까지 지속적으로 지원합니다.",
  },
];

const scenarioPanels = [
  {
    title: "오랫동안 운영된 AS/400 자산의 가시화",
    body: "부서별로 사용되어 온 COBOL/RPG 프로그램, 잡, 장표, DB2 / Oracle 구조를 정리하고, 개인에게 의존된 사양을 해소하기 위한 분석 자료를 작성합니다.",
  },
  {
    title: "주변 시스템 연계를 전제로 한 단계적 이전",
    body: "일괄 재구축이 아니라 기존 업무 영향을 줄이면서 API 연계, 데이터 이전, Java화, 클라우드 기반 이전을 순서대로 진행합니다.",
  },
  {
    title: "이전 후 운영 안정화까지 동행",
    body: "신구 시스템 병행 가동, 테스트 케이스 확충, 장애 대응, 운영 문서 정비까지 포함해 현장이 계속 사용할 수 있는 상태를 목표로 합니다.",
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
    <main
      {...componentNameDebugProps("As400CobolKoreanPage")}
      className="relative overflow-x-hidden bg-white text-slate-950"
    >
      <SiteHeader />

      <section className="px-6 pb-20 pt-[112px] lg:px-0 lg:pb-24 lg:pt-[136px]">
        <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <RevealOnScroll>
            <div className="max-w-[620px]">
              <p className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]">
                IBM i Modernization
              </p>
              <h1 className="mt-4 text-[42px] font-semibold leading-[50px] tracking-normal text-slate-950 md:text-[56px] md:leading-[66px]">
                IBM i（AS/400）
                <br />
                현대화
              </h1>
              <p className="mt-5 text-[20px] font-semibold leading-8 text-slate-800">
                AS400 / COBOL 마이그레이션을 현황 분석부터
                Java/API/Cloud 이전, 운영 안정화까지 지원
              </p>
              <p className="mt-5 text-[16px] font-normal leading-8 text-slate-600">
                QueryPie AI는 COBOL/RPG 자산의 분석・가시화,
                설계서・테스트 케이스 생성, DB2 / Oracle 분석,
                PostgreSQL 이전, Linux / OCI / AWS 환경으로의 이전까지
                단계적으로 지원합니다.
              </p>
              <div className="mt-8">
                <As400CobolCtaAction href={contactHref}>상담하기</As400CobolCtaAction>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full" variant="scale">
            <As400CobolHeroVisual
              imageSrc={heroImageSrc}
              imageAlt={heroImageAlt}
              labels={heroLabels}
            />
          </RevealOnScroll>
        </div>
      </section>

      <As400CobolSection
        muted
        eyebrow="Market Background"
        title="AS/400과 COBOL 자산은 지금도 기간계 시스템의 중요한 주제입니다"
        lead="일본에서는 IBM i（AS/400）를 이용하는 기업이 약 15,000개사 이상이라고 여겨지며, COBOL/AS400을 이용하는 기업도 약 4,000~5,000개사 규모에 이른다고 알려져 있습니다."
      >
        <div className="mx-auto max-w-[860px] space-y-5 text-[16px] leading-8 text-slate-600">
          <p>
            오랫동안 운영되어 온 기간계 시스템은 유지보수 인력 부족,
            개인에게 의존된 사양, 주변 시스템과의 연계, 클라우드 이전 대응 등
            DX 추진에서 중요한 검토 주제가 되고 있습니다.
          </p>
          <p>
            METI의 DX 리포트에서 제시된 “2025년의 절벽”도 레거시 시스템 쇄신을
            뒤로 미루는 리스크를 생각할 때 중요한 맥락입니다. 수치와 출처는
            공개 전 리뷰 과정에서 별도로 확인합니다.
          </p>
        </div>
      </As400CobolSection>

      <As400CobolSection
        id="service-scope"
        eyebrow="Service Scope"
        title="진단, PoC, 변환, 구현, 운영 안정화까지 일관되게 지원"
        lead="AS/400과 COBOL/RPG뿐 아니라 DB, 인프라, 주변 시스템 연계까지 포함한 현실적인 이전 계획을 설계합니다."
      >
        <As400CobolPanelGrid>
          {serviceScopes.map((scope) => (
            <As400CobolPanel
              key={scope.title}
              eyebrow={scope.eyebrow}
              title={scope.title}
              body={scope.body}
            />
          ))}
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolSection
        muted
        eyebrow="Migration Flow"
        title="단계적 Migration으로 업무 영향을 줄이며 쇄신합니다"
        lead="현황 진단부터 자산 분석, PoC, 변환・구현, 테스트, 운영 안정화까지 이전 판단과 구현을 같은 흐름으로 진행합니다."
      >
        <As400CobolMigrationFlow steps={migrationSteps} />
      </As400CobolSection>

      <As400CobolSection
        eyebrow="Scenario"
        title="익명화된 운영 시나리오를 전제로 실행 가능한 이전 계획으로"
        lead="구체적인 고객명이나 벤더명은 드러내지 않고, AS/400, COBOL, RPG, DB2, Oracle, PostgreSQL, Java, API, Cloud 같은 기술 요소는 명확히 다룹니다."
      >
        <As400CobolPanelGrid>
          {scenarioPanels.map((scenario) => (
            <As400CobolPanel
              key={scenario.title}
              title={scenario.title}
              body={scenario.body}
            />
          ))}
        </As400CobolPanelGrid>
      </As400CobolSection>

      <section className="bg-slate-50 px-6 py-20 text-center lg:px-0">
        <div className="mx-auto flex max-w-[760px] flex-col items-center">
          <p className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]">
            Contact
          </p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[44px] text-slate-950 md:text-[46px] md:leading-[56px]">
            AS/400・COBOL 현대화를 상담하기
          </h2>
          <p className="mt-5 text-[16px] leading-8 text-slate-600">
            기존 자산 목록화부터 PoC, 변환, 구현, 운영 안정화까지
            현재 상황에 맞는 단계적 진행 방식을 정리합니다.
          </p>
          <div className="mt-8">
            <As400CobolCtaAction href={contactHref}>상담하기</As400CobolCtaAction>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
