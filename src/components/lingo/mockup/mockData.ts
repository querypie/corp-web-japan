// ═══════════════════════════════════════════════════════════════
//  lingo-web mockup 전용 데이터 — lingo/frontend 타입을 기반으로 작성
//  모든 타입을 이 파일에 인라인 정의하며 외부 의존 없음
// ═══════════════════════════════════════════════════════════════

// ── 기본 타입 ───────────────────────────────

export type SessionState =
  | "scheduled"
  | "live"
  | "ended"
  | "cancelled"
  | "auto_join_failed"

export type SessionStatus = "active" | "paused"

export type BotStatus =
  | "creating"
  | "ready"
  | "joining"
  | "in_waiting_room"
  | "in_meeting"
  | "recording"
  | "ending"
  | "done"
  | "error"

export type MeetingType = "in-person" | "remote"

export type AudioSource = "mic" | "screen" | "mix" | "bot"

export interface WordTimestamp {
  text: string
  start_time: number
  end_time: number
}

export interface SpeechBlock {
  id: string
  session_id: string
  start_time: number
  end_time: number
  language: string
  text: string
  word_timestamps: WordTimestamp[]
  translations: Record<string, string>
  speaker?: string
  _intermediate?: boolean
}

export interface SessionShareInfo {
  share_token: string
  created_at: string
  share_expires_at?: string | null
  requires_password?: boolean
  generated_password?: string | null
}

export interface SessionConfig {
  audio_verify?: boolean
  asr_backend?: string
  audio_source?: AudioSource
  translation_enabled?: boolean
  meeting_url?: string
  llm_text_enabled?: boolean
  llm_text_model?: string
  llm_audio_model?: string
  vad_stop_hangover_ms?: number | null
}

export interface Session {
  id: string
  name: string
  target_languages: string[]
  meeting_type: MeetingType
  session_state: SessionState
  created_at: string
  blocks?: SpeechBlock[] | null
  blocks_next_cursor?: string | null
  share: SessionShareInfo | null
  is_live: boolean
  session_status?: SessionStatus | null
  bot_status?: BotStatus | null
  meeting_bot_id?: string | null
  meeting_bot_provider?: string | null
  config?: SessionConfig | null
  ws_token?: string | null
}

export interface CalendarEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  meeting_url: string | null
  bot_id: string | null
  target_languages: string[] | null
  is_recurring: boolean
  has_recurring_schedule: boolean
  ical_uid: string | null
}

export interface Speaker {
  id: string
  name: string
  label: string
  badgeColor: string
}

export interface LLMConfig {
  textEnabled: boolean
  textModel: string
  audioEnabled: boolean
  audioModel: string
}

// ── 상수 ────────────────────────────────────

export const MOCK_ORG = {
  id: "org-demo-001",
  name: "Acme Corp",
  slug: "acme-corp",
  logoUrl: undefined,
} as const

export const MOCK_USER = {
  id: "user-demo-001",
  name: "Alice Chen",
  email: "alice@acme.corp",
  avatarUrl: undefined,
} as const

export const MOCK_PLATFORMS = ["zoom", "google_meet", "teams", "webex"] as const

export const MOCK_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "es", name: "Español", flag: "🇪🇸" },
] as const

export const MOCK_LLM_CONFIGS: LLMConfig[] = [
  {
    textEnabled: true,
    textModel: "gemini-2.5-flash-lite",
    audioEnabled: true,
    audioModel: "gemini-2.5-flash",
  },
  {
    textEnabled: true,
    textModel: "gemini-2.0-flash-lite",
    audioEnabled: false,
    audioModel: "",
  },
  {
    textEnabled: false,
    textModel: "",
    audioEnabled: true,
    audioModel: "gemini-3.1-flash-lite-preview",
  },
]

export const MOCK_SPEAKERS: Speaker[] = [
  { id: "sp1", name: "Alice Chen", label: "AC", badgeColor: "bg-orange-400" },
  { id: "sp2", name: "Yuki Tanaka", label: "YT", badgeColor: "bg-blue-400" },
  { id: "sp3", name: "Kim Min-su", label: "KM", badgeColor: "bg-emerald-400" },
  { id: "sp4", name: "John Smith", label: "JS", badgeColor: "bg-violet-400" },
  { id: "sp5", name: "Sato Haruka", label: "SH", badgeColor: "bg-rose-400" },
]

