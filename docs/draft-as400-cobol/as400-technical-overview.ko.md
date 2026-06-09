# AS/400 기술 개요와 변화 연혁

작성일: 2026-06-09

## 요약

AS/400은 IBM이 1988년에 출시한 중형 업무용 컴퓨터 플랫폼입니다. 정확한
제품명은 `Application System/400`이며, IBM의 기존 `System/36`과
`System/38` 계열을 계승하기 위해 만들어졌습니다. 현재 현장에서 `AS/400`이라고
부르는 대상은 대개 실제 1988년 장비가 아니라, 그 계보가 이어진 `IBM i on IBM
Power` 환경을 뜻합니다.

기술적으로 AS/400은 단순한 서버 하드웨어가 아니라 CPU, 운영체제, 내장
데이터베이스, 미들웨어, 런타임, 보안, 업무 개발 환경이 강하게 통합된 플랫폼입니다.
초기에는 48비트 CISC 계열 프로세서와 `OS/400`을 사용했고, 1995년 이후에는
64비트 RISC/PowerPC 계열로 전환되었습니다. 이후 제품명은 `iSeries`,
`System i`, `Power Systems`로 바뀌었고, OS 이름도 `OS/400`에서 `i5/OS`,
현재의 `IBM i`로 바뀌었습니다.

## AS/400은 메인프레임인가

정확한 분류로는 AS/400은 일반적인 메인프레임이 아닙니다. IBM 메인프레임은
보통 `IBM Z`/`z/OS` 계열을 의미합니다. AS/400은 IBM의 미드레인지 또는 일본식
표현으로는 오프컴/オフコン에 가까운 범주입니다.

다만 현장에서는 `레거시`, `호스트`, `메인프레임`, `오프컴`, `AS/400` 같은 말을
느슨하게 섞어 쓰는 경우가 있습니다. 문서나 공개 페이지에서는 다음처럼 구분하는
것이 안전합니다.

| 표현 | 보통 의미 |
| --- | --- |
| 메인프레임 | IBM Z, z/OS, CICS, IMS, JCL, 메인프레임 COBOL 중심의 대형 범용기 |
| AS/400 | IBM i 계열의 중형 업무 플랫폼. RPG, COBOL, CL, Db2 for i 기반 기간계 시스템 |
| IBM i | 현재 AS/400 계보의 운영체제 및 플랫폼 명칭 |
| IBM Power | 현재 IBM i가 구동되는 서버 하드웨어 계열 |

## CPU와 OS 변화 연혁

| 시기 | 제품/브랜드 | CPU/프로세서 계열 | OS 이름 | 기술적 의미 |
| --- | --- | --- | --- | --- |
| 1978 | System/38 | IBM 독자 계열 | CPF | AS/400의 기술적 선조. 객체 기반 OS, 단일 수준 저장소, 내장 데이터베이스 개념의 기반 |
| 1983 | System/36 | IBM 미드레인지 계열 | System/36 환경 | AS/400이 호환성을 제공한 대표 선행 업무 시스템 |
| 1988 | AS/400 | 48비트 CISC 계열, IMPI 기반 | OS/400 | AS/400 최초 출시. System/36, System/38 애플리케이션 호환성과 통합 업무 플랫폼을 제공 |
| 1995 | AS/400 Advanced Series | 64비트 RISC, PowerPC AS 계열 | OS/400 | CISC에서 RISC로 대전환. TIMI/MI와 LIC 계층 덕분에 기존 애플리케이션 호환성을 유지 |
| 2000 | eServer iSeries | PowerPC/POWER 계열로 발전 | OS/400 | AS/400 브랜드를 iSeries로 변경. e-business와 오픈 기술 대응을 강조 |
| 2004 | eServer i5 | POWER5 계열 | i5/OS | 하드웨어 브랜드와 OS 이름을 함께 변경. POWER5 세대와 연결된 명칭 |
| 2006 | System i | POWER5/POWER5+ 계열 | i5/OS | IBM 서버 브랜드 재정리 속에서 System i로 변경 |
| 2008 | IBM Power Systems | POWER6 계열 | IBM i 6.1 | System i와 System p가 Power Systems로 통합. 같은 Power 하드웨어에서 IBM i, AIX, Linux를 운영하는 구조로 전환 |
| 2010년대 | IBM Power Systems | POWER7, POWER8, POWER9 | IBM i 7.x | PowerVM, LPAR, 오픈소스, Java, PASE, 웹/오픈 연계 기능이 확대 |
| 2020년대 | IBM Power / Power Virtual Server | POWER10, POWER11 | IBM i 7.5, IBM i 7.6 | IBM i는 온프레미스 Power 서버와 IBM Power Virtual Server 양쪽에서 운영 가능. IBM i 7.6은 selected Power10/Power11 서버에서 지원 |

