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

export type Page =
  | "meetings"
  | "meeting-active"
  | "meeting-detail"
  | "customization"
  | "settings"
  | "dashboard"
  | "calendar"
  | "shared"
  | "dev-audio"

export interface Participant {
  id: number
  name: string
  is_host: boolean
  platform: string
  email?: string
}

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

export interface BotCreateResponse {
  session_id: string
  bot_id: string
  status: BotStatus
  share_url?: string
}

export interface WSParticipantMessage {
  type: "participant"
  event: "join" | "leave" | "speech_on" | "speech_off"
  participant: Participant
}

export interface WSBotStatusMessage {
  type: "bot_status"
  status: BotStatus
  bot_id: string
}

export interface SessionShareInfo {
  share_token: string
  created_at: string
  share_expires_at?: string | null
  requires_password?: boolean
  generated_password?: string | null
}

export type SessionState =
  | "scheduled"
  | "live"
  | "ended"
  | "cancelled"
  | "auto_join_failed"

// Runtime activity status from the Redis lease, independent of session_state
// lifecycle. Only meaningful when the session is live.
export type SessionStatus = "active" | "paused"

export const TERMINAL_SESSION_STATES = new Set<SessionState>([
  "ended",
  "cancelled",
  "auto_join_failed",
])

export interface Session {
  id: string
  name: string
  target_languages: string[]
  meeting_type: "in-person" | "remote"
  session_state: SessionState
  created_at: string
  // null when the server didn't include blocks (pure metadata);
  // populated only when the caller passed ?include=blocks.
  blocks?: SpeechBlock[] | null
  blocks_next_cursor?: string | null
  share: SessionShareInfo | null
  is_live: boolean
  session_status?: SessionStatus | null
  bot_status?: BotStatus | null
  meeting_bot_id?: string | null
  meeting_bot_provider?: string | null
  config?: {
    audio_verify?: boolean
    asr_backend?: string
    audio_source?: AudioSource
    translation_enabled?: boolean
    meeting_url?: string
    llm_text_enabled?: boolean
    llm_text_model?: string
    llm_audio_model?: string
    vad_stop_hangover_ms?: number | null
  } | null
  ws_token?: string | null
}

export interface SessionListResponse {
  items: Session[]
  next_cursor: string | null
}

export interface SessionBlocksResponse {
  items: SpeechBlock[]
  next_cursor: string | null
}

export interface ShareInfo {
  share_token: string
  share_url: string
  share_expires_at?: string | null
  requires_password?: boolean
  generated_password?: string | null
}

export interface SharedSession {
  id: string
  name: string
  target_languages: string[]
  meeting_type: "in-person" | "remote"
  session_state: SessionState
  created_at: string
  blocks: SpeechBlock[]
  blocks_next_cursor?: string | null
  is_live: boolean
  session_status?: SessionStatus | null
  config?: {
    translation_enabled?: boolean
  } | null
}

export interface UserSettings {
  preferred_language: string
  theme: string
  upcoming_days: number
  hotwords: string[]
  enabled_hotword_presets: string[]
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

export interface CalendarEventListResponse {
  items: CalendarEvent[]
  next_cursor: string | null
  prev_cursor: string | null
  closest_index: number | null
}

export interface Organization {
  id: string
  name: string
  slug: string
}

// WebSocket message types
export interface WSTranscriptMessage {
  type: "transcript"
  block: SpeechBlock
}

export interface WSTranslationMessage {
  type: "translation"
  block_id: string
  translations: Record<string, string>
}

export interface PartialBlock {
  id: string // always "partial"
  session_id: string
  start_time: number
  end_time: number
  language: string
  text: string
  translations?: Record<string, string>
  speaker?: string
}

export interface WSIntermediateTranscriptMessage {
  type: "intermediate_transcript"
  block: SpeechBlock
}

export interface WSPartialTranscriptMessage {
  type: "partial_transcript"
  partial: PartialBlock
}

export type WSServerMessage =
  | WSTranscriptMessage
  | WSTranslationMessage
  | WSIntermediateTranscriptMessage
  | WSPartialTranscriptMessage
  | WSParticipantMessage
  | WSBotStatusMessage

export interface WSControlMessage {
  type: "start" | "stop" | "pause" | "resume"
  session_id?: string
  target_languages?: string[]
}

// Audio source types
export type AudioSource = "mic" | "screen" | "mix" | "bot"

export const AUDIO_SOURCE_KEYS: Record<AudioSource, string> = {
  mic: "audio.mic",
  screen: "audio.screen",
  mix: "audio.mix",
  bot: "audio.bot",
}

// Language helpers
export const UI_LANGUAGES = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
} as const

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
}

// LLM stage configuration (dev-only)
export interface LLMConfig {
  textEnabled: boolean
  textModel: string
  audioEnabled: boolean
  audioModel: string
}

export const LLM_TEXT_MODELS: Record<string, string> = {
  "": "Default (gemini-3.1-flash-lite)",
  "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
  "gemini-2.0-flash-lite": "Gemini 2.0 Flash Lite",
}

export const LLM_AUDIO_MODELS: Record<string, string> = {
  "": "Default (gemini-3-flash)",
  "gemini-2.5-flash": "Gemini 2.5 Flash",
  "gemini-2.0-flash": "Gemini 2.0 Flash",
  "gemini-3.1-flash-lite-preview": "Gemini 3.1 Flash Lite",
}

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  textEnabled: true,
  textModel: "",
  audioEnabled: true,
  audioModel: "",
}

export const ASR_BACKEND_DEFAULT = "" as const
export const ASR_BACKEND_LLM_DIRECT = "llm-direct" as const

export const ASR_BACKENDS: Record<string, string> = {
  [ASR_BACKEND_DEFAULT]: "Default (Azure STT)",
  [ASR_BACKEND_LLM_DIRECT]: "LLM Direct (Audio → LLM)",
}

export const LANGUAGE_FLAGS: Record<string, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  th: "🇹🇭",
  vi: "🇻🇳",
}

export const BETA_LANGUAGES: ReadonlySet<string> = new Set(["th", "vi"])
