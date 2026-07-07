import { describe, it, expect } from 'vitest';
import { buildWriteUpSystemPrompt, buildWriteUpUserMessage } from './writeUpPrompt.js';
import type { LevelExpectationsFile } from '../types/index.js';

// ---------------------------------------------------------------------------
// Minimal level expectations fixture covering all 4 pillars
// ---------------------------------------------------------------------------
const mockLevelExpectations: LevelExpectationsFile = {
  level: 'sr-principal',
  practice: 'client-delivery',
  version: '2024-H1',
  pillars: {
    'client-delivery': {
      pillarId: 'client-delivery',
      displayName: 'Client Delivery',
      description: 'Drive exceptional client outcomes.',
      criteria: [
        {
          id: 'cd-1',
          dimension: 'quantifiable-impact',
          text: 'Delivers measurable outcomes tied to client goals.',
        },
      ],
    },
    leadership: {
      pillarId: 'leadership',
      displayName: 'Leadership',
      description: 'Lead and mentor others effectively.',
      criteria: [
        {
          id: 'l-1',
          dimension: 'leadership-behaviors',
          text: 'Models inclusive leadership behaviors.',
        },
      ],
    },
    'business-development': {
      pillarId: 'business-development',
      displayName: 'Business Development',
      description: 'Grow the firm through pipeline and proposals.',
      criteria: [
        {
          id: 'bd-1',
          dimension: 'business-outcomes',
          text: 'Contributes to proposal development and pipeline growth.',
        },
      ],
    },
    'firm-contribution': {
      pillarId: 'firm-contribution',
      displayName: 'Firm Contribution',
      description: 'Invest in firm-wide initiatives and knowledge sharing.',
      criteria: [
        {
          id: 'fc-1',
          dimension: 'strategic-alignment',
          text: 'Leads or participates in internal community initiatives.',
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// buildWriteUpSystemPrompt
// ---------------------------------------------------------------------------
describe('buildWriteUpSystemPrompt', () => {
  it('contains the mid-year framing string when reviewPeriod is mid-year', () => {
    const prompt = buildWriteUpSystemPrompt({
      reviewPeriod: 'mid-year',
      levelExpectations: mockLevelExpectations,
    });
    expect(prompt).toContain('Frame all contributions as progress to date and ongoing work.');
  });

  it('does NOT contain the end-of-year framing string when reviewPeriod is mid-year', () => {
    const prompt = buildWriteUpSystemPrompt({
      reviewPeriod: 'mid-year',
      levelExpectations: mockLevelExpectations,
    });
    expect(prompt).not.toContain(
      'Frame all contributions as full-year achievements and completed outcomes.',
    );
  });

  it('contains the end-of-year framing string when reviewPeriod is end-of-year', () => {
    const prompt = buildWriteUpSystemPrompt({
      reviewPeriod: 'end-of-year',
      levelExpectations: mockLevelExpectations,
    });
    expect(prompt).toContain(
      'Frame all contributions as full-year achievements and completed outcomes.',
    );
  });

  it('contains criteria text from all 4 pillars', () => {
    const prompt = buildWriteUpSystemPrompt({
      reviewPeriod: 'mid-year',
      levelExpectations: mockLevelExpectations,
    });

    // Each pillar's criterion text must appear in the prompt
    expect(prompt).toContain('Delivers measurable outcomes tied to client goals.');
    expect(prompt).toContain('Models inclusive leadership behaviors.');
    expect(prompt).toContain('Contributes to proposal development and pipeline growth.');
    expect(prompt).toContain('Leads or participates in internal community initiatives.');
  });

  it('contains all four pillar display names', () => {
    const prompt = buildWriteUpSystemPrompt({
      reviewPeriod: 'mid-year',
      levelExpectations: mockLevelExpectations,
    });

    expect(prompt).toContain('Client Delivery');
    expect(prompt).toContain('Leadership');
    expect(prompt).toContain('Business Development');
    expect(prompt).toContain('Firm Contribution');
  });
});

// ---------------------------------------------------------------------------
// buildWriteUpUserMessage
// ---------------------------------------------------------------------------
describe('buildWriteUpUserMessage', () => {
  it('wraps the input in <employee_input> XML delimiters', () => {
    const input = 'I led several key initiatives this year.';
    const message = buildWriteUpUserMessage(input);
    expect(message).toContain('<employee_input>');
    expect(message).toContain('</employee_input>');
    expect(message).toContain(input);
  });

  it('truncates input longer than 10,000 characters', () => {
    const longInput = 'a'.repeat(15_000);
    const message = buildWriteUpUserMessage(longInput);

    // The embedded text must not exceed 10,000 chars of the original input
    expect(message).toContain('a'.repeat(10_000));
    expect(message).not.toContain('a'.repeat(10_001));
  });

  it('preserves input that is exactly 10,000 characters', () => {
    const exactInput = 'b'.repeat(10_000);
    const message = buildWriteUpUserMessage(exactInput);
    expect(message).toContain(exactInput);
  });

  it('preserves input that is shorter than 10,000 characters', () => {
    const shortInput = 'Short input text.';
    const message = buildWriteUpUserMessage(shortInput);
    expect(message).toContain(shortInput);
  });
});