## 초기 AS/400의 CPU와 OS

초기 AS/400의 운영체제는 `OS/400`입니다. IBM의 AS/400 역사 페이지도
OS/400을 AS/400의 중심에 있는 운영체제로 설명하며, 모든 모델에서 동작하고
System/36과 System/38 애플리케이션과의 후방 호환성을 제공했다고 정리합니다.

초기 프로세서는 IBM 독자 48비트 CISC 계열로 설명됩니다. AS/400은 하드웨어의
명령어 집합을 애플리케이션에 직접 노출하는 일반 서버와 달리, `MI` 또는 `TIMI`라고
불리는 기술 독립적 기계 인터페이스와 하위 마이크로코드/LIC 계층을 두었습니다.
이 구조 때문에 이후 CPU 명령어 집합이 CISC에서 PowerPC/RISC로 바뀌어도 기존
업무 애플리케이션의 호환성을 비교적 강하게 유지할 수 있었습니다.

정리하면 초기 출시 시점의 핵심은 다음과 같습니다.

| 항목 | 초기 AS/400 |
| --- | --- |
| 출시 | 1988년 |
| CPU | IBM 독자 48비트 CISC/IMPI 계열 |
| OS | OS/400 |
| 데이터베이스 | OS에 통합된 관계형 데이터베이스. 현재 명칭은 Db2 for i |
| 주요 언어 | RPG, COBOL, CL 등 |
| 단말/인터페이스 | 5250 터미널 계열, 메뉴/명령 기반 운영 인터페이스 |
| 주요 설계 | 객체 기반 OS, 단일 수준 저장소, TIMI/MI, 통합 DB, 후방 호환성 |

## 1995년 RISC/PowerPC 전환의 의미

AS/400의 가장 큰 기술적 전환점은 1995년의 64비트 RISC/PowerPC 계열 전환입니다.
일반적으로 CPU 아키텍처가 바뀌면 애플리케이션 재컴파일이나 재작성 부담이 커지지만,
AS/400은 플랫폼 내부의 기계 인터페이스와 LIC 계층이 하드웨어 차이를 흡수하도록
설계되어 있었습니다.

이 전환으로 AS/400은 다음 효과를 얻었습니다.

- 독자 CISC 프로세서에서 IBM의 PowerPC/POWER 계열로 진화할 수 있는 길을 확보
- 기존 RPG/COBOL/CL 애플리케이션 자산의 호환성을 유지
- 미드레인지 시스템이면서 대규모 업무 처리와 서버 통합에 대응할 수 있는 성능 기반 확보
- 이후 iSeries, System i, Power Systems로 이어지는 하드웨어 공통화의 기반 마련

## OS 이름 변화

AS/400 계보에서 OS 이름은 다음과 같이 바뀌었습니다.

| OS 이름 | 사용 맥락 |
| --- | --- |
| CPF | System/38의 운영체제. AS/400의 설계 사상에 큰 영향을 준 선행 OS |
| OS/400 | 1988년 AS/400 출시와 함께 사용된 운영체제 이름 |
| i5/OS | 2004년 eServer i5/POWER5 세대와 함께 도입된 이름 |
| IBM i | 2008년 Power Systems 통합 이후의 현재 OS 이름 |

현재 `IBM i`는 단순 OS 이름이면서 동시에 통합 플랫폼을 가리키는 이름처럼 쓰입니다.
IBM i에는 운영체제 기능뿐 아니라 Db2 for i, 보안, 작업 관리, 5250 인터페이스,
PowerVM/LPAR와의 통합, PASE를 통한 AIX/UNIX 계열 실행 환경, Java와 오픈소스
도구 연계가 포함됩니다.

## 현재 기술 현황

2026년 현재 관점에서 AS/400 관련 기술 현황을 표현하면 다음과 같습니다.

- 현재 하드웨어: IBM Power 서버 또는 IBM Power Virtual Server
- 현재 CPU: POWER10, POWER11 등 IBM Power 계열
- 현재 OS: IBM i
- 최신 주요 OS 릴리스: IBM i 7.6
- IBM i 7.6 지원 하드웨어: selected IBM Power10 및 Power11 기술 기반 서버
- 내장 DB: Db2 for i
- 주요 기존 언어: RPG, COBOL, CL
- 현대화 연계: Java, SQL, REST API, Python, Node.js, PHP, Git, PASE, WebSphere/Apache 등