const now = new Date()
const todayIso = now.toISOString()
const inOneHour = new Date(now.getTime() + 60 * 60 * 1000).toISOString()
const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
const tomorrowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString()
const inThreeDays = new Date(
  now.getTime() + 3 * 24 * 60 * 60 * 1000
).toISOString()
const inThreeDaysEnd = new Date(
  now.getTime() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000
).toISOString()

export const MOCK_SESSIONS: Session[] = [
  {
    id: "sess-live-001",
    name: "Q3 Roadmap Review",
    target_languages: ["en", "ko", "ja"],
    meeting_type: "remote",
    session_state: "live",
    created_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    share: null,
    is_live: true,
    session_status: "active",
    bot_status: "recording",
    meeting_bot_id: "bot-001",
    meeting_bot_provider: "zoom",
    config: {
      translation_enabled: true,
      meeting_url: "https://zoom.us/j/123456789",
      llm_text_enabled: true,
      llm_text_model: "gemini-2.5-flash-lite",
      llm_audio_model: "gemini-2.5-flash",
    },
  },
  {
    id: "sess-ended-002",
    name: "Design Sync — Weekly",
    target_languages: ["en", "ja"],
    meeting_type: "remote",
    session_state: "ended",
    created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    share: null,
    is_live: false,
    bot_status: "done",
    meeting_bot_id: "bot-002",
    meeting_bot_provider: "google_meet",
    config: {
      translation_enabled: true,
      meeting_url: "https://meet.google.com/abc-defg-hij",
      llm_text_enabled: true,
    },
  },
  {
    id: "sess-ended-003",
    name: "All-Hands Town Hall",
    target_languages: ["en", "ko", "ja"],
    meeting_type: "in-person",
    session_state: "ended",
    created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
    share: {
      share_token: "share-abc123",
      created_at: new Date(now.getTime() - 47 * 60 * 60 * 1000).toISOString(),
      share_expires_at: new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      requires_password: false,
    },
    is_live: false,
    bot_status: "done",
    config: {
      translation_enabled: true,
      llm_text_enabled: true,
      llm_audio_model: "gemini-2.5-flash",
    },
  },
  {
    id: "sess-scheduled-004",
    name: "Product Launch Planning",
    target_languages: ["en", "ko"],
    meeting_type: "remote",
    session_state: "scheduled",
    created_at: todayIso,
    share: null,
    is_live: false,
    config: {
      meeting_url: "https://teams.microsoft.com/l/meetup-join/...",
      translation_enabled: true,
    },
  },
]

