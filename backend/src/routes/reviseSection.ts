import { Router } from 'express';
import { z } from 'zod';

export const reviseSectionRouter = Router();

// ---------------------------------------------------------------------------
// Zod input schema
// ---------------------------------------------------------------------------

const dimensionEnum = z.enum([
  'quantifiable-impact',
  'stakeholder-reach',
  'leadership-behaviors',
  'strategic-alignment',
  'business-outcomes',
]);

const pillarIdEnum = z.enum([
  'client-delivery',
  'leadership',
  'business-development',
  'firm-contribution',
]);

const reviseSectionRequestSchema = z.object({
  reviewPeriod: z.enum(['mid-year', 'end-of-year']),
  pillarId: pillarIdEnum,
  currentText: z.string(),
  revisionNote: z.string().max(1_000),
  originalFreeFormInput: z.string().max(10_000),
  expectations: z.object({
    pillarId: pillarIdEnum,
    displayName: z.string(),
    description: z.string(),
    criteria: z.array(
      z.object({
        id: z.string(),
        dimension: dimensionEnum,
        text: z.string(),
      }),
    ),
  }),
});

/**
 * POST /api/revise-section
 *
 * Regenerates a single pillar section given the original free-form input,
 * current section text, and revision notes.
 *
 * NOTE: LLM integration is wired up in a subsequent task.
 */
reviseSectionRouter.post('/revise-section', async (req, res) => {
  const parsed = reviseSectionRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid request body.',
      code: 'VALIDATION_ERROR',
      details: parsed.error.flatten(),
    });
    return;
  }

  // TODO: Replace stub with prompt engine + LLM adapter call (Task 6.x).
  res.status(501).json({
    error: 'LLM integration not yet implemented.',
    code: 'NOT_IMPLEMENTED',
  });
});