## IBM i 환경의 주요 구성 요소

IBM i 환경은 Linux처럼 커널, 배포판, DBMS, 미들웨어, 패키지 관리자를 각각
조합해 구성하는 방식과 다릅니다. IBM i는 운영체제, 데이터베이스, 보안, 작업 관리,
개발 런타임, 관리 도구가 하나의 제품 스택으로 통합된 구조입니다.

| 구성 요소 | 역할 | 기술 특징 |
| --- | --- | --- |
| IBM Power 하드웨어 | IBM i가 실행되는 물리/가상 서버 기반 | POWER10, POWER11 등 Power 프로세서 기반. 온프레미스 Power 서버 또는 IBM Power Virtual Server에서 운영 가능 |
| IBM i OS | 운영체제이자 통합 실행 플랫폼 | 데이터베이스, 미들웨어, 보안, 런타임, 하이퍼바이저 연계가 하나의 스택으로 통합됨 |
| Licensed Internal Code(LIC) / SLIC | 하드웨어와 OS 사이의 저수준 실행 계층 | CPU 아키텍처 차이를 흡수하고 TIMI/MI 위의 애플리케이션 호환성을 유지하는 핵심 계층 |
| TIMI / MI | 기술 독립적 기계 인터페이스 | 애플리케이션이 특정 CPU 명령어 집합에 직접 묶이지 않도록 하는 추상화 계층 |
| Db2 for i | 내장 관계형 데이터베이스 | IBM i에 통합된 RDBMS. 별도 DB 서버라기보다 OS 일부처럼 운영되며, SQL과 기존 DDS/native I/O 자산을 함께 지원 |
| 단일 수준 저장소 | 메모리와 디스크를 하나의 주소 공간처럼 관리하는 저장 구조 | DB 테이블스페이스나 디스크 배치 관리 부담을 줄이고, OS가 객체와 저장 위치를 통합 관리 |
| 객체 기반 구조 | 파일 중심이 아니라 객체 중심으로 시스템 자원을 관리 | 프로그램, 파일, 라이브러리, 데이터 큐, 잡 큐 등 다양한 자원이 객체 타입과 권한 모델을 가짐 |
| 라이브러리와 Library List | 전통 IBM i 애플리케이션의 네임스페이스와 탐색 순서 | Linux의 디렉터리/PATH와 비슷한 역할도 하지만, 객체와 라이브러리 단위의 업무 애플리케이션 배치 방식에 가깝다 |
| Integrated File System(IFS) | UNIX/PC와 유사한 계층형 파일 시스템 제공 | 스트림 파일, 디렉터리 경로, NFS/Windows 연계 등을 지원하면서 IBM i 전체 객체에 대한 통합 접근 구조를 제공 |
| Work Management | 작업(Job), 서브시스템, 잡 큐, 출력 큐 등 실행 관리 | Linux 프로세스/서비스 관리와 유사한 목적이지만, 업무 트랜잭션과 배치 중심으로 job을 통제하는 모델 |
| 5250 인터페이스 | 전통적인 녹색 화면 업무/운영 인터페이스 | 메뉴, 명령어, 화면 기반 업무 앱을 제공. 현대화 시 웹/API/GUI와 병행하거나 대체 대상이 됨 |
| CL(Control Language) | 시스템 운영과 배치 제어용 명령/스크립트 언어 | Linux shell script와 비슷한 자동화 역할을 하지만, IBM i 명령과 객체/잡 관리에 밀접하게 결합 |
| RPG / COBOL | 기존 기간계 업무 로직의 주요 구현 언어 | 파일/레코드 중심 업무 처리, 배치, 트랜잭션 로직에 많이 사용. 최신 IBM i에서는 free-form RPG, SQL, API 연계와 함께 사용 가능 |
| PASE for i | AIX/UNIX 계열 애플리케이션 실행 환경 | IBM i 안에서 UNIX 계열 런타임을 제공. Python, Node.js, Git 등 오픈소스 개발 도구 활용의 기반 |
| Qshell / SSH / Open Source RPM | 현대적 CLI와 오픈소스 개발 도구 | Linux와 비슷한 shell/CLI 경험을 일부 제공하지만, IBM i native 환경과 PASE 환경의 경계를 이해해야 함 |
| IBM Navigator for i / ACS | 관리, DB, 5250, 파일 전송, 개발 보조 도구 | 웹 기반 관리 UI와 클라이언트 도구를 통해 시스템/DB/잡/성능/5250 접근을 지원 |

