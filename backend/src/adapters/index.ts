/**
 * LLM adapter factory.
 *
 * Reads the LLM_PROVIDER environment variable and returns the appropriate
 * concrete adapter. Defaults to Bedrock when the variable is unset.
 *
 * Supported values for LLM_PROVIDER:
 *   'bedrock'      — Amazon Bedrock (default)
 *   'azure-openai' — Azure OpenAI
 */

import type { LLMAdapter } from './llmAdapter.js';
import { BedrockAdapter } from './bedrockAdapter.js';
import { AzureOpenAIAdapter } from './azureOpenAIAdapter.js';

export type { LLMAdapter, CompletionOptions } from './llmAdapter.js';

export type LLMProvider = 'bedrock' | 'azure-openai';

/**
 * Create and return an LLM adapter based on the LLM_PROVIDER env var.
 * Throws if an unrecognised provider name is specified.
 */
export function createAdapter(): LLMAdapter {
  const provider = (process.env['LLM_PROVIDER'] ?? 'bedrock') as LLMProvider;

  switch (provider) {
    case 'bedrock':
      return new BedrockAdapter();
    case 'azure-openai':
      return new AzureOpenAIAdapter();
    default: {
      // Exhaustiveness check — TypeScript will flag unknown values at compile time.
      const _exhaustive: never = provider;
      throw new Error(`Unknown LLM_PROVIDER value: "${String(_exhaustive)}". Use "bedrock" or "azure-openai".`);
    }
  }
}
