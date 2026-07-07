/**
 * Express 5 application setup.
 *
 * Exports the configured `app` instance so it can be imported by index.ts
 * (for production) and by tests (without binding to a port).
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import cors from 'cors';

import { generateWriteUpRouter } from './routes/generateWriteUp.js';
import { levelExpectationsRouter } from './routes/levelExpectations.js';
import { reviseSectionRouter } from './routes/reviseSection.js';

// ---------------------------------------------------------------------------
// App instance
// ---------------------------------------------------------------------------

export const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// CORS — allow all origins in dev; tighten via ALLOWED_ORIGIN env var in prod.
const allowedOrigin = process.env['ALLOWED_ORIGIN'] ?? '*';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// JSON body parsing — 2 MB limit to accommodate level-expectations payload in request body.
app.use(express.json({ limit: '2mb' }));

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.use('/api', levelExpectationsRouter);
app.use('/api', generateWriteUpRouter);
app.use('/api', reviseSectionRouter);

// ---------------------------------------------------------------------------
// 404 handler — catches requests that matched no route
// ---------------------------------------------------------------------------

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found.', code: 'NOT_FOUND' });
});

// ---------------------------------------------------------------------------
// Global error handler
//
// Express 5 propagates async errors automatically, so no need for
// express-async-errors or manual next(err) wrapping in route handlers.
// All unhandled errors land here and are normalised to { error, code }.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[GlobalErrorHandler]', err);

  // Zod / validation errors forwarded by route handlers
  if (isValidationError(err)) {
    res.status(400).json({ error: err.message, code: 'VALIDATION_ERROR' });
    return;
  }

  // Generic / unexpected errors
  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred.';
  res.status(500).json({ error: message, code: 'INTERNAL_ERROR' });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ValidationError {
  message: string;
  isValidation: true;
}

function isValidationError(err: unknown): err is ValidationError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'isValidation' in err &&
    (err as ValidationError).isValidation === true
  );
}