## Linux 개발환경과의 비교

IBM i는 최근 Python, Node.js, Git, SSH, RPM 패키지 등 Linux 개발자에게 익숙한
도구를 제공하지만, 기본 운영 모델은 Linux와 다릅니다. 특히 기존 RPG/COBOL
자산을 다룰 때는 `파일과 프로세스` 중심이 아니라 `객체, 라이브러리, 잡, 통합 DB`
중심으로 이해해야 합니다.

| 관점 | IBM i | Linux 개발환경 |
| --- | --- | --- |
| 시스템 성격 | OS, DB, 미들웨어, 보안, 런타임이 통합된 업무 플랫폼 | 커널과 배포판 위에 DBMS, 미들웨어, 런타임을 조합하는 범용 서버 환경 |
| 기본 자원 모델 | 모든 것이 객체에 가깝고, 객체 타입과 권한이 중요 | 모든 것이 파일이라는 UNIX 철학에 가까우며, 파일 descriptor와 경로가 중심 |
| 파일/네임스페이스 | 라이브러리, 객체, IFS가 공존 | 계층형 파일 시스템과 `$PATH`, 패키지 경로 중심 |
| 데이터베이스 | Db2 for i가 OS에 통합되어 있고 OS 릴리스와 밀접 | PostgreSQL, MySQL, Db2 LUW 등 별도 DBMS를 설치/운영하는 경우가 일반적 |
| 저장소 관리 | 단일 수준 저장소와 객체 기반 관리가 핵심 | 블록 디바이스, 파일 시스템, 볼륨, DB 테이블스페이스 등을 계층적으로 관리 |
| 실행 단위 | Job, subsystem, job queue, activation group 등이 중요 | Process, thread, service, cgroup, systemd unit 등이 중요 |
| 배치/운영 자동화 | CL, job scheduler, job queue, message queue 등 | shell script, cron, systemd timer, CI runner 등 |
| 전통 업무 UI | 5250 화면과 메뉴 기반 앱이 많음 | 터미널 CLI, 웹 UI, 데스크톱/모바일 클라이언트가 일반적 |
| 개발 언어 | RPG, COBOL, CL, SQL이 기간계 자산의 중심. Java/Python/Node.js도 가능 | C/C++, Java, Go, Python, Node.js, Ruby 등 범용 언어 선택 폭이 넓음 |
| 오픈소스 도구 | PASE와 RPM 기반으로 Git, Python, Node.js 등을 사용 | 배포판 패키지 관리자와 컨테이너 생태계가 기본 개발 흐름에 가까움 |
| 권한 모델 | 사용자 프로파일, 객체 권한, adopted authority, 라이브러리/오브젝트 권한이 중요 | 사용자/그룹, POSIX 권한, ACL, SELinux/AppArmor, sudo 등이 중요 |
| 운영 인력 모델 | 플랫폼 자체가 DB/보안/운영을 통합해 소수 인력 운영 사례가 많음 | 각 계층별 전문 운영, SRE, DBA, 미들웨어 관리 분리가 흔함 |
| 현대화 포인트 | 5250/RPG/COBOL/Db2 for i 자산을 분석하고 API, SQL, 웹, Java/Python/Node.js와 연결 | 기존 Linux 앱은 컨테이너화, 클라우드 네이티브화, DB 분리, CI/CD 고도화가 주요 흐름 |

## 개발자가 혼동하기 쉬운 지점

1. `Db2 for i`는 Linux에 별도 설치하는 Db2 LUW와 같은 운영 감각이 아닙니다.
   IBM i에 통합되어 있고 OS 릴리스, 객체 권한, 단일 수준 저장소와 밀접하게 움직입니다.
2. IFS는 Linux와 유사한 경로 기반 파일 시스템을 제공하지만, IBM i 전체가 Linux처럼
   파일 시스템 하나로만 구성된 것은 아닙니다. 라이브러리와 객체 모델이 여전히 중요합니다.
3. PASE에서 실행하는 Python/Node.js/Git은 Linux 경험과 비슷하지만, 기존 RPG/COBOL
   애플리케이션은 native IBM i 객체, 라이브러리, 잡 환경과 연결되어 있습니다.
4. `job`은 단순히 Linux process 하나와 1:1로 대응하지 않습니다. 배치, 대화형 세션,
   서버 작업, subsystem, job queue까지 포함하는 운영 단위로 보는 편이 좋습니다.
