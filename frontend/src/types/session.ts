/**
 * Session state types for the Employee Self-Evaluation Tool.
 * All session data is persisted to localStorage under the key `ese_session_v1`.
 */

/** The four evaluation pillars. */
export type PillarId =
  | 'client-delivery'
  | 'leadership'
  | 'business-development'
  | 'firm-contribution';

/** Linear workflow steps that represent each screen/phase of the wizard. */
export type WorkflowStep =
  | 'review-period-selection'
  | 'free-form-input'
  | 'write-up';

/**
 * The five evaluation dimensions used to classify criteria in level
 * expectations and to track coverage gaps in pillar mapping.
 */
export type Dimension =
  | 'quantifiable-impact'
  | 'stakeholder-reach'
  | 'leadership-behaviors'
  | 'strategic-alignment'
  | 'business-outcomes';

/** Per-pillar write-up section produced by the AI. */
export interface WriteUpSection {
  pillarId: PillarId;
  currentText: string;
  /** Populated after the first revision; null before any revision has been applied. */
  previousText: string | null;
  wordCount: number;
  /** Increments on each regeneration request. */
  generationVersion: number;
}

/** Aggregated write-up state. */
export interface WriteUpState {
  /** ISO 8601 timestamp of when the write-up was first generated. */
  generatedAt: string;
  /** Index (0–3) of the pillar section currently displayed in the write-up review. */
  activePillarIndex: number;
  /** All four pillar sections; every key is always present after generation. */
  sections: Record<PillarId, WriteUpSection>;
}

/**
 * Root session state serialized as JSON to `localStorage['ese_session_v1']`.
 * The `version` discriminant enables forward migration if the schema changes.
 */
export interface SessionState {
  version: 1;
  /** ISO 8601 timestamp of the last save; used for the 7-day expiry check. */
  savedAt: string;
  reviewPeriod: 'mid-year' | 'end-of-year' | null;
  currentStep: WorkflowStep;
  /** Raw free-form input text; max 10,000 chars. */
  freeFormInput: string;
  writeUp: WriteUpState | null;
}