export const MOCK_BLOCKS: SpeechBlock[] = [
  // ── sess-live-001: Q3 Roadmap Review (6 blocks) ──
  {
    id: "b-live-1",
    session_id: "sess-live-001",
    start_time: 12.0,
    end_time: 17.0,
    language: "en",
    text: "Let's kick off the Q3 roadmap review and align on priorities.",
    word_timestamps: [
      { text: "Let's", start_time: 12.0, end_time: 12.4 },
      { text: "kick", start_time: 12.5, end_time: 12.9 },
      { text: "off", start_time: 13.0, end_time: 13.3 },
      { text: "the", start_time: 13.4, end_time: 13.6 },
      { text: "Q3", start_time: 13.7, end_time: 14.1 },
      { text: "roadmap", start_time: 14.2, end_time: 14.7 },
      { text: "review", start_time: 14.8, end_time: 15.2 },
      { text: "and", start_time: 15.3, end_time: 15.5 },
      { text: "align", start_time: 15.6, end_time: 16.0 },
      { text: "on", start_time: 16.1, end_time: 16.3 },
      { text: "priorities.", start_time: 16.4, end_time: 17.0 },
    ],
    translations: {
      ko: "Q3 로드맵 리뷰를 시작하고 우선순위를 맞춰보죠.",
      ja: "Q3のロードマップレビューを始め、優先順位を揃えましょう。",
    },
    speaker: "Alice Chen",
  },
  {
    id: "b-live-2",
    session_id: "sess-live-001",
    start_time: 18.0,
    end_time: 22.5,
    language: "ja",
    text: "API仕様書のドラフトはすでにレビュー待ちの状態です。",
    word_timestamps: [
      { text: "API仕様書の", start_time: 18.0, end_time: 19.0 },
      { text: "ドラフトは", start_time: 19.1, end_time: 19.8 },
      { text: "すでに", start_time: 19.9, end_time: 20.5 },
      { text: "レビュー待ちの", start_time: 20.6, end_time: 21.6 },
      { text: "状態です。", start_time: 21.7, end_time: 22.5 },
    ],
    translations: {
      en: "The API specification draft is already awaiting review.",
      ko: "API 사양서 초안은 이미 검토 대기 상태입니다.",
    },
    speaker: "Yuki Tanaka",
  },
  {
    id: "b-live-3",
    session_id: "sess-live-001",
    start_time: 24.0,
    end_time: 27.8,
    language: "ko",
    text: "보안 감사 일정은 이번 주 금요일로 확정되었습니다.",
    word_timestamps: [
      { text: "보안", start_time: 24.0, end_time: 24.5 },
      { text: "감사", start_time: 24.6, end_time: 25.0 },
      { text: "일정은", start_time: 25.1, end_time: 25.6 },
      { text: "이번", start_time: 25.7, end_time: 26.1 },
      { text: "주", start_time: 26.2, end_time: 26.4 },
      { text: "금요일로", start_time: 26.5, end_time: 27.1 },
      { text: "확정되었습니다.", start_time: 27.2, end_time: 27.8 },
    ],
    translations: {
      en: "The security audit schedule has been confirmed for this Friday.",
      ja: "セキュリティ監査の日程は今週の金曜日に確定しました。",
    },
    speaker: "Kim Min-su",
  },
  {
    id: "b-live-4",
    session_id: "sess-live-001",
    start_time: 29.0,
    end_time: 33.9,
    language: "en",
    text: "The deployment pipeline will be ready by end of the week.",
    word_timestamps: [
      { text: "The", start_time: 29.0, end_time: 29.3 },
      { text: "deployment", start_time: 29.4, end_time: 30.1 },
      { text: "pipeline", start_time: 30.2, end_time: 30.8 },
      { text: "will", start_time: 30.9, end_time: 31.2 },
      { text: "be", start_time: 31.3, end_time: 31.5 },
      { text: "ready", start_time: 31.6, end_time: 32.0 },
      { text: "by", start_time: 32.1, end_time: 32.3 },
      { text: "end", start_time: 32.4, end_time: 32.7 },
      { text: "of", start_time: 32.8, end_time: 33.0 },
      { text: "the", start_time: 33.1, end_time: 33.3 },
      { text: "week.", start_time: 33.4, end_time: 33.9 },
    ],
    translations: {
      ko: "배포 파이프라인은 이번 주 말까지 준비될 예정입니다.",
      ja: "デプロイメントパイプラインは今週末までに準備完了予定です。",
    },
    speaker: "Alice Chen",
  },
  {
    id: "b-live-5",
    session_id: "sess-live-001",
    start_time: 35.0,
    end_time: 38.8,
    language: "ja",
    text: "パフォーマンス改善のベンチマーク結果を共有します。",
    word_timestamps: [
      { text: "パフォーマンス改善の", start_time: 35.0, end_time: 36.0 },
      { text: "ベンチマーク", start_time: 36.1, end_time: 37.0 },
      { text: "結果を", start_time: 37.1, end_time: 37.7 },
      { text: "共有します。", start_time: 37.8, end_time: 38.8 },
    ],
    translations: {
      en: "I'll share the performance improvement benchmark results.",
      ko: "성능 개선 벤치마크 결과를 공유하겠습니다.",
    },
    speaker: "Yuki Tanaka",
  },
  {
    id: "b-live-6",
    session_id: "sess-live-001",
    start_time: 40.0,
    end_time: 43.6,
    language: "ko",
    text: "새로운 인증 플로우에 대한 문서화가 완료되었어요.",
    word_timestamps: [
      { text: "새로운", start_time: 40.0, end_time: 40.5 },
      { text: "인증", start_time: 40.6, end_time: 41.0 },
      { text: "플로우에", start_time: 41.1, end_time: 41.7 },
      { text: "대한", start_time: 41.8, end_time: 42.2 },
      { text: "문서화가", start_time: 42.3, end_time: 42.9 },
      { text: "완료되었어요.", start_time: 43.0, end_time: 43.6 },
    ],
    translations: {
      en: "The documentation for the new authentication flow is complete.",
      ja: "新しい認証フローのドキュメント化が完了しました。",
    },
    speaker: "Kim Min-su",
  },

  // ── sess-ended-002: Design Sync — Weekly (6 blocks) ──
  {
    id: "b-design-1",
    session_id: "sess-ended-002",
    start_time: 12.0,
    end_time: 16.5,
    language: "en",
    text: "Let's go over the component library updates this week.",
    word_timestamps: [
      { text: "Let's", start_time: 12.0, end_time: 12.4 },
      { text: "go", start_time: 12.5, end_time: 12.8 },
      { text: "over", start_time: 12.9, end_time: 13.3 },
      { text: "the", start_time: 13.4, end_time: 13.6 },
      { text: "component", start_time: 13.7, end_time: 14.3 },
      { text: "library", start_time: 14.4, end_time: 14.9 },
      { text: "updates", start_time: 15.0, end_time: 15.5 },
      { text: "this", start_time: 15.6, end_time: 15.9 },
      { text: "week.", start_time: 16.0, end_time: 16.5 },
    ],
    translations: {
      ja: "今週のコンポーネントライブラリの更新点を確認しましょう。",
    },
    speaker: "Alice Chen",
  },
  {
    id: "b-design-2",
    session_id: "sess-ended-002",
    start_time: 18.0,
    end_time: 22.5,
    language: "ja",
    text: "新しいタイポグラフィスケールについてフィードバックをお願いします。",
    word_timestamps: [
      { text: "新しい", start_time: 18.0, end_time: 18.7 },
      {
        text: "タイポグラフィスケールについて",
        start_time: 18.8,
        end_time: 20.3,
      },
      { text: "フィードバックを", start_time: 20.4, end_time: 21.4 },
      { text: "お願いします。", start_time: 21.5, end_time: 22.5 },
    ],
    translations: {
      en: "I'd like some feedback on the new typography scale.",
    },
    speaker: "Sato Haruka",
  },
  {
    id: "b-design-3",
    session_id: "sess-ended-002",
    start_time: 24.0,
    end_time: 28.4,
    language: "en",
    text: "The dark mode implementation is about ninety percent done.",
    word_timestamps: [
      { text: "The", start_time: 24.0, end_time: 24.3 },
      { text: "dark", start_time: 24.4, end_time: 24.7 },
      { text: "mode", start_time: 24.8, end_time: 25.1 },
      { text: "implementation", start_time: 25.2, end_time: 25.9 },
      { text: "is", start_time: 26.0, end_time: 26.2 },
      { text: "about", start_time: 26.3, end_time: 26.7 },
      { text: "ninety", start_time: 26.8, end_time: 27.3 },
      { text: "percent", start_time: 27.4, end_time: 27.9 },
      { text: "done.", start_time: 28.0, end_time: 28.4 },
    ],
    translations: {
      ja: "ダークモードの実装は約90%完了しています。",
    },
    speaker: "John Smith",
  },
  {
    id: "b-design-4",
    session_id: "sess-ended-002",
    start_time: 30.0,
    end_time: 34.0,
    language: "ja",
    text: "アクセシビリティガイドラインのチェックリストを作成しました。",
    word_timestamps: [
      {
        text: "アクセシビリティガイドラインの",
        start_time: 30.0,
        end_time: 31.5,
      },
      { text: "チェックリストを", start_time: 31.6, end_time: 32.6 },
      { text: "作成しました。", start_time: 32.7, end_time: 34.0 },
    ],
    translations: {
      en: "I've created a checklist for the accessibility guidelines.",
    },
    speaker: "Sato Haruka",
  },
  {
    id: "b-design-5",
    session_id: "sess-ended-002",
    start_time: 36.0,
    end_time: 40.0,
    language: "en",
    text: "The prototype is ready for user testing next Tuesday.",
    word_timestamps: [
      { text: "The", start_time: 36.0, end_time: 36.3 },
      { text: "prototype", start_time: 36.4, end_time: 37.0 },
      { text: "is", start_time: 37.1, end_time: 37.3 },
      { text: "ready", start_time: 37.4, end_time: 37.8 },
      { text: "for", start_time: 37.9, end_time: 38.1 },
      { text: "user", start_time: 38.2, end_time: 38.5 },
      { text: "testing", start_time: 38.6, end_time: 39.0 },
      { text: "next", start_time: 39.1, end_time: 39.4 },
      { text: "Tuesday.", start_time: 39.5, end_time: 40.0 },
    ],
    translations: {
      ja: "プロトタイプは来週火曜日のユーザーテストに向けて準備完了です。",
    },
    speaker: "John Smith",
  },
  {
    id: "b-design-6",
    session_id: "sess-ended-002",
    start_time: 42.0,
    end_time: 45.5,
    language: "ja",
    text: "デザイントークンの命名規則を整理しました。",
    word_timestamps: [
      { text: "デザイントークンの", start_time: 42.0, end_time: 43.2 },
      { text: "命名規則を", start_time: 43.3, end_time: 44.3 },
      { text: "整理しました。", start_time: 44.4, end_time: 45.5 },
    ],
    translations: {
      en: "I've organized the naming conventions for design tokens.",
    },
    speaker: "Sato Haruka",
  },

  // ── sess-ended-003: All-Hands Town Hall (6 blocks) ──
  {
    id: "b-allhands-1",
    session_id: "sess-ended-003",
    start_time: 12.0,
    end_time: 16.3,
    language: "en",
    text: "Welcome everyone to our Q2 town hall and results review.",
    word_timestamps: [
      { text: "Welcome", start_time: 12.0, end_time: 12.5 },
      { text: "everyone", start_time: 12.6, end_time: 13.1 },
      { text: "to", start_time: 13.2, end_time: 13.4 },
      { text: "our", start_time: 13.5, end_time: 13.7 },
      { text: "Q2", start_time: 13.8, end_time: 14.1 },
      { text: "town", start_time: 14.2, end_time: 14.5 },
      { text: "hall", start_time: 14.6, end_time: 14.8 },
      { text: "and", start_time: 14.9, end_time: 15.1 },
      { text: "results", start_time: 15.2, end_time: 15.7 },
      { text: "review.", start_time: 15.8, end_time: 16.3 },
    ],
    translations: {
      ko: "Q2 타운 홀과 실적 리뷰에 모두 환영합니다.",
      ja: "Q2タウンホールと業績レビューへ皆様を歓迎します。",
    },
    speaker: "Alice Chen",
  },
  {
    id: "b-allhands-2",
    session_id: "sess-ended-003",
    start_time: 18.0,
    end_time: 21.3,
    language: "ko",
    text: "이번 분기 매출 목표를 초과 달성했습니다.",
    word_timestamps: [
      { text: "이번", start_time: 18.0, end_time: 18.4 },
      { text: "분기", start_time: 18.5, end_time: 18.9 },
      { text: "매출", start_time: 19.0, end_time: 19.4 },
      { text: "목표를", start_time: 19.5, end_time: 20.0 },
      { text: "초과", start_time: 20.1, end_time: 20.5 },
      { text: "달성했습니다.", start_time: 20.6, end_time: 21.3 },
    ],
    translations: {
      en: "We exceeded this quarter's revenue target.",
      ja: "今四半期の売上目標を超過達成しました。",
    },
    speaker: "Kim Min-su",
  },
  {
    id: "b-allhands-3",
    session_id: "sess-ended-003",
    start_time: 23.0,
    end_time: 27.5,
    language: "ja",
    text: "新しいエンジニアを三名採用することが決まりました。",
    word_timestamps: [
      { text: "新しい", start_time: 23.0, end_time: 23.7 },
      { text: "エンジニアを", start_time: 23.8, end_time: 24.7 },
      { text: "三名", start_time: 24.8, end_time: 25.4 },
      { text: "採用することが", start_time: 25.5, end_time: 26.5 },
      { text: "決まりました。", start_time: 26.6, end_time: 27.5 },
    ],
    translations: {
      en: "We have decided to hire three new engineers.",
      ko: "새로운 엔지니어를 세 명 채용하기로 결정되었습니다.",
    },
    speaker: "Yuki Tanaka",
  },
  {
    id: "b-allhands-4",
    session_id: "sess-ended-003",
    start_time: 29.0,
    end_time: 34.0,
    language: "en",
    text: "We just signed a major client with a record-breaking contract value.",
    word_timestamps: [
      { text: "We", start_time: 29.0, end_time: 29.2 },
      { text: "just", start_time: 29.3, end_time: 29.6 },
      { text: "signed", start_time: 29.7, end_time: 30.2 },
      { text: "a", start_time: 30.3, end_time: 30.4 },
      { text: "major", start_time: 30.5, end_time: 30.9 },
      { text: "client", start_time: 31.0, end_time: 31.5 },
      { text: "with", start_time: 31.6, end_time: 31.9 },
      { text: "a", start_time: 32.0, end_time: 32.1 },
      { text: "record-breaking", start_time: 32.2, end_time: 33.1 },
      { text: "contract", start_time: 33.2, end_time: 33.6 },
      { text: "value.", start_time: 33.7, end_time: 34.0 },
    ],
    translations: {
      ko: "기록적인 계약 금액의 대형 고객사를 방금 체결했습니다.",
      ja: "記録的な契約金額の大手顧客を先ほど獲得しました。",
    },
    speaker: "John Smith",
  },
  {
    id: "b-allhands-5",
    session_id: "sess-ended-003",
    start_time: 36.0,
    end_time: 40.4,
    language: "en",
    text: "Next quarter's OKRs focus on platform stability and growth.",
    word_timestamps: [
      { text: "Next", start_time: 36.0, end_time: 36.4 },
      { text: "quarter's", start_time: 36.5, end_time: 37.0 },
      { text: "OKRs", start_time: 37.1, end_time: 37.5 },
      { text: "focus", start_time: 37.6, end_time: 38.0 },
      { text: "on", start_time: 38.1, end_time: 38.3 },
      { text: "platform", start_time: 38.4, end_time: 38.9 },
      { text: "stability", start_time: 39.0, end_time: 39.5 },
      { text: "and", start_time: 39.6, end_time: 39.8 },
      { text: "growth.", start_time: 39.9, end_time: 40.4 },
    ],
    translations: {
      ko: "다음 분기의 OKR은 플랫폼 안정성과 성장에 중점을 둡니다。",
      ja: "来四半期のOKRはプラットフォームの安定性と成長に焦点を当てます。",
    },
    speaker: "John Smith",
  },
  {
    id: "b-allhands-6",
    session_id: "sess-ended-003",
    start_time: 42.0,
    end_time: 46.0,
    language: "ko",
    text: "질문 시간이니 궁금한 점을 자유롭게 해 주세요.",
    word_timestamps: [
      { text: "질문", start_time: 42.0, end_time: 42.5 },
      { text: "시간이니", start_time: 42.6, end_time: 43.2 },
      { text: "궁금한", start_time: 43.3, end_time: 43.8 },
      { text: "점을", start_time: 43.9, end_time: 44.3 },
      { text: "자유롭게", start_time: 44.4, end_time: 45.0 },
      { text: "해", start_time: 45.1, end_time: 45.4 },
      { text: "주세요.", start_time: 45.5, end_time: 46.0 },
    ],
    translations: {
      en: "It's Q&A time, so feel free to ask any questions.",
      ja: "質問の時間ですので、気になる点を自由にどうぞ。",
    },
    speaker: "Kim Min-su",
  },
]

