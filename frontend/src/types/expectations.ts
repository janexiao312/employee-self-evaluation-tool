/**
 * Types for the level expectations static JSON data bundled with the frontend.
 * The data is loaded at startup and cached in React context.
 *
 * Source file: src/data/level-expectations.json
 * Served by backend at: GET /api/level-expectations/:level/:practice
 */

import type { Dimension, PillarId } from './session';

/** A single expectation criterion tied to a specific evaluation dimension. */
export interface ExpectationCriterion {
  /** Stable unique identifier for this criterion (e.g. "cd-qi-01"). */
  id: string;
  dimension: Dimension;
  /** The actual expectation statement shown in the UI and embedded in prompts. */
  text: string;
}

/** All criteria and metadata for a single evaluation pillar at a given level. */
export interface PillarExpectations {
  pillarId: PillarId;
  /** Human-readable pillar name displayed in the UI (e.g. "Client Delivery"). */
  displayName: string;
  /** Brief focus-area description shown alongside the input textarea. */
  description: string;
  criteria: ExpectationCriterion[];
}

/**
 * Top-level shape of the level expectations JSON file.
 * Versioned so content updates can be tracked without breaking existing sessions.
 */
export interface LevelExpectationsFile {
  /** Level slug, e.g. "sr-principal". */
  level: string;
  /** Practice slug, e.g. "client-delivery". */
  practice: string;
  /** Content version string, e.g. "2024-H1". */
  version: string;
  pillars: Record<PillarId, PillarExpectations>;
}
