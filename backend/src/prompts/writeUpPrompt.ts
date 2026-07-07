import type { LevelExpectationsFile, PillarId } from '../types/index.js';

export interface WriteUpPromptParams {
  reviewPeriod: 'mid-year' | 'end-of-year';
  levelExpectations: LevelExpectationsFile;
}

const PILLAR_ORDER: PillarId[] = [
  'client-delivery',
  'leadership',
  'business-development',
  'firm-contribution',
];

const MAX_FREE_FORM_CHARS = 10_000;

function buildPillarExpectationsText(levelExpectations: LevelExpectationsFile): string {
  return PILLAR_ORDER.map((pillarId) => {
    const pillar = levelExpectations.pillars[pillarId];
    if (!pillar) return '';
    const criteriaLines = pillar.criteria
      .map((c) => `  - [${c.dimension}] ${c.text}`)
      .join('\n');
    return `### ${pillar.displayName}\n${pillar.description}\n\nCriteria:\n${criteriaLines}`;
  })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Builds the system prompt for write-up generation.
 * The prompt instructs the LLM to map the employee's free-form input across
 * all four evaluation pillars using the level expectations as a reference.
 */
export function buildWriteUpSystemPrompt(params: WriteUpPromptParams): string {
  const { reviewPeriod, levelExpectations } = params;

  const reviewPeriodFraming =
    reviewPeriod === 'mid-year'
      ? 'Frame all contributions as progress to date and ongoing work.'
      : 'Frame all contributions as full-year achievements and completed outcomes.';

  const pillarExpectationsText = buildPillarExpectationsText(levelExpectations);

  return `You are an expert career coach writing a first-person self-evaluation narrative for a ${levelExpectations.level} ${levelExpectations.practice} professional covering their ${reviewPeriod} performance review.

Your task: read the employee's free-form input and generate a structured write-up with a dedicated section for each of the four evaluation pillars:
- Client Delivery
- Leadership
- Business Development
- Firm Contribution

Map the employee's contributions to the most appropriate pillars based on the level expectations provided below. Each pillar section should draw from the input wherever relevant. If a pillar has limited relevant content in the input, write a brief section acknowledging limited information rather than fabricating content.

VOICE AND STYLE RULES:
- Write in first-person voice using complete sentences and formal vocabulary
- No slang, casual expressions, or contractions
- Each pillar section must be 150-350 words
- ${reviewPeriodFraming}

LEVEL EXPECTATIONS BY PILLAR:
${pillarExpectationsText}

Return your response as JSON in exactly this format:
{
  "sections": {
    "client-delivery": { "text": string, "wordCount": number },
    "leadership": { "text": string, "wordCount": number },
    "business-development": { "text": string, "wordCount": number },
    "firm-contribution": { "text": string, "wordCount": number }
  }
}`;
}

/**
 * Builds the user message for write-up generation.
 * The free-form input is truncated to 10,000 chars and wrapped in XML delimiters
 * to prevent prompt injection.
 */
export function buildWriteUpUserMessage(freeFormInput: string): string {
  const truncated = freeFormInput.slice(0, MAX_FREE_FORM_CHARS);
  return `<employee_input>
${truncated}
</employee_input>`;
}
