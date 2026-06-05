export type SummarySampleTemplateId =
  | "default"
  | "action-items"
  | "minutes"
  | "key-decisions"

export type SummaryLanguage = "ko" | "ja" | "en" | "th" | "vi"

export const SAMPLE_SUMMARIES: Record<
  SummaryLanguage,
  Record<SummarySampleTemplateId, string>
> = {
  en: {
    default: `## Overview

The team met for the **Q3 Roadmap Review** to align engineering priorities across API specifications, the deployment timeline, and an upcoming security audit. Attendees: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

## Key Takeaways

- The deployment pipeline will be ready by **end of week**.
- The security audit is scheduled for **Friday**.
- Documentation for the new authentication flow is complete.
- The checkout flow now supports **three payment providers**.

## Next Steps

- Finalize the API specification ahead of deployment.
- Run the security audit and triage findings.`,
    "action-items": `## Q3 Roadmap Review — Weekly Summary

### Done

- [x] **Sato Haruka** completed documentation for the new authentication flow
- [x] **John Smith** reviewed the payment/checkout flow (now supports three providers)
- [x] **Yuki Tanaka** finalized the core API specifications

### In Progress

- [ ] **Kim Min-su** is preparing the deployment pipeline (ready by end of week)
- [ ] **Alice Chen** is coordinating the security audit scheduled for Friday

### Planned Next

- [ ] Run the security audit and triage any findings
- [ ] Cut the production deployment after pipeline sign-off

### Blockers / Support Needed

- Need security team confirmation for the Friday audit slot.`,
    minutes: `## Customer Meeting — Q3 Roadmap Review

### Purpose

Align with the customer on Q3 priorities: API specifications, deployment timeline, and the security audit. Present: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### Customer Requests / Questions

- When will the deployment pipeline be production-ready?
- Will the checkout flow support multiple payment providers?
- What is the plan for the security audit?

### Our Responses

- The deployment pipeline will be ready by **end of week**.
- The checkout flow now supports **three payment providers**.
- The security audit is scheduled for **Friday**; documentation for the new authentication flow is already complete.

### Decisions / Agreements

- Proceed with the end-of-week deployment target.
- Customer to receive the audit report after Friday.

### Follow-up Items

- Share the finalized API specification with the customer.`,
    "key-decisions": `## Decision-Making Meeting — Q3 Roadmap Review

### Decision Discussed

How to sequence Q3 work across the API specification, deployment, and security audit. Attendees: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### Final Decisions

1. Ship the deployment pipeline by **end of week**.
2. Run the security audit on **Friday**, before broad rollout.
3. Treat the new authentication flow documentation as complete.

### Rationale / Trade-offs

- Deploying before the audit risks rework, but the team accepts it given the tight Q3 window.
- Three payment providers add complexity but improve checkout coverage.

### Options Considered

- Delaying deployment until after the audit (rejected — too slow for Q3).

### Open Questions

- Should the audit block rollout if critical findings appear?

### Follow-up Actions

- Confirm the Friday audit slot with the security team.`,
  },
  ko: {
    default: `## 개요

팀은 **Q3 로드맵 리뷰**를 진행하여 API 명세, 배포 일정, 예정된 보안 감사에 대한 엔지니어링 우선순위를 정렬했습니다. 참석자: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

## 핵심 요약

- 배포 파이프라인은 **금주 내**에 준비됩니다.
- 보안 감사는 **금요일**로 예정되어 있습니다.
- 신규 인증 플로우 문서화가 완료되었습니다.
- 결제 플로우는 이제 **세 개의 결제 제공업체**를 지원합니다.

## 다음 단계

- 배포 전에 API 명세를 확정합니다.
- 보안 감사를 실행하고 발견 사항을 분류합니다.`,
    "action-items": `## Q3 로드맵 리뷰 — 주간 요약

### 완료

- [x] **Sato Haruka** 신규 인증 플로우 문서화 완료
- [x] **John Smith** 결제/체크아웃 플로우 검토 (현재 세 개 제공업체 지원)
- [x] **Yuki Tanaka** 핵심 API 명세 확정

### 진행 중

- [ ] **Kim Min-su** 배포 파이프라인 준비 중 (금주 내 완료 예정)
- [ ] **Alice Chen** 금요일 예정 보안 감사 조율 중

### 다음 계획

- [ ] 보안 감사 실행 및 발견 사항 분류
- [ ] 파이프라인 승인 후 프로덕션 배포 진행

### 블로커 / 필요한 지원

- 금요일 감사 일정에 대한 보안팀 확인이 필요합니다.`,
    minutes: `## 고객 미팅 — Q3 로드맵 리뷰

### 목적

Q3 우선순위에 대해 고객과 정렬: API 명세, 배포 일정, 보안 감사. 참석자: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### 고객 요청 / 질문

- 배포 파이프라인은 언제 프로덕션 준비가 되나요?
- 체크아웃 플로우가 여러 결제 제공업체를 지원하나요?
- 보안 감사 계획은 어떻게 되나요?

### 당사 답변

- 배포 파이프라인은 **금주 내** 준비됩니다.
- 체크아웃 플로우는 현재 **세 개의 결제 제공업체**를 지원합니다.
- 보안 감사는 **금요일**로 예정되어 있으며, 신규 인증 플로우 문서화는 이미 완료되었습니다.

### 결정 / 합의

- 금주 내 배포 목표로 진행합니다.
- 고객은 금요일 이후 감사 보고서를 받습니다.

### 후속 항목

- 확정된 API 명세를 고객과 공유합니다.`,
    "key-decisions": `## 의사결정 회의 — Q3 로드맵 리뷰

### 논의된 결정 사항

API 명세, 배포, 보안 감사에 걸친 Q3 작업 순서 결정. 참석자: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### 최종 결정

1. 배포 파이프라인을 **금주 내** 출시한다.
2. 광범위한 롤아웃 전 **금요일**에 보안 감사를 실행한다.
3. 신규 인증 플로우 문서화를 완료로 간주한다.

### 근거 / 트레이드오프

- 감사 전 배포는 재작업 위험이 있으나, 빠듯한 Q3 일정을 고려해 팀이 이를 수용했습니다.
- 세 개의 결제 제공업체는 복잡도를 높이지만 체크아웃 커버리지를 개선합니다.

### 검토한 옵션

- 감사 이후로 배포 연기 (반려 — Q3 일정에 너무 늦음).

### 미해결 질문

- 치명적 발견 사항이 나오면 감사가 롤아웃을 차단해야 하나요?

### 후속 조치

- 보안팀과 금요일 감사 일정을 확정합니다.`,
  },
  ja: {
    default: `## 概要

チームは **Q3 ロードマップレビュー** を実施し、API 仕様、デプロイ計画、今後のセキュリティ監査にわたるエンジニアリングの優先順位を整理しました。出席者: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

## 主なポイント

- デプロイパイプラインは **今週中** に準備が整います。
- セキュリティ監査は **金曜日** に予定されています。
- 新しい認証フローのドキュメントが完成しました。
- チェックアウトフローは現在 **3 つの決済プロバイダー** に対応しています。

## 次のステップ

- デプロイ前に API 仕様を確定します。
- セキュリティ監査を実施し、検出事項を分類します。`,
    "action-items": `## Q3 ロードマップレビュー — 週次サマリー

### 完了

- [x] **Sato Haruka** 新しい認証フローのドキュメントを完成
- [x] **John Smith** 決済/チェックアウトフローをレビュー（現在 3 プロバイダー対応）
- [x] **Yuki Tanaka** 中核となる API 仕様を確定

### 進行中

- [ ] **Kim Min-su** デプロイパイプラインを準備中（今週中に完了予定）
- [ ] **Alice Chen** 金曜日のセキュリティ監査を調整中

### 次の予定

- [ ] セキュリティ監査を実施し、検出事項を分類
- [ ] パイプライン承認後に本番デプロイを実施

### ブロッカー / 必要な支援

- 金曜日の監査枠についてセキュリティチームの確認が必要です。`,
    minutes: `## 顧客ミーティング — Q3 ロードマップレビュー

### 目的

Q3 の優先事項について顧客と認識を合わせる: API 仕様、デプロイ計画、セキュリティ監査。出席者: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### 顧客からの要望 / 質問

- デプロイパイプラインはいつ本番対応になりますか？
- チェックアウトフローは複数の決済プロバイダーに対応しますか？
- セキュリティ監査の計画はどうなっていますか？

### 当社の回答

- デプロイパイプラインは **今週中** に準備が整います。
- チェックアウトフローは現在 **3 つの決済プロバイダー** に対応しています。
- セキュリティ監査は **金曜日** に予定されており、新しい認証フローのドキュメントは既に完成しています。

### 決定 / 合意事項

- 今週中のデプロイ目標で進めます。
- 顧客には金曜日以降に監査レポートを提供します。

### フォローアップ項目

- 確定した API 仕様を顧客と共有します。`,
    "key-decisions": `## 意思決定会議 — Q3 ロードマップレビュー

### 議論した決定事項

API 仕様、デプロイ、セキュリティ監査にまたがる Q3 作業の順序付け。出席者: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### 最終決定

1. デプロイパイプラインを **今週中** にリリースする。
2. 広範な展開の前に **金曜日** にセキュリティ監査を実施する。
3. 新しい認証フローのドキュメントを完了とみなす。

### 根拠 / トレードオフ

- 監査前のデプロイは手戻りのリスクがありますが、厳しい Q3 スケジュールを踏まえてチームが受け入れました。
- 3 つの決済プロバイダーは複雑さを増しますが、チェックアウトの対応範囲を広げます。

### 検討した選択肢

- 監査後までデプロイを延期する（却下 — Q3 には遅すぎる）。

### 未解決の質問

- 重大な検出事項が出た場合、監査は展開をブロックすべきか？

### フォローアップアクション

- セキュリティチームと金曜日の監査枠を確定します。`,
  },
  th: {
    default: `## ภาพรวม

ทีมได้ประชุม **Q3 Roadmap Review** เพื่อจัดลำดับความสำคัญด้านวิศวกรรมในเรื่องข้อกำหนด API กำหนดการดีพลอย และการตรวจสอบความปลอดภัยที่กำลังจะมาถึง ผู้เข้าร่วม: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka

## ประเด็นสำคัญ

- ไปป์ไลน์การดีพลอยจะพร้อม **ภายในสิ้นสัปดาห์นี้**
- การตรวจสอบความปลอดภัยกำหนดไว้ใน **วันศุกร์**
- เอกสารสำหรับโฟลว์การยืนยันตัวตนใหม่เสร็จสมบูรณ์แล้ว
- โฟลว์การชำระเงินรองรับ **ผู้ให้บริการชำระเงินสามราย** แล้ว

## ขั้นตอนถัดไป

- สรุปข้อกำหนด API ให้เสร็จก่อนการดีพลอย
- ดำเนินการตรวจสอบความปลอดภัยและจัดลำดับสิ่งที่พบ`,
    "action-items": `## Q3 Roadmap Review — สรุปรายสัปดาห์

### เสร็จแล้ว

- [x] **Sato Haruka** จัดทำเอกสารโฟลว์การยืนยันตัวตนใหม่เสร็จสมบูรณ์
- [x] **John Smith** ตรวจสอบโฟลว์การชำระเงิน/เช็กเอาต์ (รองรับสามผู้ให้บริการแล้ว)
- [x] **Yuki Tanaka** สรุปข้อกำหนด API หลักเรียบร้อย

### กำลังดำเนินการ

- [ ] **Kim Min-su** กำลังเตรียมไปป์ไลน์การดีพลอย (พร้อมภายในสิ้นสัปดาห์)
- [ ] **Alice Chen** กำลังประสานงานการตรวจสอบความปลอดภัยในวันศุกร์

### แผนถัดไป

- [ ] ดำเนินการตรวจสอบความปลอดภัยและจัดลำดับสิ่งที่พบ
- [ ] ดีพลอยขึ้นโปรดักชันหลังอนุมัติไปป์ไลน์

### อุปสรรค / ความช่วยเหลือที่ต้องการ

- ต้องการการยืนยันช่วงเวลาตรวจสอบวันศุกร์จากทีมความปลอดภัย`,
    minutes: `## ประชุมลูกค้า — Q3 Roadmap Review

### วัตถุประสงค์

จัดแนวทางกับลูกค้าเรื่องลำดับความสำคัญ Q3: ข้อกำหนด API กำหนดการดีพลอย และการตรวจสอบความปลอดภัย ผู้เข้าร่วม: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka

### คำขอ / คำถามจากลูกค้า

- ไปป์ไลน์การดีพลอยจะพร้อมใช้งานจริงเมื่อใด
- โฟลว์เช็กเอาต์จะรองรับผู้ให้บริการชำระเงินหลายรายหรือไม่
- แผนการตรวจสอบความปลอดภัยเป็นอย่างไร

### คำตอบของเรา

- ไปป์ไลน์การดีพลอยจะพร้อม **ภายในสิ้นสัปดาห์นี้**
- โฟลว์เช็กเอาต์รองรับ **ผู้ให้บริการชำระเงินสามราย** แล้ว
- การตรวจสอบความปลอดภัยกำหนดไว้ใน **วันศุกร์** และเอกสารโฟลว์การยืนยันตัวตนใหม่เสร็จแล้ว

### การตัดสินใจ / ข้อตกลง

- ดำเนินการตามเป้าหมายดีพลอยภายในสิ้นสัปดาห์
- ลูกค้าจะได้รับรายงานการตรวจสอบหลังวันศุกร์

### รายการติดตามผล

- แชร์ข้อกำหนด API ฉบับสมบูรณ์ให้ลูกค้า`,
    "key-decisions": `## ประชุมตัดสินใจ — Q3 Roadmap Review

### ประเด็นที่พิจารณา

การจัดลำดับงาน Q3 ระหว่างข้อกำหนด API การดีพลอย และการตรวจสอบความปลอดภัย ผู้เข้าร่วม: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka

### การตัดสินใจขั้นสุดท้าย

1. ปล่อยไปป์ไลน์การดีพลอย **ภายในสิ้นสัปดาห์นี้**
2. ดำเนินการตรวจสอบความปลอดภัยใน **วันศุกร์** ก่อนการปล่อยใช้งานในวงกว้าง
3. ถือว่าเอกสารโฟลว์การยืนยันตัวตนใหม่เสร็จสมบูรณ์

### เหตุผล / ข้อแลกเปลี่ยน

- การดีพลอยก่อนการตรวจสอบมีความเสี่ยงต้องแก้งานซ้ำ แต่ทีมยอมรับเนื่องจากกรอบเวลา Q3 ที่จำกัด
- ผู้ให้บริการชำระเงินสามรายเพิ่มความซับซ้อน แต่ขยายความครอบคลุมการเช็กเอาต์

### ตัวเลือกที่พิจารณา

- เลื่อนการดีพลอยไปหลังการตรวจสอบ (ปฏิเสธ — ช้าเกินไปสำหรับ Q3)

### คำถามที่ยังค้างอยู่

- หากพบปัญหาร้ายแรง การตรวจสอบควรระงับการปล่อยใช้งานหรือไม่

### การดำเนินการติดตามผล

- ยืนยันช่วงเวลาตรวจสอบวันศุกร์กับทีมความปลอดภัย`,
  },
  vi: {
    default: `## Tổng quan

Nhóm đã họp **Đánh giá Lộ trình Q3** để thống nhất các ưu tiên kỹ thuật về đặc tả API, lịch triển khai và đợt kiểm toán bảo mật sắp tới. Người tham dự: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

## Điểm chính

- Quy trình triển khai sẽ sẵn sàng **vào cuối tuần**.
- Kiểm toán bảo mật được lên lịch vào **thứ Sáu**.
- Tài liệu cho luồng xác thực mới đã hoàn tất.
- Luồng thanh toán hiện hỗ trợ **ba nhà cung cấp thanh toán**.

## Bước tiếp theo

- Hoàn thiện đặc tả API trước khi triển khai.
- Thực hiện kiểm toán bảo mật và phân loại các phát hiện.`,
    "action-items": `## Đánh giá Lộ trình Q3 — Tóm tắt hằng tuần

### Đã hoàn thành

- [x] **Sato Haruka** hoàn tất tài liệu cho luồng xác thực mới
- [x] **John Smith** rà soát luồng thanh toán/thanh toán (hiện hỗ trợ ba nhà cung cấp)
- [x] **Yuki Tanaka** hoàn thiện các đặc tả API cốt lõi

### Đang thực hiện

- [ ] **Kim Min-su** đang chuẩn bị quy trình triển khai (sẵn sàng vào cuối tuần)
- [ ] **Alice Chen** đang điều phối đợt kiểm toán bảo mật vào thứ Sáu

### Kế hoạch tiếp theo

- [ ] Thực hiện kiểm toán bảo mật và phân loại các phát hiện
- [ ] Triển khai bản production sau khi quy trình được phê duyệt

### Vướng mắc / Cần hỗ trợ

- Cần đội bảo mật xác nhận khung giờ kiểm toán thứ Sáu.`,
    minutes: `## Họp khách hàng — Đánh giá Lộ trình Q3

### Mục đích

Thống nhất với khách hàng về các ưu tiên Q3: đặc tả API, lịch triển khai và kiểm toán bảo mật. Người tham dự: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### Yêu cầu / Câu hỏi của khách hàng

- Khi nào quy trình triển khai sẵn sàng cho production?
- Luồng thanh toán có hỗ trợ nhiều nhà cung cấp không?
- Kế hoạch kiểm toán bảo mật là gì?

### Phản hồi của chúng tôi

- Quy trình triển khai sẽ sẵn sàng **vào cuối tuần**.
- Luồng thanh toán hiện hỗ trợ **ba nhà cung cấp thanh toán**.
- Kiểm toán bảo mật được lên lịch vào **thứ Sáu**; tài liệu luồng xác thực mới đã hoàn tất.

### Quyết định / Thỏa thuận

- Tiến hành theo mục tiêu triển khai cuối tuần.
- Khách hàng sẽ nhận báo cáo kiểm toán sau thứ Sáu.

### Việc cần theo dõi

- Chia sẻ đặc tả API hoàn chỉnh với khách hàng.`,
    "key-decisions": `## Họp ra quyết định — Đánh giá Lộ trình Q3

### Quyết định được thảo luận

Cách sắp xếp thứ tự công việc Q3 giữa đặc tả API, triển khai và kiểm toán bảo mật. Người tham dự: Alice Chen, Yuki Tanaka, Kim Min-su, John Smith, Sato Haruka.

### Quyết định cuối cùng

1. Phát hành quy trình triển khai **vào cuối tuần**.
2. Thực hiện kiểm toán bảo mật vào **thứ Sáu**, trước khi triển khai rộng rãi.
3. Coi tài liệu luồng xác thực mới là đã hoàn tất.

### Lý do / Đánh đổi

- Triển khai trước kiểm toán có rủi ro phải làm lại, nhưng nhóm chấp nhận do khung thời gian Q3 eo hẹp.
- Ba nhà cung cấp thanh toán làm tăng độ phức tạp nhưng cải thiện phạm vi thanh toán.

### Các phương án đã cân nhắc

- Hoãn triển khai đến sau kiểm toán (bị bác — quá chậm cho Q3).

### Câu hỏi còn bỏ ngỏ

- Kiểm toán có nên chặn việc triển khai nếu phát hiện vấn đề nghiêm trọng không?

### Hành động theo dõi

- Xác nhận khung giờ kiểm toán thứ Sáu với đội bảo mật.`,
  },
}
