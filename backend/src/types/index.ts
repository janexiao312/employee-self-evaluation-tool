// ---------------------------------------------------------------------------
// Shared domain types for the backend.
// Keep in sync with frontend/src/types/index.ts.
// ---------------------------------------------------------------------------

export type PillarId =
  | 'client-delivery'
  | 'leadership'
  | 'business-development'
  | 'firm-contribution';

export type Dimension =
  | 'quantifiable-impact'
  | 'stakeholder-reach'
  | 'leadership-behaviors'
  | 'strategic-alignment'
  | 'business-outcomes';

// ---------------------------------------------------------------------------
// Level expectations
// ---------------------------------------------------------------------------

export interface LevelExpectationsFile {
  level: string;
  practice: string;
  version: string;
  pillars: Record<PillarId, PillarExpectations>;
}

export interface PillarExpectations {
  pillarId: PillarId;
  displayName: string;
  description: string;
  criteria: ExpectationCriterion[];
}

export interface ExpectationCriterion {
  id: string;
  dimension: Dimension;
  text: string;
}

// ---------------------------------------------------------------------------
// API request / response shapes
// ---------------------------------------------------------------------------

// POST /api/generate-writeup
export interface GenerateWriteUpRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  freeFormInput: string;           // max 10,000 chars
  levelExpectations: LevelExpectationsFile;
}

export interface GenerateWriteUpResponse {
  // All 4 pillar sections are always present — no nulls.
  sections: Record<PillarId, { text: string; wordCount: number }>;
}

// POST /api/revise-section
export interface ReviseSectionRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillarId: PillarId;
  currentText: string;
  revisionNote: string;            // max 1,000 chars
  originalFreeFormInput: string;   // full original free-form input for context
  expectations: PillarExpectations;
}

export interface ReviseSectionResponse {
  text: string;
  wordCount: number;
}

// ---------------------------------------------------------------------------
// LLM adapter
// ---------------------------------------------------------------------------

export interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

export interface LLMAdapter {
  complete(
    systemPrompt: string,
    userMessage: string,
    options?: CompletionOptions,
  ): Promise<string>;
}
