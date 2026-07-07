import type { PillarExpectations } from '../types/index.js';

export interface RevisePromptParams {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillarDisplayName: string;
  expectations: PillarExpectations;
  currentText: string;
}

const MAX_FREE_FORM_CHARS = 10_000;
const MAX_REVISION_NOTE_CHARS = 1_000;

/**
 * Builds the system prompt for revising a single pillar section.
 * Embeds the pillar's criteria, current section text, and review period framing.
 */
export function buildRevisionSystemPrompt(params: RevisePromptParams): string {
  const { reviewPeriod, pillarDisplayName, expectations, currentText } = params;

  const reviewPeriodFraming =
    reviewPeriod === 'mid-year'
      ? 'Frame all contributions as progress to date and ongoing work.'
      : 'Frame all contributions as full-year achievements and completed outcomes.';

  const criteriaLines = expectations.criteria
    .map((c) => `  - [${c.dimension}] ${c.text}`)
    .join('\n');

  return `You are an expert career coach revising a single section of a first-person self-evaluation for a ${reviewPeriod} performance review.

The employee has provided additional information or corrections for the ${pillarDisplayName} section. Incorporate this feedback into a revised section.

VOICE AND STYLE RULES:
- Write in first-person voice using complete sentences and formal vocabulary
- No slang, casual expressions, or contractions
- The revised section must be 150-350 words
- ${reviewPeriodFraming}

LEVEL EXPECTATIONS FOR ${pillarDisplayName.toUpperCase()}:
${expectations.description}

Criteria:
${criteriaLines}

CURRENT SECTION TEXT (for reference):
${currentText}

Return your response as JSON in exactly this format:
{ "text": string, "wordCount": number }`;
}

/**
 * Builds the user message for section revision.
 * Wraps the original free-form input and revision note in XML delimiters
 * to prevent prompt injection.
 */
export function buildRevisionUserMessage(params: {
  originalFreeFormInput: string;
  revisionNote: string;
}): string {
  const truncatedInput = params.originalFreeFormInput.slice(0, MAX_FREE_FORM_CHARS);
  const truncatedNote = params.revisionNote.slice(0, MAX_REVISION_NOTE_CHARS);

  return `<employee_input>
${truncatedInput}
</employee_input>

<revision_note>
${truncatedNote}
</revision_note>`;
}