5. 시스템 현대화는 Linux로 다시 작성하는 것만을 뜻하지 않습니다. 기존 IBM i와 Db2 for i를
   유지하면서 SQL, API, 웹, 오픈소스 런타임을 붙이는 방식도 현대화 경로가 될 수 있습니다.

따라서 공개 콘텐츠에서 `AS/400`이라고 쓸 때는 다음 의미를 분명히 하는 것이 좋습니다.

> AS/400（現在のIBM i）は、IBM Power上で動作する統合型の基幹業務プラットフォームです。

또는 한국어 내부 설명에서는 다음처럼 정리할 수 있습니다.

> AS/400은 현재 IBM i on IBM Power로 이어진 IBM의 통합형 기간계 업무 플랫폼이며, 오늘날 AS/400이라고 부르는 시스템은 대개 IBM i 위에서 RPG/COBOL/CL 및 Db2 for i 기반 애플리케이션을 운영하는 환경을 뜻한다.

## 공개 문구 작성 시 주의점

1. `AS/400 = 메인프레임`이라고 단정하지 않습니다.
2. `AS/400`은 현장 관용어로 유지하되, 첫 언급에는 `AS/400（IBM i）`처럼 병기합니다.
3. 현재 기술을 설명할 때는 `IBM i on IBM Power` 또는 `IBM Power上で動作するIBM i`라고 씁니다.
4. CPU를 설명할 때는 초기 48비트 CISC/IMPI, 1995년 이후 64비트 RISC/PowerPC, 현재 POWER 계열로 구분합니다.
5. OS를 설명할 때는 `OS/400 -> i5/OS -> IBM i`의 이름 변화를 분리합니다.
6. Db2 for i는 별도 설치형 DBMS라기보다 IBM i에 통합된 데이터베이스로 설명합니다.

## 참고 출처

- IBM, 「The AS/400」
  - https://www.ibm.com/history/as-400
  - AS/400 출시 맥락, OS/400, System/36/System/38 호환성, 1988년 플랫폼 성격 확인에 사용했습니다.
- i Magazine, 「IBM iの歴史」, 2025
  - https://www.imagazine.co.jp/01-ibm-i-history-of-ibm-i-nyumon-guide-kisotishiki/
  - 48비트 CISC, IMPI/MI, 1995년 64비트 RISC/PowerPC 전환, iSeries/System i/Power Systems 명칭 변화 확인에 사용했습니다.
- Fortra, 「IBM i History and Timeline」
  - https://power.fortra.com/blog/ibm-i-history-and-timeline
  - System/38, AS/400, iSeries, System i, Power Systems와 OS 이름 변화의 타임라인 교차 확인에 사용했습니다.
- IBM Support, 「IBM i 7.6 - Base Enhancements」
  - https://www.ibm.com/support/pages/ibm-i-76-base-enhancements
  - IBM i 7.6이 selected Power10/Power11 기반 IBM Power 서버에서 지원된다는 현재 기술 현황 확인에 사용했습니다.
- IBM Support, 「IBM i Platform Support Summary」
  - https://www.ibm.com/support/pages/ibm-i-platform-support-summary
  - IBM i와 Power 서버 모델/릴리스 지원 관계 확인에 사용했습니다.
- IBM, 「IBM i operating system」
  - https://www.ibm.com/products/ibm-i
  - IBM i가 데이터베이스, 미들웨어, 보안, 런타임, 관리 도구를 통합한 플랫폼이라는 현재 제품 설명과 IBM Power Virtual Server 운영 가능성 확인에 사용했습니다.
- IBM Support, 「Db2 for IBM i」
  - https://www.ibm.com/support/pages/db2-ibm-i
  - Db2 for i가 IBM i에 통합된 RDBMS이며 단일 수준 저장소와 객체 기반 구조 위에서 운영된다는 설명 확인에 사용했습니다.
- IBM Docs, 「What the integrated file system is」
  - https://www.ibm.com/docs/en/i/7.5.0?topic=system-what-integrated-file-is
  - IFS가 UNIX/PC와 유사한 스트림 파일, 계층형 디렉터리, 공통 인터페이스를 제공한다는 설명 확인에 사용했습니다.
- IBM Support, 「Open Source Support for IBM i」
  - https://www.ibm.com/support/pages/open-source-support-ibm-i
  - IBM i에서 OpenSSH, OpenSSL, Apache, Java 및 RPM 기반 오픈소스 도구를 지원한다는 현재 개발환경 설명 확인에 사용했습니다.
