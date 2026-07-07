import { Router } from 'express';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { LevelExpectationsFile } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const levelExpectationsRouter = Router();

/**
 * GET /api/level-expectations/:level/:practice
 *
 * Returns the level expectations JSON for a given level + practice.
 * For the POC, only "sr-principal/client-delivery" is supported.
 */
levelExpectationsRouter.get(
  '/level-expectations/:level/:practice',
  (req, res) => {
    const { level, practice } = req.params as { level: string; practice: string };

    // Allowlist supported combinations to prevent path-traversal attacks.
    const SUPPORTED = new Set(['sr-principal/client-delivery']);
    const key = `${level}/${practice}`;

    if (!SUPPORTED.has(key)) {
      res.status(404).json({
        error: `No level expectations found for "${key}".`,
        code: 'LEVEL_NOT_FOUND',
      });
      return;
    }

    try {
      const dataPath = join(
        __dirname,
        '..',
        'data',
        `${level}-${practice}.json`,
      );
      const raw = readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(raw) as LevelExpectationsFile;
      res.json(data);
    } catch {
      res.status(500).json({
        error: 'Failed to load level expectations data.',
        code: 'DATA_LOAD_ERROR',
      });
    }
  },
);