export const MOCK_SUMMARIES: Record<
  string,
  { summary: string; keyPoints: string[] }
> = {
  "sess-live-001": {
    summary:
      "The Q3 roadmap review aligned engineering priorities across API specifications, deployment timelines, and security audit scheduling. The team confirmed the deployment pipeline readiness and finalized documentation for the new authentication flow.",
    keyPoints: [
      "Q3 deliverables aligned across the engineering team",
      "API spec draft is ready for review",
      "Security audit scheduled for this Friday",
      "Deployment pipeline to be ready by end of week",
      "New auth flow documentation completed",
    ],
  },
  "sess-ended-002": {
    summary:
      "The weekly design sync covered component library updates, dark mode progress at ninety percent completion, and new accessibility guidelines. The team prepared a prototype for user testing and organized design token naming conventions.",
    keyPoints: [
      "Component library updates reviewed",
      "Dark mode implementation at 90% completion",
      "Accessibility checklist created",
      "Prototype ready for next Tuesday's user testing",
      "Design token naming rules organized",
    ],
  },
  "sess-ended-003": {
    summary:
      "The Q2 all-hands town hall presented strong quarterly results with revenue exceeding targets, announced three new engineering hires, and highlighted a record-breaking enterprise contract. Leadership outlined next quarter's OKRs focused on platform stability and growth.",
    keyPoints: [
      "Q2 revenue targets exceeded",
      "Record-breaking enterprise contract signed",
      "Three new engineers joining the team",
      "Q3 OKRs prioritize platform stability and growth",
      "Open Q&A session for all employees",
    ],
  },
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-001",
    title: "Q3 Roadmap Review",
    start_time: todayIso,
    end_time: inOneHour,
    meeting_url: "https://zoom.us/j/123456789",
    bot_id: "bot-001",
    target_languages: ["en", "ko", "ja"],
    is_recurring: false,
    has_recurring_schedule: false,
    ical_uid: "ical-001",
  },
  {
    id: "cal-002",
    title: "Design Sync — Weekly",
    start_time: inOneHour,
    end_time: inTwoHours,
    meeting_url: "https://meet.google.com/abc-defg-hij",
    bot_id: "bot-002",
    target_languages: ["en", "ja"],
    is_recurring: true,
    has_recurring_schedule: true,
    ical_uid: "ical-002",
  },
  {
    id: "cal-003",
    title: "Product Launch Planning",
    start_time: tomorrow,
    end_time: tomorrowEnd,
    meeting_url: "https://teams.microsoft.com/l/meetup-join/...",
    bot_id: null,
    target_languages: ["en", "ko"],
    is_recurring: false,
    has_recurring_schedule: false,
    ical_uid: "ical-003",
  },
  {
    id: "cal-004",
    title: "Engineering All-Hands",
    start_time: inThreeDays,
    end_time: inThreeDaysEnd,
    meeting_url: null,
    bot_id: null,
    target_languages: ["en"],
    is_recurring: true,
    has_recurring_schedule: true,
    ical_uid: "ical-004",
  },
  {
    id: "cal-005",
    title: "Client Kickoff — Japan",
    start_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(
      now.getTime() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000
    ).toISOString(),
    meeting_url: "https://zoom.us/j/987654321",
    bot_id: null,
    target_languages: ["en", "ja"],
    is_recurring: false,
    has_recurring_schedule: false,
    ical_uid: "ical-005",
  },
]

// ── 헬퍼 함수 ───────────────────────────────

/** 초를 "m:ss" 또는 "h:mm:ss" 형식으로 변환 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const mm = String(m).padStart(2, "0")
  const ss = String(s).padStart(2, "0")
  if (h > 0) return `${h}:${mm}:${ss}`
  return `${m}:${ss}`
}

/** 상대 시간 문자열 반환 (예: "방금", "5분 전", "2시간 전", "어제", "3일 전") */
export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 10) return "just now"
  if (diffMin < 1) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay === 1) return "yesterday"
  return `${diffDay}d ago`
}
