import { Router } from 'express';
import { z } from 'zod';

export const generateWriteUpRouter = Router();

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

const pillarExpectationsSchema = z.object({
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
});

const levelExpectationsSchema = z.object({
  level: z.string(),
  practice: z.string(),
  version: z.string(),
  pillars: z.object({
    'client-delivery': pillarExpectationsSchema,
    'leadership': pillarExpectationsSchema,
    'business-development': pillarExpectationsSchema,
    'firm-contribution': pillarExpectationsSchema,
  }),
});

const generateWriteUpRequestSchema = z.object({
  reviewPeriod: z.enum(['mid-year', 'end-of-year']),
  freeFormInput: z.string().min(1).max(10_000),
  levelExpectations: levelExpectationsSchema,
});

/**
 * POST /api/generate-writeup
 *
 * Accepts free-form input and level expectations; generates all 4 pillar
 * sections by mapping the input to each pillar via LLM.
 *
 * NOTE: LLM integration is wired up in a subsequent task.
 */
generateWriteUpRouter.post('/generate-writeup', async (req, res) => {
  const parsed = generateWriteUpRequestSchema.safeParse(req.body);

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
